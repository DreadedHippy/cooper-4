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
import CooperMorality from './community/features/minigame/small/cooperMorality';
import ChannelsHelper from './core/entities/channels/channelsHelper';
import InstantFurnaceMinigame from './community/features/minigame/small/instantfurnace';



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

        // STATE.CLIENT.user.setPresence({ activity: { name: 'SACRIFICE REFORM 2021' }, status: 'online' });

        // ChopperMinigame.launch(.5);
        // ChopperMinigame.launch(1.25);

        InstantFurnaceMinigame.run();

        STATE.CLIENT.on('messageReactionAdd', InstantFurnaceMinigame.onReaction);

        // Create trade/accept trade command.
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
        // Trading system
        // Finish actions messages for woodcutting/mining/crate drop
        // Detect server message/activity velocity increases (as % preferably).
        // Detect the completed gathering of wood/rocks

        // DEV WORK AND TESTING ON THE LINES ABOVE.
    });

};

shallowBot();