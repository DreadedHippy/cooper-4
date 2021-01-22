import { Client } from 'discord.js-commando';
import Database from './core/setup/database';
import STATE from './state';
import dotenv from 'dotenv';
import MessagesHelper from './core/entities/messages/messagesHelper';
import Chicken from './community/chicken';
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

        // NOTES AND LONGER TERM CHALLENGES/ISSUES:
        // msg.suppressEmbeds(true);

        // Then I can ping for self-roles/access and election...
        // ChannelsHelper._postToChannelCode('KEY_INFO', 'TEST?')

        // // Add a reaction to a propagated message!!!
        // ChannelsHelper._postToChannelCode('ACTIONS', 'TEST');
        // ChannelsHelper.propagate(reaction.message, feedbackMsgText, 'ACTIONS');

        // DEV WORK AND TESTING ON THE LINES BELOW.



        // STATE.CLIENT.on("message", msg => {
        //     const urlRegexExp = '(?:(?:http|https)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?';
        //     const regex = new RegExp(urlRegexExp, 'i');

        //     // Check if message contains link.
        //     if (regex.test(msg.content)) {
        //         console.log('Message contains link');
        //         msg.suppressEmbeds(true);
        //     }
        // });

        // Just a small update

        // There are now 20 hours left in election, vote in election channel or !stand for election if you want to try a last minute attempt at leader/commander victory

        // A lot of actions related to the economy which are taking up a lot of space in feed are now going to be redirected to #actions―˻📉˼ under #economy―˻🤝˼ category.

        // DEV WORK AND TESTING ON THE LINES ABOVE.
    });

};

shallowBot();