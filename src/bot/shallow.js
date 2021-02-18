import { Client } from 'discord.js-commando';
import Database from './core/setup/database';
import STATE from './state';
import dotenv from 'dotenv';
import ChopperMinigame from './community/features/minigame/small/chopper';
import ItemTotalCommand from './commands/economy/itemTotal';
import ItemsHelper from './community/features/items/itemsHelper';
import EconomyHelper from './community/features/economy/economyHelper';
import TradeHelper from './community/features/economy/tradeHelper';
import ElectionHelper from './community/features/hierarchy/election/electionHelper';
import ServerHelper from './core/entities/server/serverHelper';



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

        // Create trade/accept trade command.
        // List my own/users trades (like items command).
        // List all trades, trades of item, trades of matching items.
        // Get exchange rate based on current trades for that item


        // Add exchange rate method (command)




        // Get trading slots working
        // TODO: Command for viewing trading slots and other peoples'

        // Create a trade.
        // await TradeHelper.create('test', 'test', 'AVERAGE_EGG', 'LEGENDARY_EGG', 1, 1);
        // console.log(await TradeHelper.all());

        // const offerMatches = await TradeHelper.findOfferMatches('AVERAGE_EGG');
        // console.log(offerMatches);

        // const offerReceiveMatches = await TradeHelper.findOfferReceiveMatches('AVERAGE_EGG', 'LEGENDARY_EGG');
        // console.log(offerReceiveMatches);

        // const offerReceiveMatchesQty = await TradeHelper.findOfferReceiveMatchesQty('AVERAGE_EGG', 'LEGENDARY_EGG', 1, 1);
        // console.log(offerReceiveMatchesQty);

        // TradeHelper.findOfferReceiveMatches(offerItem, receiveItem)
        // const match = TradeHelper.findOfferReceiveMatchesQty(offerItem, receiveItem, offerQty, receiveQty);

    // Reverse the search order (inversion of give versus take).

        // Hard, Quick:
        // Add a multiplier to drops for wood etc... too weak atm.

        // Harder:
        // Trading system
        // Finish actions messages for woodcutting/mining/crate drop
        // Detect server message/activity velocity increases (as % preferably).
        // Detect the completed gathering of wood/rocks

        // DEV WORK AND TESTING ON THE LINES ABOVE.
    });

};

shallowBot();