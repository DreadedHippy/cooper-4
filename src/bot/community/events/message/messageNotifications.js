import ChannelsHelper from "../../../core/entities/channels/channelsHelper";
import UsersHelper from "../../../core/entities/users/usersHelper";
import STATE from "../../../state";
import CHANNELS from '../../../core/config/channels.json';

export default class MessageNotifications {

    static add(msg) {
        const channelID = msg.channel.id;
        const authorID = msg.author.id;

        // Filter out Cooper's messages.
        if (UsersHelper.isCooperMsg(msg)) return false;
        // Filter out direct message and testing.
        if (channelID === CHANNELS.COOPERTESTS.id) return false;
        // Filter out DM messages.
        if (msg.channel.type === 'dm') return false;

        // If not already tracking, create the key on the object.
        if (typeof STATE.MESSAGE_HISTORY[channelID] === 'undefined') {
            STATE.MESSAGE_HISTORY[channelID] = {
                count: 0,
                authors: {}
            };
        }

        // If not already tracking messages for that author on that object, initialise.
        if (typeof STATE.MESSAGE_HISTORY[channelID].authors[authorID] === 'undefined') {
            STATE.MESSAGE_HISTORY[channelID].authors[authorID] = {
                count: 0,
                username: msg.author.username
            };
        }

        // Add count on channel and author to list.
        STATE.MESSAGE_HISTORY[channelID].count++;
        STATE.MESSAGE_HISTORY[channelID].authors[authorID].count++;
    }

    static post() {
        const notificationChannelIDs = Object.keys(STATE.MESSAGE_HISTORY);
        if (notificationChannelIDs.length > 0) {
            let notificationString = 'Latest messages for you! ';

            // TODO: Order by most messages.

            // Count total messages beforehand to add to string as header.
            const totalCount = notificationChannelIDs.reduce((acc, val) => {
                acc += STATE.MESSAGE_HISTORY[val].count;
                return acc;
            }, 0);
            notificationString += `(${totalCount})\n\n`;
            
            notificationChannelIDs.map(channelID => {
                // Access the notification data for this specific channel.
                const notificationData = STATE.MESSAGE_HISTORY[channelID];

                // Add formatted string for posting as notification.
                const label = notificationData.count > 1 ? 'messages' : 'message';
                notificationString += `<#${channelID}> ${notificationData.count} ${label}! \n` +
                    `From: ${Object.keys(notificationData.authors).map(authorKey => {
                        const { username, count } = notificationData.authors[authorKey];
                        return `${username} (${count})`;
                    }).join(', ')}`;

                // Add some line spacing.
                notificationString += '\n\n';

                // All outstanding state accounted for, cleanup.
                this.clear(channelID);
            });

            ChannelsHelper._postToFeed(notificationString, 2000);
        }
    }

    static clear(channelID) {
        delete STATE.MESSAGE_HISTORY[channelID];
    }
}