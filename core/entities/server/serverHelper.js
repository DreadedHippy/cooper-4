import STATE from '../../state';
import SERVERS from '../../config/servers.json';
import Database from '../../setup/database';
import DatabaseHelper from '../databaseHelper';
import MessagesHelper from '../messages/messagesHelper';
import ChannelsHelper from '../channels/channelsHelper';

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
    static async deleteTempMsgLink(link) {
        const query = {
            name: "delete-temp-message-link",
            text: `SELECT * FROM temp_messages 
                WHERE message_link = $1
                LIMIT 15`,
            values: [link]
        };
        
        const result = await Database.query(query);
        return result;
    }

    // TODO: Add types and log that a resource wasn't gathered.
    // TODO: Take the channel bulkDelete approach instead, may achieve better throttled results.

    // Load and delete expired messages sorted by oldest first.
    static async cleanupTempMessages() {
        const query = {
            name: "get-temp-messages",
            text: `SELECT * FROM temp_messages 
                WHERE expiry_time <= extract(epoch from now())
                ORDER BY expiry_time ASC
                LIMIT 40`
        };
        
        const result = await Database.query(query);
        const tempMessages = DatabaseHelper.many(result);


        // Build an object of deletions for bulk delete.
        const deletions = {};

        // Calculate from message links and batch the messages for bulkDeletion.
        const expiredMsgIDs = tempMessages.map(tempMsg => tempMsg.message_link);
        expiredMsgIDs.map(expiredMsgLink => {
            const messageData = MessagesHelper.parselink(expiredMsgLink);
            if (messageData && messageData.channel) {
                // Start tracking the channel if it wasn't already.
                if (typeof deletions[messageData.channel] === 'undefined')
                    deletions[messageData.channel] = [];

                // Track the message which needs deleting too.
                deletions[messageData.channel].push(messageData.message);
            }
        });

        const guildID = ServerHelper._coop().id;
        const msgUrlBase = `https://discordapp.com/channels/${guildID}`;
        
        // Iterate through the deletion data and bulkDelete for each channel.
        Object.keys(deletions).map((deleteChanKey, index) => {
            setTimeout(async () => {
                try {
                    // Load the channel for its bulkDelete method.
                    const chan = ChannelsHelper._get(deleteChanKey);
        
                    // Get the messages from this deletion channel.
                    const deletionMessages = deletions[deleteChanKey];
                    
                    // Delete messages from discord.
                    const successfulDeletions = await chan.bulkDelete(deletionMessages);
                    
                    // On bulkDelete success, remove from our database.
                    successfulDeletions.map((item, id) => {
                        const msgUrl = `${msgUrlBase}/${chan.id}/${id}`;

                        // Remove record from temp messages table.
                        this.deleteTempMsgLink(msgUrl);
                    });

                } catch(e) {
                    // Ignore unknown messages.
                    if (e.message !== 'Unknown Message') {
                        console.log('Error cleaning up our temporary messages.');
                        console.error(e);
                    }
                }
            }, 2222 * index);
        });
    }
}