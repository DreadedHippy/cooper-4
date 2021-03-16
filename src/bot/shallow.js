import { Client } from 'discord.js-commando';
import Database from './core/setup/database';
import STATE from './state';
import dotenv from 'dotenv';

// v DEV IMPORT AREA v
import BlockIO from 'block_io';
import ReservesHelper from './community/features/economy/reservesHelper';
import ElectionHelper from './community/features/hierarchy/election/electionHelper';
import ItemsHelper from './community/features/items/itemsHelper';
import ChannelsHelper from './core/entities/channels/channelsHelper';
import TradeHelper from './community/features/economy/tradeHelper';
// ^ DEV IMPORT AREA ^

// Load ENV variables.
dotenv.config();

const shallowBot = async () => {
    // Instantiate a CommandoJS "client".
    STATE.CLIENT = new Client({ owner: '786671654721683517' });

    // Connect to Postgres database.
    await Database.connect();
    
    // Login, then wait for the bot to be fully online before testing.
    await STATE.CLIENT.login(process.env.DISCORD_TOKEN);
    STATE.CLIENT.on('ready', async () => {
        console.log('Shallow bot is ready');
            

        
        // DEV WORK AND TESTING ON THE LINES BELOW.

            // Sacrifice reform as promised.
            // No more than 5 at once
            // Message at the top of channel
            // Delete after 72 hours
            // Add column and prevent repeats/back to back sacrifice

        // DEV WORK AND TESTING ON THE LINES ABOVE.


        // NOTES AND LONGER TERM CHALLENGES/ISSUES:
        
        // Hard, Quick:
        
        // Harder:
            // Detect server message/activity velocity increases (as % preferably).
            // Community set and managed variable/value.

    });

};

shallowBot();