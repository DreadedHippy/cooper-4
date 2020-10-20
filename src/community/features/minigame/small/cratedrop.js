import EMOJIS from '../../../../bot/core/config/emojis.json';
import ChannelsHelper from '../../../../bot/core/entities/channels/channelsHelper';
import EventsHelper from '../../events/eventsHelper';


// TODO: Think of rewards
/**
 * Laxative - Spawns an egg randomly
 * Toxic Egg - Places a toxic egg
 * Mine - Places a mine
 * Bomb
 * Rope
 * Shield 
 * Defuse kit
 * IED - Kicks member out of server
 */
const CRATE_DATA = {
    AVERAGE_CRATE: {
        emoji: EMOJIS.AVERAGE_CRATE,
        rewards: [
            'BOMB',
            'LAXATIVE',
            'TOXIC_EGG',
            'PICK_AXE',
            'FRYING_PAN'
        ]
    },
    RARE_CRATE: {
        emoji: EMOJIS.RARE_CRATE,
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


export default class CratedropMinigame {
    
    static calculateRarityFromMessage(msg) {
        let crateRarity = null;

        if (msg.content.indexOf('average_crate') > -1) crateRarity = 'AVERAGE_CRATE';
        if (msg.content.indexOf('rare_crate') > -1) crateRarity = 'RARE_CRATE';
        if (msg.content.indexOf('legendary_crate') > -1) crateRarity = 'LEGENDARY_CRATE';

        return crateRarity;
    }

    static async drop() {
        await ChannelsHelper._postToFeed(`Would have dropped a crate!`);
        await this.resetCountdown();
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
        if (currUnixSecs > lastOccurred + dropInterval)
            await this.drop();

        // Otherwise notify the server via feed of impending crate.
        else {
            const remainingSecs = Math.max(0, (lastOccurred + dropInterval) - currUnixSecs);
            await ChannelsHelper._postToFeed(
                `${remainingSecs} seconds remaining until crate drop!`
            );
        }
    }

}