import ChannelsHelper from "../../bot/core/entities/channels/channelsHelper";
import SacrificeHelper from "../features/events/sacrificeHelper";
import PointsHelper from "../features/points/pointsHelper";

import STATE from "../../bot/state";

import CratedropMinigame from "../features/minigame/small/cratedrop";
import EggHuntMinigame from "../features/minigame/small/egghunt";
import SuggestionsHelper from "../features/suggestions/suggestionsHelper";
import MiningMinigame from "../features/minigame/small/mining";
import EventsHelper from "../features/events/eventsHelper";

const feedSay = ChannelsHelper._postToFeed;

export const baseTickDur = 60 * 25 * 1000;

export default function registerCommunityEventsHandlers() {


  EventsHelper.chanceRunInterval(PointsHelper.updateCurrentWinner, 100, baseTickDur * 2);


  EventsHelper.chanceRunInterval(SacrificeHelper.random, 20, baseTickDur * 1.25);

  EventsHelper.chanceRunInterval(SuggestionsHelper.checkSuggestionsPassed, 100, baseTickDur * 4);


  EventsHelper.chanceRunInterval(CratedropMinigame.run, 80, baseTickDur);
  EventsHelper.chanceRunInterval(EggHuntMinigame.run, 80, baseTickDur / 2);
  EventsHelper.chanceRunInterval(MiningMinigame.run, 80, baseTickDur * 2);


  // Miscellaneous features.
  EventsHelper.chanceRunInterval(() => {
    feedSay('Ruuuuuu' + 'u'.repeat(STATE.CHANCE.natural({ min: 1, max: 20 })));
  }, 2.5, baseTickDur * 5);

  EventsHelper.chanceRunInterval(() => { feedSay('._.') }, 7, baseTickDur * 3.5);

}