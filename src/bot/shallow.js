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


        // List my own/users trades (like items command) My trades command including # slots
        // List all trades, trades of item, trades of matching items.


        // const matches = await TradeHelper.findOfferReceiveMatches(offerItemCode, receiveItemCode);
        // console.log(matches);

        // const types = await TradeHelper.findReceiveMatches(offerItemCode);
        // console.log(types);

        

        // NOTES AND LONGER TERM CHALLENGES/ISSUES:
        // Get exchange rate based on current trades for that item
        // Add exchange rate method (command)


        // Hard, Quick:
        // Add a multiplier to drops for wood etc... too weak atm.

        // Harder:
        // Finish actions messages for woodcutting/mining/crate drop
        // Detect server message/activity velocity increases (as % preferably).
        // Detect the completed gathering of wood/rocks

        // DEV WORK AND TESTING ON THE LINES ABOVE.
    });

};

shallowBot();