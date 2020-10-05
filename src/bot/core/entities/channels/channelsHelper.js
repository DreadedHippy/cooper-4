import CHANNELS from '../../config/channels.json';

import STATE from '../../../state';
import ServerHelper from '../server/serverHelper';


export default class ChannelsHelper {
    static getByID(guild, id) {
        return guild.channels.cache.get(id);
    }
    static getByCode(guild, code) {
        return this.getByCode(guild, CHANNELS[code].id);
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
    static sendByCodes(guild, codes, message) {
        return ChannelsHelper
            .filterByCodes(guild, codes)
            .map(async channel => await channel.send(message));
    }
}