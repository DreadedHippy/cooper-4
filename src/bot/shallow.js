import { Client } from 'discord.js-commando';
import Database from './core/setup/database';
import STATE from './state';
import dotenv from 'dotenv';
import MessagesHelper from './core/entities/messages/messagesHelper';
import Chicken from './community/chicken';
import ElectionHelper from './community/features/hierarchy/election/electionHelper';
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

        // // Add a reaction to a propagated message!!!
        

        // DEV WORK AND TESTING ON THE LINES BELOW.

        // DEV WORK AND TESTING ON THE LINES ABOVE.
    });

};

shallowBot();