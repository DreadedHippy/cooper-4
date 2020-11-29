import Axios from "axios";
import CHANNELS from "../../../bot/core/config/channels.json";
import ChannelsHelper from "../../../bot/core/entities/channels/channelsHelper";
import MessagesHelper from "../../../bot/core/entities/messages/messagesHelper";
import UsersHelper from "../../../bot/core/entities/users/usersHelper";
import STATE from "../../../bot/state";

import achievementPostedHandler from "../../features/encouragement/achievementPosted";
import workPostHandler from "../../features/encouragement/workPosted";
import PointsHelper from "../../features/points/pointsHelper";
import introPosted from "../members/welcome/introPosted";


export default async function messageAddedHandler(msg) {  

    // Encourage posters in show work channel.
    if (msg.channel.id === CHANNELS.SHOWWORK.id) workPostHandler(msg);

    // Encourage achievement posters
    if (msg.channel.id === CHANNELS.ACHIEVEMENTS.id) achievementPostedHandler(msg);

    // Encourage intro posts with a wave and coop emoji
    if (msg.channel.id === CHANNELS.INTRO.id) introPosted(msg);

    // Inform feed that a suggestion was posted
    if (msg.channel.id === CHANNELS.SUGGESTIONS.id && !msg.author.bot) 
        ChannelsHelper._postToFeed(`New suggestion: <#${CHANNELS.SUGGESTIONS.id}>`);

    // TODO: When help message posted, post in feed



    // TODO: Filter out DM commands
    if (msg.channel.type === "dm") {
        // TODO: Add response capability
        // https://discordjs.guide/popular-topics/collectors.html#await-messages
        const annotatedMsgText = `DM message from ${msg.author.username}: ${msg.content}`;
        ChannelsHelper._postToChannelCode('LEADERS', annotatedMsgText);
    }



    /* --- MISCELLANEOUS FEATURES BELOW --- */

    // If message added by Ktrn that is only emojis, react to it.
    // TODO: Does not respond to messages contain server emojis.
    if (msg.author.id === '652820176726917130' && MessagesHelper.isOnlyEmojis(msg.content)) {
        setTimeout(() => { msg.react('🐇'); }, 666);
        setTimeout(() => { msg.react('🐰'); }, 666);
    }

    // Bruh-roulette.
    const twentyPercRoll = STATE.CHANCE.bool({ likelihood: 20 });
    if (msg.content.toLowerCase().indexOf('bruh') > -1 && !UsersHelper.isCooperMsg(msg)) {
        const updatedPoints = await PointsHelper.addPointsByID(msg.author.id, twentyPercRoll ? 1 : -1);
        setTimeout(() => {
            msg.say(
                `${twentyPercRoll ? '+1' : '-1'} point, bruh. ` +
                `${msg.author.username} ${twentyPercRoll ? 'won' : 'lost'} bruh-roulette. (${updatedPoints})!`
            );
        }, 666);
    }
    if (msg.content.toLowerCase() === 'i-' && UsersHelper.isCooperMsg(msg) && twentyPercRoll) msg.say('U-? Finish your sentence!');


    // If sefy facepalm's add recursive facepalm.
    if (msg.content.indexOf('🤦‍♂️') > -1 && msg.author.id === '208938112720568320') msg.react('🤦‍♂️');

    const target = msg.mentions.users.first();
    if (target) {

        // If targetting Cooper.
        if (UsersHelper.isCooper(target.id)) {
            if (msg.content.indexOf(';-;') > -1) msg.say(';-;');
            if (msg.content.indexOf('._.') > -1) msg.say('._.');
            if (msg.content.indexOf(':]') > -1) msg.say(':]');
            if (msg.content.indexOf(':}') > -1) msg.say(':}');
            if (msg.content.indexOf(':3') >-1) msg.say(':3');

            if (
                msg.content.indexOf('hate you') > -1 ||
                msg.content.indexOf('fuck you') > -1 ||
                msg.content.indexOf('die') > -1 ||
                msg.content.indexOf('stupid') > -1 ||
                msg.content.indexOf('dumb') > -1 ||
                msg.content.indexOf('idiot') > -1 ||
                msg.content.indexOf('retard') > -1 ||
                msg.content.indexOf('gay') > -1 ||
                msg.content.indexOf('ugly') > -1
            ) {
                setTimeout(async () => {
    
                    // Implement chance-based to rate limit and make easter egg not every time/ubiquitous.
                    if (rand.bool({ likelihood: 22.5 })) {
                        const endpoint = 'https://api.fungenerators.com/taunt/generate?category=shakespeare&limit=1';
                        const result = (await Axios.get(endpoint)).data || null;
                        const insults = (result.contents || null).taunts || null;
                        if (insults) msg.say(insults[0]);
                    }
                }, 250);
            }
        }
    }

    // Intercept inklingboi
    if (msg.author.id === '687280609558528000') {
        if (msg.content === ':0') msg.react('😉');
        if (msg.content === ':-:') msg.react('😉');
        if (msg.content === ';-;') msg.react('😉');
        if (msg.content === ';--;') msg.react('😉');
    }

}