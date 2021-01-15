import { Client } from 'discord.js-commando';
import Database from './core/setup/database';
import STATE from './state';
import dotenv from 'dotenv';
import UsersHelper from './core/entities/users/usersHelper';
import Chicken from './community/chicken';
import ChannelsHelper from './core/entities/channels/channelsHelper';
import MessagesHelper from './core/entities/messages/messagesHelper';
import ItemsHelper from './community/features/items/itemsHelper';
import DropTable from './community/features/items/droptable';
import EggHuntMinigame from './community/features/minigame/small/egghunt';
import ElectionHelper from './community/features/hierarchy/election/electionHelper';
import StatisticsHelper from './community/features/server/statisticsHelper';
import AboutHelper from './community/features/server/aboutHelper';

// v DEV IMPORT AREA v

// ^ DEV IMPORT AREA ^

dotenv.config();

const shallowBot = async () => {

    STATE.CLIENT = new Client({ owner: '786671654721683517' });

    await Database.connect();
    await STATE.CLIENT.login(process.env.DISCORD_TOKEN);

    STATE.CLIENT.on('ready', async () => {
        console.log('Shallow bot is ready');


        // DEV WORK AND TESTING ON THE LINES BELOW.
        
        await AboutHelper.preloadMesssages();
        STATE.CLIENT.on('messageReactionAdd', (reaction, user) => {
                AboutHelper.onReaction(reaction, user);
        });








        // msg.suppressEmbeds(true);

        // DEV WORK AND TESTING ON THE LINES ABOVE.
    });

};

shallowBot();