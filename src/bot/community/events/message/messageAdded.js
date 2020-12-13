import Axios from "axios";
import CHANNELS from "../../../core/config/channels.json";
import ChannelsHelper from "../../../core/entities/channels/channelsHelper";
import MessagesHelper from "../../../core/entities/messages/messagesHelper";
import UsersHelper from "../../../core/entities/users/usersHelper";
import STATE from "../../../state";

import achievementPostedHandler from "../../features/encouragement/achievementPosted";
import workPostHandler from "../../features/encouragement/workPosted";
import ConfessionHandler from "../../features/messages/confessionHandler";
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

    ConfessionHandler.onMessage(msg);


    /* --- MISCELLANEOUS FEATURES BELOW --- */

    // If message added by Ktrn that is only emojis, react to it.
    // TODO: Does not respond to messages contain server emojis.
    if (msg.author.id === '652820176726917130' && MessagesHelper.isOnlyEmojis(msg.content)) {

        setTimeout(() => { msg.react('🐇'); }, 666);
        setTimeout(() => { msg.react('🐰'); }, 666);
    }

    // Bruh-roulette.
    const twentyPercRoll = STATE.CHANCE.bool({ likelihood: 20 });
    const isBruh = msg.content.toLowerCase().indexOf('bruh') > -1;
    const isBreh = msg.content.toLowerCase().indexOf('breh') > -1;
    // TODO: Account for bruuuh
    if ((isBreh || isBruh) && !UsersHelper.isCooperMsg(msg)) {
        let type = 'bruh';
        if (isBreh) type = 'breh';
        const updatedPoints = await PointsHelper.addPointsByID(msg.author.id, twentyPercRoll ? 1 : -1);
        setTimeout(async () => {
            const feedbackMsg = msg.say(
                `${twentyPercRoll ? '+1' : '-1'} point, ${type}. ` +
                `${msg.author.username} ${twentyPercRoll ? 'won' : 'lost'} ${type}-roulette. (${updatedPoints})!`
            );

            MessagesHelper.delayDelete(feedbackMsg, 15000);

            setTimeout(() => {
                if (STATE.CHANCE.bool({ likelihood: 1.5 })) {
                    ChannelsHelper._postToFeed(`Well, that's unfortunate... ${msg.author.username} was kicked for saying ${type}.`);
                    UsersHelper._dm(msg.author.id, `You hit the 1.5% chance of being kicked for saying ${type}.`);
                    msg.member.kick();
                }
            }, 1222);
        }, 666);
    }
    if (msg.content.toLowerCase() === 'i-' && !UsersHelper.isCooperMsg(msg) && twentyPercRoll) msg.say('U-? Finish your sentence!');


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
                    if (STATE.CHANCE.bool({ likelihood: 22.5 })) {
                        const endpoint = 'https://api.fungenerators.com/taunt/generate?category=shakespeare&limit=1';
                        const result = (await Axios.get(endpoint)).data || null;
                        const insults = (result.contents || null).taunts || null;
                        if (insults) msg.say(insults[0]);
                    }
                }, 250);
            }
        }
    }

    if (twentyPercRoll) {
        if (msg.content.toLowerCase().indexOf('marx') > -1) msg.react('☭');
        if (msg.content.toLowerCase().indexOf('socialism') > -1) msg.react('☭');
        if (msg.content.toLowerCase().indexOf('redistribute') > -1) msg.react('☭');
        if (msg.content.toLowerCase().indexOf('taxes') > -1) msg.react('☭');
        if (msg.content.toLowerCase().indexOf('capitalism') > -1) msg.react('💰');
        if (msg.content.toLowerCase().indexOf('bread') > -1) msg.react('🍞');

        // Intercept inklingboi
        if (msg.author.id === '687280609558528000') {
            const inklingboiSmileys = [':0', ':-:', ';-;', ';--;', '._.'];
            if (inklingboiSmileys.includes(msg.content)) msg.react('😉');
        }
    }


}