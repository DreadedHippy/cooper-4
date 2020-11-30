import CHANNELS from '../../config/channels.json';

import STATE from '../../../state';
import ServerHelper from '../server/serverHelper';
import MessagesHelper from '../messages/messagesHelper';

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
    static _postToFeed(message, delay = 666) {
        const prodServer = ServerHelper.getByCode(STATE.CLIENT, 'PROD');
        const feedChannel = this.getByCode(prodServer, 'FEED');
        setTimeout(() => { feedChannel.send(message); }, delay);
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
    static fetchRandomTextChannel(guild) {       
        // Prevent egg and crate drops in unverified channels.
        const filteredKeys = Object.keys(CHANNELS)
            .filter(key => !['ENTRY', 'INTRO', 'ROLES', 'LEADERS'].includes(key));

        const channelKey = STATE.CHANCE.pickone(filteredKeys);

        const channelID = CHANNELS[channelKey].id;

        const channel = guild.channels.cache.get(channelID);
        
        return channel;
    }
    static _randomText() {
        const server = ServerHelper.getByCode(STATE.CLIENT, 'PROD');
        return ChannelsHelper.fetchRandomTextChannel(server);
    }
    static checkIsByCode(id, code) {
        return CHANNELS[code].id === id;
    }
    static async _propogate(msgRef, text, selfDestruct = true) {
        if (!this.checkIsByCode(msgRef.channel.id, 'FEED')) {
            const feedbackMsg = await msgRef.say(text);
            if (selfDestruct) MessagesHelper.delayDelete(feedbackMsg, 15000);
        }
        setTimeout(() => { this._postToFeed(text); }, 666);
    }
}