import Chance from 'chance';
import ChannelsHelper from '../../../../bot/core/entities/channels/channelsHelper';

import EMOJIS from '../../../../bot/core/config/emojis.json';

import ServerHelper from '../../../../bot/core/entities/server/serverHelper';

import STATE from '../../../../bot/state';
import PointsHelper from '../../points/pointsHelper';


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
                // const rarity = this.calculateRarityFromMessage(reaction.message);
                // const reward = EGG_DATA[rarity].points;
                // const emoji = EGG_DATA[rarity].emoji;

                // // Store points and egg collection data in database.
                // const updated = await PointsHelper.addPointsByID(user.id, reward);
                // const acknowledgementMsg = await reaction.message.say(
                //     `<${emoji}>🧺 Egg Hunt! ${user.username} +${reward} points! (${updated})`
                // );
                
                // const channelName = reaction.message.channel.name;
                // ChannelsHelper._postToFeed(
                //     `${user.username} collected an egg in "${channelName}" channel! <${emoji}>`
                // )
                // await reaction.message.delete();
            }
        } catch(e) {
            console.error(e);
        }
    }

    static async drop(rarity, dropText) {
        // TODO: Refactor into channels helper "getRandomTextChannel"
        // const server = ServerHelper.getByCode(STATE.CLIENT, 'PROD');
        // const textChannels = ChannelsHelper.filter(server, channel => channel.type === 'text');
        
        // const rand = new Chance;
        // const randomChannelIndex = rand.natural({ min: 0, max: server.channels.cache.size - 1 });
        // const randomChannelID = Array.from(textChannels.keys())[randomChannelIndex];
        
        // const dropChannel = textChannels.get(randomChannelID);

        // if (dropChannel) {
        //     try {
        //         const eggMsg = await dropChannel.send(`<${EGG_DATA[rarity].emoji}>`);
        //         await eggMsg.react('🧺');

        //         ChannelsHelper._postToFeed(dropText);
        //     } catch(e) {
        //         console.error(e);
        //     }
        // }
    }

    static run() {

    }
}