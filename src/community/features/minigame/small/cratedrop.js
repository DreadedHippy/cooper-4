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
import PointsHelper from '../../points/pointsHelper';
import UsersHelper from '../../../../bot/core/entities/users/usersHelper';


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
        maxReward: 3,
        openingPoints: 1,
        percHitsReq: .01,
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
        maxReward: 2,
        openingPoints: 2,
        percHitsReq: .015,
        rewards: [
            'ROPE',
            'SHIELD',
            'MINE',
            'DEFUSE_KIT',
            'FLARE'
        ]
    },
    LEGENDARY_CRATE: {
        emoji: EMOJIS.LEGENDARY_CRATE,
        maxReward: 2,
        openingPoints: 3,
        percHitsReq: .03,
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
const likelihood = 25;

export default class CratedropMinigame {
    
    // Reaction interceptor to check if user is attempting to play Crate Drop
    static onReaction(reaction, user) {
        try {
            if (user.id === STATE.CLIENT.user.id) return false;
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
            const msg = reaction.message;

            const rarity = this.calculateRarityFromMessage(msg);
            const reqHits = this.calculateHitsRequired(rarity);

            // Count the hits and remove Cooper's from the count.
            const hitCount = msg.reactions.cache.find(react => react.emoji.name === '🪓').count - 1 || 0;
                
            // Check if there are enough hits to open the crate.
            if (hitCount >= reqHits) await this.open(reaction, user);
            else {
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

    // Number of hits required based on rarity.
    static calculateHitsRequired(crateType) {
        const crate = CRATE_DATA[crateType];
        const guild = ServerHelper.getByCode(STATE.CLIENT, 'PROD');
        return VotingHelper.getNumRequired(guild, crate.percHitsReq);
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

    static async open(reaction, user) {
        const msg = reaction.message;
        const rarity = this.calculateRarityFromMessage(msg);

        // Edit the crate to visually show it opening.
        await msg.edit(MessagesHelper.emojifyID(EMOJIS[rarity + '_OPEN']));

        // A short time after, to avoid rate-limits... award items.
        setTimeout(async () => {
            const crate = CRATE_DATA[rarity];
            const hitters = reaction.users.cache
                .map(user => user)
                .filter(user => !UsersHelper.isCooper(user.id));
                
            
            await Promise.all(hitters.map(user => {
                return PointsHelper.addPointsByID(user.id, crate.openingPoints);
            }));

            // Post and delete the points reward message feedback.
            const pointsRewardString = hitters.join(', ') +
                ` were rewarded ${crate.openingPoints} points(s) for attempting to open the ${rarity.replace('_', ' ').toLowerCase()}!`;

            setTimeout(async () => {
                const pointsRewardMsg = await msg.say(pointsRewardString);
                setTimeout(() => { ChannelsHelper._postToFeed(pointsRewardString); }, 5000);
                setTimeout(() => { pointsRewardMsg.delete(); }, 7500);
            }, 5000);

            // Reward amount of users based on luck/chance.
            const rewardedUsersNum = STATE.CHANCE.natural({ min: 0, max: Math.ceil(hitters.length * .75) });
            if (rewardedUsersNum > 0) {
                // Pick the amount of rewarded users.
                STATE.CHANCE.pickset(hitters, rewardedUsersNum).forEach((user, rewardeeIndex) => {
                    // Calculate a random amount of rewards to give to the user.
                    const rewardItemsNum = STATE.CHANCE.natural({ min: 0, max: crate.maxReward });
                    const rewardsKeys = STATE.CHANCE.pickset(crate.rewards, rewardItemsNum);

                    if (rewardItemsNum > 0) {
                        // Grant rewards to users with a random quantity.
                        rewardsKeys.forEach(async (reward, rewardIndex) => {
                            const rewardItemQuantity = STATE.CHANCE.natural({ min: 1, max: crate.maxReward });
                            // Use rewardeeIndex + rewardIndex for delays (rate limiting).
                            const rateLimitBypassDelay = (rewardeeIndex * 666) + (333 * rewardIndex);

                            try {
                                // Add the items to the user.
                                await ItemsHelper.add(user.id, reward, rewardItemQuantity);

                                setTimeout(async () => {
                                    const rewardMessageText = `${user.username} took ${reward}x${rewardItemQuantity} from the crate!`;
                                    
                                    setTimeout(() => { ChannelsHelper._postToFeed(rewardMessageText); }, 666);

                                    // If the channel isn't feed, then give feedback in crate channel.
                                    if (msg.channel.id !== CHANNELS.FEED.id) {
                                        const rewardMsg = await msg.say(rewardMessageText);
                                        // Remove the reward message because it was placed in a random channel.
                                        setTimeout(() => { rewardMsg.delete(); }, 30000);
                                    }
                                }, rateLimitBypassDelay);

                            } catch(e) {
                                console.error(e);
                            }
                        });
                    }
                });
        
            } else {
                const noRewardMsg = await msg.say('No items were inside this crate! >:D');

                // Remove the reward message because it was placed in a random channel.
                setTimeout(() => { noRewardMsg.delete(); }, 30000);
            }

            // Remove the opened crate.
            setTimeout(() => { msg.delete(); }, 15000);
        }, 666);
    }


    // TODO: Implement explosive/toxic crate from Robyn (steals your items)
    // Small chance of it exploding all explosive items you own.
    static selectRandomRarity() {
        let rarity = 'AVERAGE_CRATE';

        if (STATE.CHANCE.bool({ likelihood: likelihood / 3 })) rarity = 'RARE_CRATE';

        if (STATE.CHANCE.bool({ likelihood: likelihood / 5 })) rarity = 'LEGENDARY_CRATE';

        return rarity;
    }

    static async explode(reaction, user) {
        // Check user actually has a bomb to use
        // Potentially require 2 bombs.
        // ItemsHelper.use(user.id, 'BOMB', 2);
        // Edit message to explosion emoji, THEN open.
        // this.open(reaction, user);
    }

    static async drop() {
        try {
            const rarity = this.selectRandomRarity();
            const rarityWord = MessagesHelper.titleCase(rarity.split('_')[0]);
            await ChannelsHelper._postToFeed(`${rarityWord} crate drop in progress.`);

            // Drop the crate!
            const crateMSG = await ChannelsHelper
                ._randomText()
                .send(MessagesHelper.emojifyID(EMOJIS[rarity]));

            setTimeout(() => { crateMSG.react('🪓'); }, 333);
            
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