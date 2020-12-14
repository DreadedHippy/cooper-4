import ServerHelper from "../entities/server/serverHelper";
import Crossover from "./crossover";
import Redis from "./redis";

export default (discordClient) => {

    discordClient
        .on('error', console.error)
        .on('warn', console.warn)
        .on('debug', console.log)
        .on('ready', () => { 
            try {
                console.log(`Logged in as ${discordClient.user.username}`); 
    
                // Connect to redis and preload crossover data.
                Redis.connect().on('ready', Crossover.load);

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

            } catch(e) {
                console.error(e);
            }
        })
        .on('disconnect', () => { console.warn('Disconnected!'); })
        .on('reconnecting', () => { console.warn('Reconnecting...'); });
}
