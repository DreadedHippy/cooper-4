import Chance from 'chance';
import ChannelsHelper from '../../../../bot/core/entities/channels/channelsHelper';

import ServerHelper from '../../../../bot/core/entities/server/serverHelper';

import state from '../../../../bot/state';

const likelihood = 2.5;

export default class EggHuntMinigame {
    
    static collect() {

    }

    static async run() {
        try {
            const rand = new Chance;
            if (rand.bool({ likelihood })) {
                const server = ServerHelper.getByCode(state.CLIENT, 'PROD');
                const textChannels = ChannelsHelper.filter(server, channel => channel.type === 'text');
    
                const randomChannelIndex = rand.natural({ min: 0, max: server.channels.cache.size - 1 });
                const randomChannelID = Array.from(textChannels.keys())[randomChannelIndex];
    
                const dropChannel = textChannels.get(randomChannelID);
                if (dropChannel) {
                    // TODO: Implement egg rarities
                    const eggMsg = await dropChannel.send('🥚');
                    // eggMsg.react('🧺');

                    ChannelsHelper._postToFeed('Whoops! I dropped an egg, but where..?');
                }
            }

        } catch(e) {
            console.error(e);
        }

        // TODO: Doubletap, random chance of spawning another egg shortly after
        // if (rand.bool({ likelihood })) {

        // TODO: Tripletap, random chance of spawning another egg fair bit later (break up 30 mins wait)
    }
}