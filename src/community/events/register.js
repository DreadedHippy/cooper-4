import ChannelsHelper from "../../bot/core/entities/channels/channelsHelper";
import SacrificeHelper from "../features/events/sacrificeHelper";
import PointsHelper from "../features/points/pointsHelper";

import STATE from "../../bot/state";

import joined from "./members/welcome/joined";
import left from "./members/welcome/left";
import messageAddedHandler from "./message/messageAdded";
import reactAddedHandler from "./reaction/reactionAdded";

import CratedropMinigame from "../features/minigame/small/cratedrop";
import EggHuntMinigame from "../features/minigame/small/egghunt";
import SuggestionsHelper from "../features/suggestions/suggestionsHelper";
import MiningMinigame from "../features/minigame/small/mining";
import EventsHelper from "../features/events/eventsHelper";

const feedSay = ChannelsHelper._postToFeed;

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

  // TODO: Convert rest to helper chanceRunInterval method

  // Hourly actions
  setInterval(() => {
    PointsHelper.updateCurrentWinner();
  }, 60 * 60 * 1000);

  // Every 6 hours 25% chance of offering someone for sacrifice.
  setInterval(() => {
    if (STATE.CHANCE.bool({ likelihood: 75 })) SacrificeHelper.random();

    SuggestionsHelper.checkSuggestionsPassed();
  }, ((60 * 60) * 6) * 1000);

  const crateDropInterval = 60 * 25 * 1000;
  setInterval(() => { CratedropMinigame.run(crateDropInterval); }, crateDropInterval);
  setInterval(() => { EggHuntMinigame.run(); }, crateDropInterval / 2);
  setInterval(() => { MiningMinigame.run(); }, crateDropInterval * 2);

  // Miscellaneous features.
  EventsHelper.chanceRunInterval(() => { feedSay(';-;') }, 4, 60 * 45 * 1000);

  EventsHelper.chanceRunInterval(() => {
    feedSay('Ruuuuuu' + 'u'.repeat(STATE.CHANCE.natural({ min: 1, max: 20 })));
  }, 2.5, ((60 * 60) * 3) * 1000);

  EventsHelper.chanceRunInterval(() => { feedSay('._.') }, 7, 60 * 120 * 1000);

}