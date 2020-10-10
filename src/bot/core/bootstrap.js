import client from './setup/client';
import registerLogging from './setup/logging';
import registerCommunityEvents from '../../community/events/register';

// Singleton state accessor
import STATE from '../state';
import Database from './setup/database';

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

    // Set activity.
    botClient.user.setActivity('you...', { type: 'WATCHING' });
}