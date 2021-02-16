import { Client } from 'discord.js-commando';
import Database from './core/setup/database';
import STATE from './state';
import dotenv from 'dotenv';
import ChopperMinigame from './community/features/minigame/small/chopper';
import ItemTotalCommand from './commands/economy/itemTotal';
import ItemsHelper from './community/features/items/itemsHelper';
import EconomyHelper from './community/features/economy/economyHelper';
import TradeHelper from './community/features/economy/tradeHelper';



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

        // DEV WORK AND TESTING ON THE LINES BELOW.


        // Create a trade.
        await TradeHelper.create('test', 'test', 'AVERAGE_EGG', 'RARE_EGG', 1, 1);

        console.log(await TradeHelper.all());

        // Hard, Quick:
        // Add a multiplier to drops for wood etc... too weak atm.

        // Harder:
        // Finish actions messages for woodcutting/mining
        // Detect server message/activity velocity increases (as % preferably).
        // Detect the completed gathering of wood/rocks

        // DEV WORK AND TESTING ON THE LINES ABOVE.
    });

};

shallowBot();