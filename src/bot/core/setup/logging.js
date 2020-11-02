import state from "../../state";
import ChannelsHelper from "../entities/channels/channelsHelper";
import ServerHelper from "../entities/server/serverHelper";

export default (discordClient) => {
    discordClient
        .on('error', console.error)
        .on('warn', console.warn)
        // .on('debug', console.log)
        .on('ready', async () => { 
            try {
                console.log(`Logged in as ${discordClient.user.username}`); 
    
                // Prepare cache (avoid partials)!
                const guild = ServerHelper.getByCode(discordClient, 'PROD');
                let reqNum = 0;
                guild.channels.cache.each(channel => {
                    if (channel.type === 'text') {
                        setTimeout(async () => {
                            await channel.messages.fetch({ limit: 5 });
                        }, 666 * reqNum);
                        reqNum++;
                    }
                });

                // ChannelsHelper._postToFeed('⏰ Ding, ding, ding! You can take me out of the oven now. I\'m ready!');
            } catch(e) {
                console.error(e);
            }
        })
        .on('disconnect', () => { console.warn('Disconnected!'); })
        .on('reconnecting', () => { console.warn('Reconnecting...'); });
}
