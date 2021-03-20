import ChannelsHelper from "../../../core/entities/channels/channelsHelper";
import MessagesHelper from "../../../core/entities/messages/messagesHelper";
import STATE from "../../../core/state";

export default function achievementPostedHandler(msg) {

    // Ignore Cooper's messages.
    if (msg.author.bot) return false;
    
    // Encourage with reaction.
    msg.react('🌟');

    // Throttle achievements posted.
    const now = Date.now();
    const fiveMinutesAgo = now - (60 * 5 * 1000);
    const lastNotified = STATE.LAST_ACHIEVEMENT_NOTIFICATION;
    if (!lastNotified || lastNotified < fiveMinutesAgo) {

        // Post link to work in feed
        const workLink = MessagesHelper.link(msg);
        ChannelsHelper._postToFeed(`${msg.author.username} just posted an achievement! View it here:\n ${workLink}`)

        STATE.LAST_ACHIEVEMENT_NOTIFICATION = now;
    }


}