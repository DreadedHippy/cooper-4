import { Client } from 'discord.js-commando';
import Database from './core/setup/database';
import STATE from './state';
import dotenv from 'dotenv';

// v DEV IMPORT AREA v
import ChannelsHelper from './core/entities/channels/channelsHelper';
import ElectionHelper from './community/features/hierarchy/election/electionHelper';
import Chicken from './community/chicken';

import moment from 'moment';
import ServerHelper from './core/entities/server/serverHelper';
import MessagesHelper from './core/entities/messages/messagesHelper';
import UsersHelper from './core/entities/users/usersHelper';
import CooperMorality from './community/features/minigame/small/cooperMorality';
// ^ DEV IMPORT AREA ^

dotenv.config();

const shallowBot = async () => {

    STATE.CLIENT = new Client({ owner: '786671654721683517' });

    await Database.connect();
    await STATE.CLIENT.login(process.env.DISCORD_TOKEN);

    STATE.CLIENT.on('ready', async () => {
        console.log('Shallow bot is ready');

        // DEV WORK AND TESTING ON THE LINES BELOW.


        const leftSecs = await ElectionHelper.votingPeriodLeftSecs();
        console.log(leftSecs);

        // console.log(await ElectionHelper.isElectionOn());

        // DEV WORK AND TESTING ON THE LINES ABOVE.
    });

};

shallowBot();