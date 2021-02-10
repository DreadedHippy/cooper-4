import { Client } from 'discord.js-commando';
import Database from './core/setup/database';
import STATE from './state';
import dotenv from 'dotenv';
import CraftingHelper from './community/features/skills/crafting/craftingHelper';
import ServerHelper from './core/entities/server/serverHelper';
import Chicken from './community/chicken';
import ElectionHelper from './community/features/hierarchy/election/electionHelper';
import MessagesHelper from './core/entities/messages/messagesHelper';
import TimeHelper from './community/features/server/timeHelper';
import ChannelsHelper from './core/entities/channels/channelsHelper';
import CHANNELS from '../bot/core/config/channels.json';


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
        
       
        // Hard, Quick:
        // If Cooper is feeling good, randomly give a user items.
        // Finish alching
        // Add a multiplier to drops for wood etc... too weak atm.
        // Prevent voting for self in sacrifice

        // Harder:
        // Finish actions messages for woodcutting/mining
        // Detect server message/activity velocity increases (as % preferably).
        // Detect the completed gathering of wood/rocks

        // DEV WORK AND TESTING ON THE LINES ABOVE.
    });

};

shallowBot();