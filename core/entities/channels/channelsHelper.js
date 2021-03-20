import CHANNELS from '../../config/channels.json';

import STATE from '../../state';
import ServerHelper from '../server/serverHelper';
import MessagesHelper from '../messages/messagesHelper';

export default class ChannelsHelper {
    static getByID(guild, id) {
        return guild.channels.cache.get(id);
    }
    static _get(id) {
        return this.getByID(ServerHelper._coop(), id);
    }
    static _getCode(code) {
        return this.getByCode(ServerHelper._coop(), code);
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
        return new Promise((resolve, reject) => {
            setTimeout(async () => {
                const msg = await feedChannel.send(message);
                resolve(msg);
            }, delay);
            setTimeout(() => reject(false), delay * 2);
        });
    }

    static codeSay(channelCode, messageText, delay = 666) {
        return this._postToChannelCode(channelCode, messageText, delay);
    }

    static codeSayReact(channelCode, messageText, emoji, delay = 666) {
        return this.codeSay(channelCode, messageText, emoji, delay)
            .then(msg => {
                if (msg) MessagesHelper.delayReact(msg, emoji, delay * 1.5);
            });
    }

    static codeShout(msgRef, text, recordChan, selfDestruct = true) {
        if (!this.checkIsByCode(msgRef.channel.id, recordChan)) {
            msgRef.say(text).then(msg => {
                if (selfDestruct) MessagesHelper.delayDelete(msg, 15000);
            });
        }
        return this._postToChannelCode(recordChan, text, 666);
    }

    static codeShoutReact(msgRef, text, recordChan, emoji, selfDestruct = true) {
        return this.codeShout(msgRef, text, recordChan, selfDestruct)
            .then(msg => {
                if (msg) MessagesHelper.delayReact(emoji)
            });
    }


    // This function may be a good example/starting point for a lib 
    // for handling request timeouts and reject enforcement...?
    static _postToChannelCode(name, message, delay = 666) {
        const prodServer = ServerHelper.getByCode(STATE.CLIENT, 'PROD');
        const feedChannel = this.getByCode(prodServer, name);

        return new Promise((resolve, reject) => {
            let request = null;
            setTimeout(() => {
                if (feedChannel && typeof feedChannel.send === 'function') {
                    request = feedChannel.send(message);
                    resolve(request);
                } else {
                    console.log(name + 'channel send failure');
                }
            }, delay);

            // Timeout.
            setTimeout(() => {
                // Is reject still triggered even if resolve has been?
                if (!request) reject('Timeout');
            }, delay * 2);
        });
    }

    static sendByCodes(guild, codes, message) {
        return ChannelsHelper
            .filterByCodes(guild, codes)
            .map(async channel => await channel.send(message));
    }
    static _codes(codes, message) {
        const guild = ServerHelper._coop();
        return ChannelsHelper
            .filterByCodes(guild, codes)
            .map(async channel => await channel.send(message));
    }
    static fetchRandomTextChannel(guild) {       
        // Prevent egg and crate drops in unverified channels.
        const filteredKeys = Object.keys(CHANNELS)
            .filter(key => !['ENTRY', 'INTRO', 'ROLES', 'LEADERS', 'COOPERTESTS'].includes(key));

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
        const channel = CHANNELS[code];

        let result = false;
        if (channel && channel.id === id) result = true;
        return result;
    }
    static async propagate(msgRef, text, recordChan, selfDestruct = true) {
        if (!this.checkIsByCode(msgRef.channel.id, recordChan)) {
            const feedbackMsg = await msgRef.say(text);
            if (selfDestruct) MessagesHelper.delayDelete(feedbackMsg, 15000);
        }
        return this._postToChannelCode(recordChan, text, 666);
    }




    static async _delete(id) {
        const guild = ServerHelper._coop();
        const channel = guild.channels.cache.get(id);
        return channel.delete();
    }
    static async _create(name, options) {
        return ServerHelper._coop().channels.create(name, options);
    }
    static _all = () => ServerHelper._coop().channels.cache || [];
}