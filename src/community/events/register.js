import CHANNELS from "../../bot/core/config/channels.json";

import workPostHandler from "../features/encouragement/workPosted";
import joined from "./members/joined";

import EggHuntMinigame from "../features/minigame/small/egghunt";
import achievementPostedHandler from "../features/encouragement/achievementPosted";



export default function registerCommunityEventsHandlers(discordClient) {

  // Half-hourly checks for recurring events.
  setInterval(() => {

    EggHuntMinigame.run();

    // TODO: Minute of silence and stillness.

    // TODO: Islamic prayer reminders

  }, 60 * 10 * 1000);


  // Handler for a new member has joined
  discordClient.on("guildMemberAdd", joined);

  // TODO: Member left
  

  discordClient.on("message", msg => {
    
    // Encourage posters in show work channel.
    if (msg.channel.id === CHANNELS.SHOWWORK.id) workPostHandler(msg);

    // Encourage achievement posters
    if (msg.channel.id === CHANNELS.ACHIEVEMENTS.id) achievementPostedHandler(msg);

    // TODO: Encourage intro posts with a wave and coop emoji

  });

}