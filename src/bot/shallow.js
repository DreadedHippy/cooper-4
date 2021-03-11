import { Client } from 'discord.js-commando';
import Database from './core/setup/database';
import STATE from './state';
import dotenv from 'dotenv';
<<<<<<< HEAD
=======
import ChopperMinigame from './community/features/minigame/small/chopper';
import ItemTotalCommand from './commands/economy/itemTotal';
import ItemsHelper from './community/features/items/itemsHelper';
import EconomyHelper from './community/features/economy/economyHelper';
import TradeHelper from './community/features/economy/tradeHelper';
import ElectionHelper from './community/features/hierarchy/election/electionHelper';
import ServerHelper from './core/entities/server/serverHelper';
import CooperMorality from './community/features/minigame/small/cooperMorality';
import ChannelsHelper from './core/entities/channels/channelsHelper';
import InstantFurnaceMinigame from './community/features/minigame/small/instantfurnace';
import MessagesHelper from './core/entities/messages/messagesHelper';
import SacrificeHelper from './community/features/events/sacrificeHelper.js';

>>>>>>> c9508f73382bf5a934f44ef2c2b76ed358f58d91


// v DEV IMPORT AREA v

import BlockIO from 'block_io';

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

        const WALLET = new BlockIO(process.env.BITCOIN_APIKEY);
        console.log(await WALLET.get_balance());
        
        
        // NOTES AND LONGER TERM CHALLENGES/ISSUES:
        // List my own/users trades (like items command).
        // List all trades, trades of item, trades of matching items.
        // Get exchange rate based on current trades for that item

        // Add exchange rate method (command)
        // My trades command including # slots
        // Create a trade.
        // Accept a trade.
        // ...
        // Accept a specific trade may need a command


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