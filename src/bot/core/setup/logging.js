import state from "../../state";
import ChannelsHelper from "../entities/channels/channelsHelper";
import ServerHelper from "../entities/server/serverHelper";

export default (discordClient) => {
    discordClient
        .on('error', console.error)
        .on('warn', console.warn)
        // .on('debug', console.log)
        .on('ready', () => { 
            console.log(`Logged in as ${discordClient.user.username}`); 
            ChannelsHelper._postToFeed('⏰ Ding, ding, ding! You can take me out of the oven now. I\'m ready!');
        })
        .on('disconnect', () => { console.warn('Disconnected!'); })
        .on('reconnecting', () => { console.warn('Reconnecting...'); });
}
