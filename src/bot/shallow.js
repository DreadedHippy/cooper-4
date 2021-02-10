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

        // Check if election turned on.
        // const elecOn = await Chicken.getConfigVal('election_on');
        // console.log(elecOn);
        // const isElecOn = await ElectionHelper.isElectionOn();
        // console.log(isElecOn);

        
        const isVotingPeriod = await ElectionHelper.isVotingPeriod();

        const nowSecs = parseInt(Date.now() / 1000);

        const lastElecSecs = await ElectionHelper.lastElecSecs();
        const termDuration = ElectionHelper.TERM_DUR_SECS;

        // console.log(nowSecs > lastElecSecs + termDuration);

        // console.log((lastElecSecs + termDuration), nowSecs);

        // console.log((lastElecSecs + termDuration) - nowSecs);

        // console.log(TimeHelper.humaniseSecs((lastElecSecs + termDuration) - nowSecs));

        console.log(isVotingPeriod);
        // console.log(nowSecs, lastElecSecs);

        // Find out why Cooper thinks it isn't voting period now...
        
        // 1,000,000
        // 1 million seconds
        // 16,667 minutes
        // 278 hours
        // 12 days
        // 12 days x 3 = 36 days (rough estimate)
        // 2983326

        // Hard, Quick:
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