import Axios from "axios";
import { Chance } from "chance";
import CHANNELS from "../../../bot/core/config/channels.json";
import ChannelsHelper from "../../../bot/core/entities/channels/channelsHelper";
import STATE from "../../../bot/state";

import achievementPostedHandler from "../../features/encouragement/achievementPosted";
import workPostHandler from "../../features/encouragement/workPosted";
import introPosted from "../members/welcome/introPosted";

const rand = new Chance;

export default function messageAddedHandler(msg) {
    
    // Prevent the bruhs
    if (msg.content.indexOf('bruh') > -1) {
        msg.say('bruh');
        // TODO: Subtract points
    }

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

    // If sefy facepalm's add recursive facepalm.
    if (msg.content.indexOf('🤦‍♂️') > -1 && msg.author.id === '208938112720568320') {
        msg.react('🤦‍♂️');
    }


    const target = msg.mentions.users.first();
    if (target) {

        // If targetting Cooper.
        if (target.id === STATE.CLIENT.user.id) {
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
    if (msg.author.id === '723652650389733557' && msg.content === ';-;') msg.react('😉');
    if (msg.author.id === '723652650389733557' && msg.content === ';--;') msg.react('😉');

}