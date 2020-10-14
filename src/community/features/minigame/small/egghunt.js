import Chance from 'chance';
import ChannelsHelper from '../../../../bot/core/entities/channels/channelsHelper';

import EMOJIS from '../../../../bot/core/config/emojis.json';

import ServerHelper from '../../../../bot/core/entities/server/serverHelper';

import STATE from '../../../../bot/state';
import PointsHelper from '../../points/pointsHelper';

const likelihood = 15;

const EGG_DATA = {
    AVERAGE_EGG: {
        points: 1,
        emoji: EMOJIS.AVERAGE_EGG
    },
    RARE_EGG: {
        points: 3,
        emoji: EMOJIS.RARE_EGG
    },
    LEGENDARY_EGG: {
        points: 75,
        emoji: EMOJIS.LEGENDARY_EGG
    },
};



export default class EggHuntMinigame {
    
    static onReaction(reaction, user) {
        try {
            const isCooperMessage = reaction.message.author.id === STATE.CLIENT.user.id;
            const isEgghuntDrop = isCooperMessage && reaction.message.content.length === 1;
            const hasEggRarity = this.calculateRarityFromMessage(reaction.message);
            if (isEgghuntDrop && hasEggRarity) this.collect(reaction, user);

        } catch(e) {
            console.error(e);
        }
    }

    static calculateRarityFromMessage(msg) {
        let eggRarity = null;

        if (msg.content.indexOf('average_egg') > -1) eggRarity = 'AVERAGE_EGG';
        if (msg.content.indexOf('rare_egg') > -1) eggRarity = 'RARE_EGG';
        if (msg.content.indexOf('legendary_egg') > -1) eggRarity = 'LEGENDARY_EGG';

        return eggRarity;
    }

    static async collect(reaction, user) {    
        try {
            if (user.id !== STATE.CLIENT.user.id) {               
                const rarity = this.calculateRarityFromMessage(reaction.message);
                const reward = EGG_DATA[rarity].points;
                const emoji = EGG_DATA[rarity].emoji;

                // Store points and egg collection data in database.
                const updated = await PointsHelper.addPointsByID(user.id, reward);
                const acknowledgementMsg = await reaction.message.say(
                    `<${emoji}>🧺 Egg Hunt! ${user.username} +${reward} points! (${updated})`
                );
                
                const channelName = reaction.message.channel.name;
                ChannelsHelper._postToFeed(
                    `${user.username} collected an egg in "${channelName}" channel! <${emoji}>`
                )
                await reaction.message.delete();
            }
        } catch(e) {
            console.error(e);
        }
    }

    static async drop(rarity, dropText) {        
        const server = ServerHelper.getByCode(STATE.CLIENT, 'PROD');
        const textChannels = ChannelsHelper.filter(server, channel => channel.type === 'text');
        
        const rand = new Chance;
        const randomChannelIndex = rand.natural({ min: 0, max: server.channels.cache.size - 1 });
        const randomChannelID = Array.from(textChannels.keys())[randomChannelIndex];
        
        const dropChannel = textChannels.get(randomChannelID);
        if (dropChannel) {
            const randomDelayBaseMs = 30000;
            setTimeout(async () => {
                try {
                    const eggMsg = await dropChannel.send(`<${EGG_DATA[rarity].emoji}>`);
                    await eggMsg.react('🧺');

                    ChannelsHelper._postToFeed(dropText);
                } catch(e) {
                    console.error(e);
                }
            }, rand.natural({ min: randomDelayBaseMs, max: randomDelayBaseMs * 4 }));
        }
    }

    static run() {
        const rand = new Chance;
        if (rand.bool({ likelihood })) {
            this.drop('AVERAGE_EGG', 'Whoops! I dropped an egg, but where...?');

            if (rand.bool({ likelihood: likelihood / 3 })) {
                this.drop('RARE_EGG', 'If this was implemented... it would have been **RARE**.');

                if (rand.bool({ likelihood: likelihood / 6 })) {
                    ChannelsHelper._postToFeed('<@here>, a legendary egg was dropped! Grab it before others!');
                    this.drop('LEGENDARY_EGG', 'If this was implemented... it would have been **LEGENDARY**.');
                }
            }
        }
    }
}