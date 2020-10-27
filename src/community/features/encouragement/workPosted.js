import CHANNELS from "../../../bot/core/config/channels.json";
import EMOJIS from "../../../bot/core/config/emojis.json";
import ChannelsHelper from "../../../bot/core/entities/channels/channelsHelper";

import MessagesHelper from "../../../bot/core/entities/messages/messagesHelper";
import CDNManager from "../../../bot/core/setup/cdn";

export default async function workPostHandler(msg) {
    // Ignore Cooper.
    if (msg.author.bot) return false;
    
    // Check if image.
    if (msg.attachments.size > 0) {
        try {
            // Encourage with reaction.
            await msg.react(EMOJIS.COOP);
    
            // Post link to work in feed
            const workLink = MessagesHelper.link(msg);
            await ChannelsHelper._postToFeed(
                `${msg.author.username} just posted some work! View it here:\n ${workLink}`
            );
    
            msg.attachments.map(async (file) => {

                const annotationLines = msg.content.split('\n');

                console.log(annotationLines);

                const name = annotationLines[0] || 'Another The Coop Image!'

                // Remove the name now it is no longer needed.
                annotationLines.shift()

                const description = annotationLines.join('\n') + "\n\n" +
                    "Do you have Business/Art/Code interests? Join us! https://discord.gg/5cmN8uW"
                await CDNManager.upload(
                    file.url,
                    name,
                    description
                );
            });
        } catch(e) {
            console.error(e);
        }
    }
}