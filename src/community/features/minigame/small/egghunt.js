import Chance from 'chance';
import _ from 'lodash';



import EMOJIS from '../../../../bot/core/config/emojis.json';

import ChannelsHelper from '../../../../bot/core/entities/channels/channelsHelper';
import ServerHelper from '../../../../bot/core/entities/server/serverHelper';
import PointsHelper from '../../points/pointsHelper';

import STATE from '../../../../bot/state';
import ItemsHelper from '../../items/itemsHelper';


const likelihood = 20;

const EGG_DATA = {
    TOXIC_EGG: {
        points: -5,
        emoji: EMOJIS.TOXIC_EGG
    },
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

const removeSymbols = str => str.replace('>', '').replace('<', '');
const getEmojiIdentifier = rct => removeSymbols(rct.message.content.trim());


export default class EggHuntMinigame {
    
    static onReaction(reaction, user) {
        try {
            const isCooperMessage = reaction.message.author.id === STATE.CLIENT.user.id;
            const eggEmojiNames = _.map(_.values(EGG_DATA), "emoji");
            console.log(reaction.message.content);
            const isEgghuntDrop = eggEmojiNames.includes(getEmojiIdentifier(reaction));
            const hasEggRarity = this.calculateRarityFromMessage(reaction.message);
            if (isCooperMessage && isEgghuntDrop && hasEggRarity) {
                this.collect(reaction, user);
            }
        } catch(e) {
            console.error(e);
        }
    }

    static calculateRarityFromMessage(msg) {
        let eggRarity = null;

        if (msg.content.indexOf('average_egg') > -1) eggRarity = 'AVERAGE_EGG';
        if (msg.content.indexOf('rare_egg') > -1) eggRarity = 'RARE_EGG';
        if (msg.content.indexOf('legendary_egg') > -1) eggRarity = 'LEGENDARY_EGG';
        if (msg.content.indexOf('toxic_egg') > -1) eggRarity = 'TOXIC_EGG';

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

                // Add/update egg item to user
                // await ItemsHelper.add(user.id, rarity, 1);

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
        const dropChannel = ChannelsHelper.getRandomChannel(server);
        const rand = new Chance;

        if (dropChannel) {
            const randomDelayBaseMs = 30000;
            setTimeout(async () => {
                try {
                    const eggMsg = await dropChannel.send(`<${EGG_DATA[rarity].emoji}>`);
                    await eggMsg.react('🧺');

                    if (dropText) ChannelsHelper._postToFeed(dropText);
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

            if (rand.bool({ likelihood: likelihood / 2 })) {
                this.drop('TOXIC_EGG', 'Dropped a toxic egg, be careful!');
            }

            if (rand.bool({ likelihood: likelihood / 3 })) {
                this.drop('RARE_EGG', 'Funknes! Rare egg on the loose!');

                if (rand.bool({ likelihood: likelihood / 6 })) {
                    ChannelsHelper._postToFeed('<@here>, a legendary egg was dropped! Grab it before others!');
                    this.drop('LEGENDARY_EGG', 'Whoa! I\'ve dropped a legendary egg!');
                }
            }

            // Bonus eggs            
            if (rand.bool({ likelihood: likelihood / 2 })) {
                ChannelsHelper._postToFeed('Bonus eggs rolling!');
                
                const bonusEggsNum = rand.natural({ min: 2, max: 8 });
                for (let i = 0; i < bonusEggsNum; i++) this.drop('AVERAGE', null)
            }
        }
    }
}