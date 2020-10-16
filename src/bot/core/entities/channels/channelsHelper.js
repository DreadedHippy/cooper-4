import CHANNELS from '../../config/channels.json';

import STATE from '../../../state';
import ServerHelper from '../server/serverHelper';

import Chance from 'chance';

export default class ChannelsHelper {
    static getByID(guild, id) {
        return guild.channels.cache.get(id);
    }
    static getByCode(guild, code) {
        return this.getByID(guild, CHANNELS[code].id);
    }
    static filter(guild, filter) {
        return guild.channels.cache.filter(filter);
    }
    static filterByCodes(guild, codes) {
        const ids = codes.map(code => CHANNELS[code].id);
        const filter = channel => ids.includes(channel.id);
        return ChannelsHelper.filter(guild, filter);
    }
    static _postToFeed(message) {
        const prodServer = ServerHelper.getByCode(STATE.CLIENT, 'PROD');
        const feedChannel = this.getByCode(prodServer, 'FEED');
        return feedChannel.send(message);
    }
    static _postToChannelCode(name, message) {
        const prodServer = ServerHelper.getByCode(STATE.CLIENT, 'PROD');
        const feedChannel = this.getByCode(prodServer, name);
        return feedChannel.send(message);
    }
    static sendByCodes(guild, codes, message) {
        return ChannelsHelper
            .filterByCodes(guild, codes)
            .map(async channel => await channel.send(message));
    }
    static getRandomChannel(guild) {
        const textChannels = ChannelsHelper.filter(guild, channel => channel.type === 'text');
        
        const rand = new Chance;
        const randomChannelIndex = rand.natural({ min: 0, max: guild.channels.cache.size - 1 });
        const randomChannelID = Array.from(textChannels.keys())[randomChannelIndex];
        
        const dropChannel = textChannels.get(randomChannelID);
        return dropChannel;
    }
}