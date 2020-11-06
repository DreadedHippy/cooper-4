import Chance from 'chance';
import _ from 'lodash';

import EMOJIS from '../../../../bot/core/config/emojis.json';
import CHANNELS from '../../../../bot/core/config/channels.json';

import STATE from '../../../../bot/state';

import ChannelsHelper from '../../../../bot/core/entities/channels/channelsHelper';
import EventsHelper from '../../events/eventsHelper';
import MessagesHelper from '../../../../bot/core/entities/messages/messagesHelper';
import ServerHelper from '../../../../bot/core/entities/server/serverHelper';
import VotingHelper from '../../../events/voting/votingHelper';
import ItemsHelper from '../../items/itemsHelper';


// TODO: Check every 5 minutes for cratedrop etc, just don't ping every time.
// Make message "within next few minutes, not now"


/**
 * Laxative - Spawns an egg randomly
 * Toxic Egg - Places a toxic egg
 * Mine - Places a mine
 * Bomb
 * Rope - ???? No fucking idea
 * Shield  - Protects from Bombs, IEDs, Mines
 * Defuse kit - Defuse Bombs, IEDs, Mines
 * IED - Kicks member out of server
 */
const CRATE_DATA = {
    AVERAGE_CRATE: {
        emoji: EMOJIS.AVERAGE_CRATE,
        maxReward: 2,
        rewards: [
            'BOMB',
            'LAXATIVE',
            'TOXIC_EGG',
            'PICK_AXE',
            'FRYING_PAN',
            'EMPTY_GIFTBOX',
            'WOOD'
        ]
    },
    RARE_CRATE: {
        emoji: EMOJIS.RARE_CRATE,
        maxReward: 1,
        rewards: [
            'ROPE',
            'SHIELD',
            'MINE',
            'DEFUSE_KIT'
        ]
    },
    LEGENDARY_CRATE: {
        emoji: EMOJIS.LEGENDARY_CRATE,
        maxReward: 1,
        rewards: [
            'IED',
            'RPG',
            'GOLD_BAR',
            'GOLD_COIN',
            'SILVER_BAR',
            'DIAMOND'
        ]
    },
};

// Rarity likelihood base number.
const likelihood = 15;

export default class CratedropMinigame {
    
    // Reaction interceptor to check if user is attempting to play Crate Drop
    static onReaction(reaction, user) {
        try {
            if (reaction.message.author.id !== STATE.CLIENT.user.id) return false;
            if (!this.calculateRarityFromMessage(reaction.message)) return false;
            if (this.isCrateOpen(reaction.message)) return false;
            if (reaction.emoji.name !== '🪓')  return false;

            const emojiIdentifier = MessagesHelper.getEmojiIdentifier(reaction.message);
            const crateEmojiNames = _.map(_.values(CRATE_DATA), "emoji");
            if (!crateEmojiNames.includes(emojiIdentifier)) return false;
            
            this.axeHit(reaction, user);

            // TODO: Implement using bomb on crate.

        } catch(e) {
            console.error(e);
        }
    }

    // If enough reactions to open reward all 'reactors' with random selection of rewards.
    static async axeHit(reaction, user) {
        try {
            const rand = new Chance;
    
            const msg = reaction.message;

            const rarity = this.calculateRarityFromMessage(msg);
            const reqHits = this.calculateHitsRequired(rarity);

            // Count the hits
            const hitCount = msg.reactions.cache.find(react => react.emoji.name === '🪓').count || 0;
    
            // Check if there are enough hits to open the crate.
            if (hitCount >= reqHits) {
                // Edit the crate to visually show it opening.
                await msg.edit(MessagesHelper.emojifyID(EMOJIS[rarity + '_OPEN']));

                // A short time after, to avoid rate-limits... award items.
                setTimeout(async () => {
                    const crate = CRATE_DATA[rarity];
                    const rewardedUsersNum = rand.natural({ min: 0, max: crate.maxReward });
                    const hitters = reaction.users.cache.map(user => user);
                    
                    if (rewardedUsersNum > 0) {
                        // Pick the amount of rewarded users.
                        rand.pickset(hitters, rewardedUsersNum).forEach((user, rewardeeIndex) => {
                            // Calculate a random amount of rewards to give to the user.
                            const rewardItemsNum = rand.natural({ min: 0, max: crate.maxReward });
                            const rewardsKeys = rand.pickset(crate.rewards, rewardItemsNum);
    
                            if (rewardItemsNum > 0) {
                                // Grant rewards to users with a random quantity.
                                rewardsKeys.forEach(async (reward, rewardIndex) => {
                                    const rewardItemQuantity = rand.natural({ min: 1, max: crate.maxReward });
                                    // Use rewardeeIndex + rewardIndex for delays (rate limiting).
                                    const rateLimitBypassDelay = (rewardeeIndex * 666) + (333 * rewardIndex);
        
                                    try {
                                        // Add the items to the user.
                                        await ItemsHelper.add(user.id, reward, rewardItemQuantity);
        
                                        // TODO: If toxic egg item, subtract points from the user.
        
                                        setTimeout(async () => {
                                            const rewardMessageText = `${user.username} took ${reward}x${rewardItemQuantity} from the crate!`;
                                            
                                            setTimeout(async () => {
                                                await ChannelsHelper._postToFeed(rewardMessageText);
                                            }, 666);
        
                                            // If the channel isn't feed, then give feedback in crate channel.
                                            if (msg.channel.id !== CHANNELS.FEED.id) {
                                                const rewardMsg = await msg.say(rewardMessageText);
                                                setTimeout(async () => {
                                                    // Remove the reward message because it was placed in a random channel.
                                                    await rewardMsg.delete();
                                                }, 30000);
                                            }
                                        }, rateLimitBypassDelay);
        
                                    } catch(e) {
                                        console.error(e);
                                    }
                                });
                            }
    
                        })
    
                        setTimeout(async () => {
                            // Remove the opened crate.
                            await msg.delete();
                        }, 15000);                
                    } else {
                        const noRewardMsg = await msg.say('No items were inside this crate! >:D');
                        setTimeout(async () => {
                            // Remove the reward message because it was placed in a random channel.
                            await noRewardMsg.delete();
                        }, 30000);
                    }

                }, 666);

    
            } else {
                const hitsLeft = reqHits - hitCount;
                const openingUpdateMsg = await msg.say(
                    `${user.username} tried opening the crate! ${hitsLeft} more hits to break!`
                );

                // Remove message after it was visible by the contact.
                setTimeout(() => { openingUpdateMsg.delete(); }, 30000);
            }
        } catch(e) {
            console.error(e);
        }
    }

    // TODO: Implement number of hits required based on rarity.
    static calculateHitsRequired(crateType) {
        const guild = ServerHelper.getByCode(STATE.CLIENT, 'PROD');
        return VotingHelper.getNumRequired(guild, .025);
    }

    static isCrateOpen(msg) {
        const rarity = this.calculateRarityFromMessage(msg);
        return (rarity && msg.content.indexOf('open') > -1);
    }

    static calculateRarityFromMessage(msg) {
        let crateRarity = null;

        if (msg.content.indexOf('average_crate') > -1) crateRarity = 'AVERAGE_CRATE';
        if (msg.content.indexOf('rare_crate') > -1) crateRarity = 'RARE_CRATE';
        if (msg.content.indexOf('legendary_crate') > -1) crateRarity = 'LEGENDARY_CRATE';

        return crateRarity;
    }

    static selectRandomRarity() {
        const rand = new Chance;

        let rarity = 'AVERAGE_CRATE';

        if (rand.bool({ likelihood: (likelihood / 2) / 3 }))
            rarity = 'RARE_CRATE';

        if (rand.bool({ likelihood: ((likelihood / 2) / 3) / 6 })) 
            rarity = 'LEGENDARY_CRATE';

        // TODO: Implement explosive/toxic crate from Robyn (steals your items)
        // Small chance of it exploding all explosive items you own.

        return rarity;
    }

    static async drop() {
        try {
            const server = ServerHelper.getByCode(STATE.CLIENT, 'PROD');
            const dropChannel = ChannelsHelper.fetchRandomTextChannel(server);

            const rarity = this.selectRandomRarity();
            const rarityWord = MessagesHelper.titleCase(rarity.split('_')[0]);
            await ChannelsHelper._postToFeed(`${rarityWord} crate drop in progress.`);

            // Drop the crate!
            await dropChannel.send(MessagesHelper.emojifyID(EMOJIS[rarity]));
            
        } catch(e) {
            console.error(e);
        }
    }
    
    static async run(dropIntervalTick) {
        // Check next cratedrop time
        const crateDropData = await EventsHelper.read('CRATE_DROP');
        const lastOccurred = parseInt(crateDropData.last_occurred);
        const currUnixSecs = Math.floor(+new Date() / 1000);
        const dropDuration = dropIntervalTick * 3 / 1000;
        const nextOccurring = Math.floor((+new Date() / 1000) + dropDuration);

        try {
            // If time passed, drop a random crate and reset event timer.
            if (currUnixSecs > lastOccurred + dropDuration) {
                await this.drop();
                await EventsHelper.update('CRATE_DROP', nextOccurring);
    
            // Otherwise notify the server via feed of impending crate.
            } else {
                // Calculate time until next crate drop.
                const remainingSecs = Math.max(0, (lastOccurred + dropDuration) - currUnixSecs);
                const readableRemaining = EventsHelper.msToReadableHours(remainingSecs * 1000);
                let countdownText = `Time remaining until crate drop: ${readableRemaining}!`;
    
                // TODO: Integrate shooting down chopper here
    
                await ChannelsHelper._postToFeed(countdownText);
            }
        } catch(e) {
            console.error(e);
        }
    }

}