import { Client } from 'discord.js-commando';
import path from 'path';

export default () => {
    const client = new Client({ owner: '723652650389733557' });

    client.registry
        .registerGroups([
            ['util', 'Utility and assistance commands.'],
        ])
        .registerCommandsIn(path.join(__dirname, '../commands'));

    client
        .on('error', console.error)
        .on('warn', console.warn)
        .on('debug', console.log)
        .on('ready', () => { console.log(`Logged in as ${client.user.username}`); })
        .on('disconnect', () => { console.warn('Disconnected!'); })
        .on('reconnecting', () => { console.warn('Reconnecting...'); });

    client.login(process.env.DISCORD_TOKEN);
}