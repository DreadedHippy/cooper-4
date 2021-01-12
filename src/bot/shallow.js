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

        // TODO:
        // I should end and clean up current election and let the day slide into election...

        // const voteSecs = await ElectionHelper.votingPeriodLeftSecs();
        // const lastElec = parseInt(await Chicken.getConfigVal('last_election'));
        // const adjustedSecs = lastElec - (ElectionHelper.DURATION_SECS / 7);
        // Chicken.setConfig('last_election', adjustedSecs)

        // ElectionHelper.commentateElectionProgress();


        const votes = await ElectionHelper.fetchAllVotes();
        console.log(votes);

        const hierarchy = ElectionHelper.calcHierarchy(votes);
        console.log(hierarchy);

        // Try to trigger function which should update election results

        // DEV WORK AND TESTING ON THE LINES ABOVE.
    });

};

shallowBot();