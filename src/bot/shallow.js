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
// ^ DEV IMPORT AREA ^

dotenv.config();

const shallowBot = async () => {

    STATE.CLIENT = new Client({ owner: '786671654721683517' });

    await Database.connect();
    await STATE.CLIENT.login(process.env.DISCORD_TOKEN);

    STATE.CLIENT.on('ready', async () => {
        console.log('Shallow bot is ready');

        // DEV WORK AND TESTING ON THE LINES BELOW.
        // 1607897850 <- Dec 13th in seconds

        // Push election to end to see what happens
        // const lastElecSecs = await ElectionHelper.lastElecSecs();
        // console.log(lastElecSecs);
        
        // const prevVal = parseInt(await Chicken.getConfigVal('last_election'));
        // const updateVal = prevVal - (ElectionHelper.INTERVAL_SECS / 2);
        // await Chicken.setConfig('last_election', updateVal);
        

        // Create an election info message for cooper to maintain.
        // ChannelsHelper._postToChannelCode('ELECTION', 'RESERVED INFO MESSAGE');


        // https://discord.com/channels/723660447508725802/796823730483363860/796866755632037958

        // TODO: Remove all emojis from that election message lol.


        
        console.log(await ElectionHelper.lastElecFmt());

        console.log(await ElectionHelper.nextElecFmt());

        // Get stand working and test if someone can vote twice.

        await ElectionHelper.checkProgress();


        // DEV WORK AND TESTING ON THE LINES ABOVE.
    });

};

shallowBot();