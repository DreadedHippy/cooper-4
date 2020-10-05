import CHANNELS from "../../../bot/core/config/channels.json";
import EMOJIS from "../../../bot/core/config/emojis.json";

import MessagesHelper from "../../../bot/core/entities/messages/messagesHelper";

export default function workPostHandler(msg) {
    
    // Check if image.
    if (msg.attachments.size > 0) {
        // Encourage with reaction.
        msg.react(EMOJIS.COOP);

        // Post link to work in feed
        const workLink = MessagesHelper.link(msg);
        msg.guild.channels.cache
            .find(chan => chan.id === CHANNELS.FEED.id)
            .send(`${msg.author.username} just posted some work! View it here:\n ${workLink}`);
    }
}