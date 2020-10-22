import Chance from 'chance';

import EMOJIS from '../../../../bot/core/config/emojis.json';

import STATE from '../../../../bot/state';

import ChannelsHelper from '../../../../bot/core/entities/channels/channelsHelper';
import EventsHelper from '../../events/eventsHelper';
import MessagesHelper from '../../../../bot/core/entities/messages/messagesHelper';
import ServerHelper from '../../../../bot/core/entities/server/serverHelper';
import VotingHelper from '../../../events/voting/votingHelper';


// TODO: Refactor into another helper, get it out of here.
const titleCase = (str) => {
    str = str.toLowerCase().split(' ');
    for (let i = 0; i < str.length; i++) {
        str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1); 
    }
    return str.join(' ');
};


// TODO: Think of rewards
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
        rewards: [
            'BOMB',
            'LAXATIVE',
            'TOXIC_EGG',
            'PICK_AXE',
            'FRYING_PAN',
            'EMPTY_GIFTBOX'
        ]
    },
    RARE_CRATE: {
        emoji: EMOJIS.RARE_CRATE,
        maxReward: 4,
        rewards: [
            'ROPE',
            'SHIELD',
            'MINE',
            'SHIELD',
            'DEFUSE_KIT'
        ]
    },
    LEGENDARY_CRATE: {
        emoji: EMOJIS.LEGENDARY_CRATE,
        maxReward: 2,
        rewards: [
            'IED',
            'RPG',
            'GOLD_BAR',
            'GOLD_COIN',
        ]
    },
};

// Two hour drop interval.
const dropInterval = 60 * 60 * 2;

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
            
            this.open(reaction, user);

        } catch(e) {
            console.error(e);
        }
    }

    // If enough reactions to open reward all 'reactors' with random selection of rewards.
    static async open(reaction, user) {
        try {
            const rand = new Chance;
    
            const msg = reaction.message;
            const rarity = this.calculateRarityFromMessage(msg);
            const reqHits = VotingHelper.getNumRequired(STATE.CLIENT, .025);
    
            // Count the hits
            const hitCounter = (accum, val) => {
                if (val.emoji.name === '🪓') accum + val.count;
            };
            const hitCount = msg.reactions.reduce(hitCounter);
    
            // Check if there are enough hits to open the crate.
            if (hitCount >= reqHits) {
                await msg.edit(EMOJIS[rarity + '_OPEN']);
                setTimeout(async () => {
                    // Grant rewards
                    const crate = CRATE_DATA[rarity];
                    const amountReward = rand.natural({ min: 1, max: crate.maxReward });
        
                    // TODO: Reward each of the openers until the amount of rewards run out.
                    const hitters = reaction.users.map(user => user);

                    // TODO: Reward with a random item from the possible rewards.
                    console.log(crate, amountReward, hitters);

                    // crate.rewards;
                    // crate.maxReward;
                    // rand.pickone()

                    setTimeout(async () => {
                        // Remove the opened crate.
                        await msg.delete();
                    }, 15000);                
                }, 666);

    
            } else {
                await msg.say(`${user.username} wants to open this crate!`);
            }
        } catch(e) {
            console.error(e);
        }
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
            const dropChannel = ChannelsHelper.getRandomChannel(server);

            const rarity = this.selectRandomRarity();
            const rarityWord = titleCase(rarity.split('_')[0]);
            await ChannelsHelper._postToFeed(`${rarityWord} crate drop in progress. (TESTING)`);

            // Drop the crate!
            await dropChannel.send(EMOJIS[rarity]);

        } catch(e) {
            console.error(e);
        }
    }

    static async resetCountdown() {
        const nextOccurring = Math.floor(+new Date() / 1000) + dropInterval;
        return await EventsHelper.update('CRATE_DROP', nextOccurring);
    }

    static async run() {
        // Check next cratedrop time
        const crateDropData = await EventsHelper.read('CRATE_DROP');
        const lastOccurred = parseInt(crateDropData.last_occurred);
        const currUnixSecs = Math.floor(+new Date() / 1000);

        // If time passed, drop a random crate and reset event timer.
        if (currUnixSecs > lastOccurred + dropInterval) {
            await this.drop();
            await this.resetCountdown();

        // Otherwise notify the server via feed of impending crate.
        } else {
            // Calculate time until next crate drop.
            const remainingSecs = Math.max(0, (lastOccurred + dropInterval) - currUnixSecs);
            const readableRemaining = EventsHelper.msToReadable(remainingSecs * 1000);

            await ChannelsHelper._postToFeed(
                `${readableRemaining} remaining until crate drop!`
            );
        }
    }

}