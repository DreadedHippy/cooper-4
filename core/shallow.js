import { Client } from 'discord.js-commando';
import Database from './setup/database';
import STATE from './src/state';
import dotenv from 'dotenv';


// v DEV IMPORT AREA v
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


            // See if toxic egg still works on someone with no points -> negative
            // See if toxic egg still works on someone with points as items


            // console.log(await PointsHelper.getHighest());





            // Track member of week by historical_points DB COL and check every week.
                // Schedule weekly growth analysis like election works...
                // Need at least 2 db alters or chicken.setConfig to track last analysis time.

            // Calculate the player with most items.
                // Reward keys?


            // For every player over 0 points


            
            // CraftingHelper.craft()

        // DEV WORK AND TESTING ON THE LINES ABOVE.


        // NOTES AND LONGER TERM CHALLENGES/ISSUES:
        
            // Hard, Quick:
                // Sacrifice message at the top of channel HALF_DONE
            
            // Harder:
                // Detect server message/activity velocity increases (as % preferably).
                // Community set and managed variable/value.

    });
};

shallowBot();