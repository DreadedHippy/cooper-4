import path from 'path';
import { Client } from 'discord.js-commando';

export default () => {
    const client = new Client({ 
        owner: '723652650389733557',
        // https://stackoverflow.com/questions/56063379/how-to-fix-problem-with-reactions-restart-bot
        // https://discordjs.guide/popular-topics/partials.html#enabling-partials
        partials: ['CHANNEL', 'MESSAGE', 'REACTION']
    });

    client.registry
        .registerGroups([ 
            ['util', 'Utility and assistance commands.'],
            ['community', 'Community related commands.'],
            ['misc', 'Miscellaneous commands.'],
            ['mod', 'Moderation commands.'],
            ['info', 'Information commands.']
        ])
        .registerDefaultTypes()
        .registerCommandsIn(path.join(__dirname, '../../commands'));

    return client;
}


