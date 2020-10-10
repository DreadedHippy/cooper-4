import Chance from 'chance';
import ChannelsHelper from '../../../../bot/core/entities/channels/channelsHelper';

import ServerHelper from '../../../../bot/core/entities/server/serverHelper';

import STATE from '../../../../bot/state';
import PointsHelper from '../../points/pointsHelper';

const likelihood = 2.5;
// const likelihood = 75;

const POINTS = {
    average: 10,
    rare: 100,
    legendary: 1000
}

export default class EggHuntMinigame {
    
    static onReaction(reaction, user) {
        try {
            const isCooperMessage = reaction.message.author.id === STATE.CLIENT.user.id;
            const isEggDrop = reaction.message.content === '🥚';            
            if (isCooperMessage && isEggDrop) this.collect(reaction, user);

        } catch(e) {
            console.error(e);
        }
    }

    static calculateRarityFromMessage(msg) {
        return 'average';
    }

    static async collect(reaction, user) {    
        try {
            if (user.id !== STATE.CLIENT.user.id) {
                console.log('Attempting to collect egg!', reaction, user);

                const reward = POINTS[rarity];

                // Store points and egg collection data in database.
                PointsHelper.addPointsByID(user.id, reward);

                const rarity = this.calculateRarityFromMessage(reaction.message);
                console.log(rarity);

                const acknowledgementMsg = await reaction.message.say(
                    // (egg type)
                    `🥚🧺 Egg Hunt! ${user.username} +${reward} points! ` // TODO: Show total points also
                );
                // setTimeout(() => { acknowledgementMsg.delete(); }, 4000);
                
                // TODO: add mention/link to channel it was collected from.
                const channelName = reaction.message.channel.name;
                ChannelsHelper._postToFeed(
                    `${user.username} collected an egg in "${channelName}" channel!`
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
                    // TODO: Implement egg rarities
                    const eggMsg = await dropChannel.send('🥚');
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
            this.drop('average', 'Whoops! I dropped an egg, but where...?');

            if (rand.bool({ likelihood: likelihood / 3 })) {
                this.drop('rare', 'If this was implemented... it would have been **RARE**.');

                if (rand.bool({ likelihood: likelihood / 6 })) {
                    // TODO: Ping everyone!
                    this.drop('legendary', 'If this was implemented... it would have been **LEGENDARY**.');
                }
            }
        }
    }
}