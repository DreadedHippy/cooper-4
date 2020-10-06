import CHANNELS from "../../../bot/core/config/channels.json";

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

    // TODO: Inform feed that a suggestion was posted

    // TODO: When help message posted, post in feed

    // TODO: If sefy facepalm's add recursive facepalm.

}