import { Message } from "discord.js";
import CHANNELS from "../../../bot/core/config/channels.json";
import ChannelsHelper from "../../../bot/core/entities/channels/channelsHelper";
import MessagesHelper from "../../../bot/core/entities/messages/messagesHelper";

export default function achievementPostedHandler(msg) {

    // Ignore Cooper's messages.
    if (msg.author.bot) return false;
    
    // Encourage with reaction.
    msg.react('🌟');

    // Post link to work in feed
    const workLink = MessagesHelper.link(msg);
    ChannelsHelper._postToFeed(`${msg.author.username} just posted an achievement! View it here:\n ${workLink}`)

}