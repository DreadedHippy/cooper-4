import { Client } from 'discord.js-commando';
import Database from './core/setup/database';
import STATE from './state';
import dotenv from 'dotenv';

// v DEV IMPORT AREA v
import ChannelsHelper from './core/entities/channels/channelsHelper';
import ElectionHelper from './community/features/hierarchy/election/electionHelper';
import Chicken from './community/chicken';

import moment from 'moment';
// ^ DEV IMPORT AREA ^

dotenv.config();

const shallowBot = async () => {

    STATE.CLIENT = new Client({ owner: '786671654721683517' });

    await Database.connect();
    await STATE.CLIENT.login(process.env.DISCORD_TOKEN);

    STATE.CLIENT.on('ready', async () => {
        console.log('Shallow bot is ready');

        // DEV WORK AND TESTING ON THE LINES BELOW.

        // TODO: Detect start of new election!


        ElectionHelper.checkProgress()




        // Get formatted next election and last election.
        const lastElec = await ElectionHelper.lastElecFmt();
        const lastElecSecs = await ElectionHelper.lastElecSecs();

        const nextElec = await ElectionHelper.nextElecFmt();
        const nextElecSecs = await ElectionHelper.nextElecSecs();

        const nowMoment = moment.unix(Date.now() / 1000);



        // Chicken.setConfig('last_election', lastElecSecs - (3600 * 18));
        // console.log(lastElec);

        // console.log(nowMoment.format('dddd, MMMM Do YYYY, h:mm:ss a'))

        // console.log(nextElec);

        // DEV WORK AND TESTING ON THE LINES ABOVE.
    });

};

shallowBot();