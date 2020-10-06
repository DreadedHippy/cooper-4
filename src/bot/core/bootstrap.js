import client from './setup/client';
import registerLogging from './setup/logging';
import registerCommunityEvents from '../../community/events/register';
import state from '../state';

export default async function bootstrap() {
    // Create client and setup basic Commandojs.
    const botClient = client()

    // Register logging, debugging, errors, etc.
    registerLogging(botClient);

    // Register community events.
    registerCommunityEvents(botClient);

    // Login to Discord with the bot.
    await botClient.login(process.env.DISCORD_TOKEN);

    // Set activity
    // TODO: Make into a command
    botClient.user.setActivity('you...', { type: 'WATCHING' })

    // Add to state for global access
    state.CLIENT = botClient;
}