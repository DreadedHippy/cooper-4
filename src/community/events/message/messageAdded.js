import CHANNELS from "../../../bot/core/config/channels.json";
import ChannelsHelper from "../../../bot/core/entities/channels/channelsHelper";

import achievementPostedHandler from "../../features/encouragement/achievementPosted";
import workPostHandler from "../../features/encouragement/workPosted";
import introPosted from "../members/welcome/introPosted";



export default function messageAddedHandler(msg) {
    
    // Encourage posters in show work channel.
    if (msg.channel.id === CHANNELS.SHOWWORK.id) workPostHandler(msg);

    // Encourage achievement posters
    if (msg.channel.id === CHANNELS.ACHIEVEMENTS.id) achievementPostedHandler(msg);

    // Encourage intro posts with a wave and coop emoji
    if (msg.channel.id === CHANNELS.INTRO.id) introPosted(msg);


    // Inform feed that a suggestion was posted
    if (msg.channel.id === CHANNELS.SUGGESTIONS.id) 
        ChannelsHelper._postToFeed(`New suggestion posted! <#${CHANNELS.SUGGESTIONS.id}>`);

    // TODO: When help message posted, post in feed

    // If sefy facepalm's add recursive facepalm.
    if (msg.content.indexOf('🤦‍♂️') > -1 && msg.author.id === '208938112720568320') {
        msg.react('🤦‍♂️');
    }
}