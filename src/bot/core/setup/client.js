import path from 'path';
import { Client } from 'discord.js-commando';

export default () => {
    const client = new Client({ 
        owner: '723652650389733557',

        // ws: { 
        //     intents: [
        //         "GUILD_MESSAGES",
        //         'GUILD_MEMBERS'
        //     ]
        // }
    });

    client.registry
        .registerGroups([ 
            ['util', 'Utility and assistance commands.'],
            ['community', 'Community related commands.'],
            ['economy', 'Economy related commands.'],
            ['misc', 'Miscellaneous commands.'],
            ['mod', 'Moderation commands.'],
            ['info', 'Information commands.']
        ])
        .registerDefaultTypes()
        .registerCommandsIn(path.join(__dirname, '../../commands'));

    return client;
}


