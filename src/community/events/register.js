import CratedropMinigame from "../features/minigame/small/cratedrop";
import EggHuntMinigame from "../features/minigame/small/egghunt";
import Chance from 'chance';

import joined from "./members/welcome/joined";
import left from "./members/welcome/left";

import messageAddedHandler from "./message/messageAdded";
import reactAddedHandler from "./reaction/reactionAdded";
import ChannelsHelper from "../../bot/core/entities/channels/channelsHelper";

export default function registerCommunityEventsHandlers(client) {

  // Add handler for reaction added
  client.on('messageReactionAdd', reactAddedHandler);

  // Handler for a new member has joined
  client.on("guildMemberAdd", joined);

  // Member left handler.
  client.on('guildMemberRemove', left);

  // Message interceptors.
  client.on("message", messageAddedHandler);


  /** ___--___ EVENT/FEATURE RELATED SCHEDULING ___--___ */

  // TODO: Every 6 hours 25% chance of offering someone for sacrifice.

  const crateDropInterval = 60 * 60 * 1000;
  setInterval(() => { CratedropMinigame.run(crateDropInterval); }, crateDropInterval);

  setInterval(EggHuntMinigame.run, 60 * 15 * 1000);

  // Miscellaneous features.
  const chanceInstance = new Chance;
  setInterval(() => {
    if (chanceInstance.bool({ likelihood: 5 })) ChannelsHelper._postToFeed(';-;');

    const extraUs = 'u'.repeat(chanceInstance.natural({ min: 1, max: 20 }));
    if (chanceInstance.bool({ likelihood: 2.5 })) ChannelsHelper._postToFeed('Ruuuuuu' + extraUs);
  }, 60 * 60 * 1000);

}