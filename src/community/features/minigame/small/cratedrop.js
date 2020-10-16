import EMOJIS from '../../../../bot/core/config/emojis.json';


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
        emoji: EMOJIS.AVERAGE_CRATE
    },
    RARE_CRATE: {
        emoji: EMOJIS.RARE_CRATE
    },
    LEGENDARY_CRATE: {
        emoji: EMOJIS.LEGENDARY_CRATE
    },
};


export default class CratedropMinigame {
    
    static calculateRarityFromMessage(msg) {
        let crateRarity = null;

        if (msg.content.indexOf('average_crate') > -1) crateRarity = 'AVERAGE_CRATE';
        if (msg.content.indexOf('rare_crate') > -1) crateRarity = 'RARE_CRATE';
        if (msg.content.indexOf('legendary_crate') > -1) crateRarity = 'LEGENDARY_CRATE';

        return crateRarity;
    }

    static run() {

    }

}