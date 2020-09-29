import path from 'path';
import { Client } from 'discord.js-commando';

export default () => {
    const client = new Client({ owner: '723652650389733557' });

    client.registry
        .registerGroups([ 
            ['util', 'Utility and assistance commands.'] 
        ])
        .registerDefaultTypes()
        .registerCommandsIn(path.join(__dirname, '../../commands'));

    return client;
}


