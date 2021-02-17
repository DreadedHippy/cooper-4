import path from 'path';
import { Client } from 'discord.js-commando';

import joined from "../../../bot/community/events/members/welcome/joined";
import left from "../../../bot/community/events/members/welcome/left";
import messageAddedHandler from "../../../bot/community/events/message/messageAdded";
import reactAddedHandler from "../../../bot/community/events/reaction/reactionAdded";

export default () => {
    const client = new Client({ owner: '786671654721683517' });


    process.on("unhandledRejection", (error) => {
        console.error(error); // This prints error with stack included (as for normal errors)
        // throw error; // Following best practices re-throw error and let the process exit with error code
    });

    client.registry
        .registerGroups([ 
            ['util', 'Utility and assistance commands.'],
            ['community', 'Community related commands.'],
            ['election', 'Election related commands.'],
            ['economy', 'Economy related commands.'],
            ['skills', 'Skills related commands.'],
            ['misc', 'Miscellaneous commands.'],
            ['mod', 'Moderation commands.'],
            ['info', 'Information commands.']
        ])
        .registerDefaultTypes()
        .registerCommandsIn(path.join(__dirname, '../../commands'));


    // Add handler for reaction added
    client.on('messageReactionAdd', reactAddedHandler);

    // Handler for a new member has joined
    client.on("guildMemberAdd", joined);

    // Member left handler.
    client.on('guildMemberRemove', left);

    // Message interceptors.
    client.on("message", messageAddedHandler);

    return client;
}


