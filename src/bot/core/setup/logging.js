import ElectionHelper from "../../community/features/hierarchy/election/electionHelper";
import AboutHelper from "../../community/features/server/aboutHelper";
import ServerHelper from "../entities/server/serverHelper";
import Crossover from "./crossover";
import Redis from "./redis";

export default (discordClient) => {

    discordClient
        .on('error', console.error)
        .on('warn', console.warn)
        .on('debug', console.log)
        .on('ready', async () => { 
            try {
                console.log(`Logged in as ${discordClient.user.username}`); 
                
                // Set activity.
                discordClient.user.setPresence({
                    status: "dnd",
                    activity: {
                      name: "🗡 SACRIFICE REFORM 2021",
                      type: "LISTENING"
                    }
                });

                // Connect to redis and preload crossover data.
                Redis.connect();
                Redis.connection.on('connect', () => Crossover.load());

                // Prepare cache (avoid partials)!
                const guild = ServerHelper.getByCode(discordClient, 'PROD');
                let reqNum = 0;
                guild.channels.cache.each(channel => {
                    if (channel.type === 'text') {
                        setTimeout(() => channel.messages.fetch({ limit: 5 }), 666 * reqNum);
                        reqNum++;
                    }
                });

                // Cache candidate messages.
                await ElectionHelper.onLoad();

                // Preload all about/options preferences options.
                await AboutHelper.preloadMesssages();

            } catch(e) {
                console.error(e);
            }
        })
        .on('disconnect', () => { console.warn('Disconnected!'); })
        .on('reconnecting', () => { console.warn('Reconnecting...'); });
}
