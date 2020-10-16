import Chance from 'chance';
import ChannelsHelper from '../../../../bot/core/entities/channels/channelsHelper';

import EMOJIS from '../../../../bot/core/config/emojis.json';

import ServerHelper from '../../../../bot/core/entities/server/serverHelper';

import STATE from '../../../../bot/state';
import PointsHelper from '../../points/pointsHelper';

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

export default class CratedropMinigame {
    
    static onReaction(reaction, user) {
        try {
            const isCooperMessage = reaction.message.author.id === STATE.CLIENT.user.id;
            const hasCrateRarity = this.calculateRarityFromMessage(reaction.message);
            if (isCooperMessage && hasCrateRarity) this.collect(reaction, user);

        } catch(e) {
            console.error(e);
        }
    }

    static calculateRarityFromMessage(msg) {
        let eggRarity = null;

        if (msg.content.indexOf('average_crate') > -1) crateRarity = 'AVERAGE_CRATE';
        if (msg.content.indexOf('rare_crate') > -1) crateRarity = 'RARE_CRATE';
        if (msg.content.indexOf('legendary_crate') > -1) crateRarity = 'LEGENDARY_CRATE';

        return eggRarity;
    }

    static async collect(reaction, user) {    
        try {
            if (user.id !== STATE.CLIENT.user.id) {               

            }
        } catch(e) {
            console.error(e);
        }
    }

    static async drop(rarity, dropText) {

    }

    static run() {

    }
}