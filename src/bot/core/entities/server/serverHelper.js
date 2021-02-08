import STATE from '../../../state';
import SERVERS from '../../config/servers.json';
import Database from '../../setup/database';
import DatabaseHelper from '../databaseHelper';
import MessagesHelper from '../messages/messagesHelper';

export default class ServerHelper {
    static getByID(client, id) {
        return client.guilds.cache.get(id);
    }
    static getByCode(client, code) {
        return this.getByID(client, SERVERS[code].id);
    }
    static _coop() {
        return this.getByCode(STATE.CLIENT, 'PROD');
    }
    static async addTempMessage(msg, deleteSecs) {
        const msgID = msg.id;
        const expiry = Math.round(Date.now() / 1000) + deleteSecs;

        const messageLink = MessagesHelper.link(msg);

        const query = {
            name: "add-temp-message",
            text: `INSERT INTO temp_messages(message_link, expiry_time) VALUES ($1, $2)`,
            values: [messageLink, expiry]
        };

        const result = await Database.query(query);
        return result;
    }
    static async cleanupTempMessages() {
        const query = {
            name: "get-temp-messages",
            text: `SELECT * FROM temp_messages 
                WHERE expiry_time <= extract(epoch from now())
                LIMIT 15`
        };
        
        const result = await Database.query(query);
        const tempMessages = DatabaseHelper.many(result);

        // Batch delete won't work due to different channels, use message link approach.
        const expiredMsgIDs = tempMessages.map(tempMsg => tempMsg.message_id);
        expiredMsgIDs.map((expiredID, index) => {
            // Load message by link and delete.
            setTimeout(async () => {
                const message = await MessagesHelper.getByLink(expiredID);
                MessagesHelper.delayDelete(message, index * 30000);
            }, index * 10000);
        });

        // TODO: Add types and log that a resource wasn't gathered.
    }
}