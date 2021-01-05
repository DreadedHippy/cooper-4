import { Client } from 'discord.js-commando';
import Database from './core/setup/database';
import STATE from './state';
import dotenv from 'dotenv';

// v DEV IMPORT AREA v
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

            // Remove 12 hours from Cooper current time
            const currentSecs = await Chicken.getCurrentDaySecs();
            const currentMoment = moment.unix(currentSecs);
            const pastMoment = currentMoment.subtract(12, 'hours');

            const pastSecs = ((+pastMoment) / 1000);

            await Chicken.setConfig('current_day', pastSecs)

        // DEV WORK AND TESTING ON THE LINES ABOVE.
    });

};

shallowBot();