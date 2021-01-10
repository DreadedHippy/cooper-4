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
// ^ DEV IMPORT AREA ^

dotenv.config();

const shallowBot = async () => {

    STATE.CLIENT = new Client({ owner: '786671654721683517' });

    await Database.connect();
    await STATE.CLIENT.login(process.env.DISCORD_TOKEN);

    STATE.CLIENT.on('ready', async () => {
        console.log('Shallow bot is ready');

        // DEV WORK AND TESTING ON THE LINES BELOW.
        // Check if election is currently within the voting period... ERRR

        await Chicken.setConfig('last_election', '1607998362');
        await Chicken.setConfig('election_on', 'false');


        const lastElec = await Chicken.getConfigVal('last_election');
        const isOn = await Chicken.getConfigVal('election_on');

        const isVotingPer = await ElectionHelper.isVotingPeriod();

        console.log('lastElec', lastElec);
        console.log('isOn', isOn);
        console.log('isVotingPer', isVotingPer);

        // Last value, set this as last_election and turn election off for a repeat try. ;)
        // 1607998362


        // Output time remaining to vote.


        const progress = await ElectionHelper.checkProgress();

        // DEV WORK AND TESTING ON THE LINES ABOVE.
    });

};

shallowBot();