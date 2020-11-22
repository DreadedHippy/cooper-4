import client from './setup/client';
import registerLogging from './setup/logging';
import Database from './setup/database';
import CDNManager from './setup/cdn';

// Feature/abstract usage.
import registerCommunityEvents from '../../community/events/register';

// Singleton state accessor
import STATE from '../state';


export default async function bootstrap() {
    // Globalise the created client (extended Discordjs).
    const botClient = STATE.CLIENT = client();

    // Connect to PostGres Database
    await Database.connect();

    // Login to Discord with the bot.
    await botClient.login(process.env.DISCORD_TOKEN);

    // Register community events.
    registerCommunityEvents(botClient);

    // Register logging, debugging, errors, etc.
    registerLogging(botClient);

    // Start basic CDN
    await CDNManager.start();

    // Set activity.
    botClient.user.setActivity('castles being planned.', { type: 'WATCHING' });
}