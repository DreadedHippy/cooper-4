import { Client } from 'discord.js-commando';
import Database from './core/setup/database';
import STATE from './state';
import dotenv from 'dotenv';

import ElectionHelper from './community/features/hierarchy/election/electionHelper';
import SacrificeHelper from './community/features/events/sacrificeHelper';
import UsersHelper from './core/entities/users/usersHelper';
import ChannelsHelper from './core/entities/channels/channelsHelper';

// v DEV IMPORT AREA v

// ^ DEV IMPORT AREA ^

dotenv.config();

const shallowBot = async () => {

    STATE.CLIENT = new Client({ owner: '786671654721683517' });

    await Database.connect();
    await STATE.CLIENT.login(process.env.DISCORD_TOKEN);

    STATE.CLIENT.on('ready', async () => {
        console.log('Shallow bot is ready');

        // NOTES AND LONGER TERM CHALLENGES/ISSUES:
        // msg.suppressEmbeds(true);
        // Then I can ping for self-roles/access and election...
        // ChannelsHelper._postToChannelCode('KEY_INFO', 'TEST?')

        // // Add a reaction to a propagated message!!!
        // ChannelsHelper._postToChannelCode('ACTIONS', 'TEST');
        // ChannelsHelper.propagate(reaction.message, feedbackMsgText, 'ACTIONS');

        // DEV WORK AND TESTING ON THE LINES BELOW.

        // DEV WORK AND TESTING ON THE LINES ABOVE.
    });

};

shallowBot();