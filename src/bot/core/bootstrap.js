import client from './setup/client';
import registerLogging from './setup/logging';
import Database from './setup/database';
import CDNManager from './setup/cdn';

// Feature/abstract usage.
import registerCommunityEvents from '../../community/events/register';

// Singleton state accessor
import STATE from '../state';
import ServerHelper from './entities/server/serverHelper';

export default async function bootstrap() {
    // Globalise the created client (extended Discordjs).
    const botClient = STATE.CLIENT = client();

    // Register logging, debugging, errors, etc.
    registerLogging(botClient);

    // Register community events.
    registerCommunityEvents(botClient);

    // Connect to PostGres Database
    await Database.connect();

    // Login to Discord with the bot.
    await botClient.login(process.env.DISCORD_TOKEN);

    // Start basic CDN
    await CDNManager.start();

    // Prepare cache (avoid partials)!
    botClient.on('ready', () => {
        const guild = ServerHelper.getByCode(botClient, 'PROD');
        guild.channels.cache.each(channel => {
            if (channel.type === 'text') {
                channel.messages.fetch({ limit: 10 });
            }
        })
    })

    // Set activity.
    botClient.user.setActivity('myself... Hmm.', { type: 'WATCHING' });
}