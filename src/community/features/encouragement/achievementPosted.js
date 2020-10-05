import CHANNELS from "../../../bot/core/config/channels.json";

import MessagesHelper from "../../../bot/core/entities/messages/messagesHelper";

export default function achievementPostedHandler(msg) {
    // Encourage with reaction.
    msg.react('🌟');

    // Post link to work in feed
    const workLink = MessagesHelper.link(msg);
    msg.guild.channels.cache
        .find(chan => chan.id === CHANNELS.FEED.id)
        .send(`${msg.author.username} just posted an achievement! View it here:\n ${workLink}`);
}