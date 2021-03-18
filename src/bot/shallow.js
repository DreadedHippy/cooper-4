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
import SourceCommand from './commands/community/source';
import UsersHelper from './core/entities/users/usersHelper';
import InstantFurnaceMinigame from './community/features/minigame/small/instantfurnace';
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

            const sac = ChannelsHelper._getCode('SACRIFICE');
            const fetchedMessages = await sac.messages.fetch({ limit: 6 });

            // console.log(sac);
            console.log(fetchedMessages.size);


            // Message at the top of channel
            // Delete after 72 hours

            // Track last message secs from the latest messages updater and DB COL.
            // last_msg_secs

            // TODO: Also create a command !lastmsg @{user} to check their last message time.

            // const lastMsgFmt = UsersHelper.getLastMsgDateFmt('786671654721683517');
            // console.log(lastMsgFmt);

            // Add column and prevent repeats/back to back sacrifice
            // Track last sacrifice secs from sacrifice initiator and DB COL.


        // DEV WORK AND TESTING ON THE LINES ABOVE.


        // NOTES AND LONGER TERM CHALLENGES/ISSUES:

            // After sacrifice reform, using a similar patch:
                // Track member of week by historical_points DB COL and check every week.

                // Calculate the player with most items.
                    // ItemsHelper.updateMostItems()

        // Hard, Quick:
        
        // Harder:
            // Detect server message/activity velocity increases (as % preferably).
            // Community set and managed variable/value.

    });

};

shallowBot();