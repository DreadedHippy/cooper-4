import CratedropMinigame from "../features/minigame/small/cratedrop";
import EggHuntMinigame from "../features/minigame/small/egghunt";

import joined from "./members/welcome/joined";
import left from "./members/welcome/left";

import messageAddedHandler from "./message/messageAdded";
import reactAddedHandler from "./reaction/reactionAdded";

export default function registerCommunityEventsHandlers(client) {

  // Half-hourly checks for recurring events.
  setInterval(() => {
    EggHuntMinigame.run();
    // CratedropMinigame.run();

    // TODO: Minute of silence and stillness.
    // Need to pick a time in the day for this.


    // TODO: Islamic prayer reminders
    // TODO: Chance of random quote
  }, 60 * 10 * 1000);

  // Add handler for reaction added
  client.on('messageReactionAdd', reactAddedHandler);

  // Handler for a new member has joined
  client.on("guildMemberAdd", joined);

  // Member left handler.
  client.on('guildMemberRemove', left);

  // Message interceptors.
  client.on("message", messageAddedHandler);

}