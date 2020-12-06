import path from 'path';
import { Client } from 'discord.js-commando';

import joined from "../../../community/events/members/welcome/joined";
import left from "../../../community/events/members/welcome/left";
import messageAddedHandler from "../../../community/events/message/messageAdded";
import reactAddedHandler from "../../../community/events/reaction/reactionAdded";

export default () => {
    const client = new Client({ owner: '723652650389733557' });

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


