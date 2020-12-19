import ChannelsHelper from "../../core/entities/channels/channelsHelper";
import SacrificeHelper from "../features/events/sacrificeHelper";
import PointsHelper from "../features/points/pointsHelper";

import STATE from "../../state";

import CratedropMinigame from "../features/minigame/small/cratedrop";
import EggHuntMinigame from "../features/minigame/small/egghunt";
import SuggestionsHelper from "../features/suggestions/suggestionsHelper";
import MiningMinigame from "../features/minigame/small/mining";
import EventsHelper from "../features/events/eventsHelper";

const feedSay = ChannelsHelper._postToFeed;

export const baseTickDur = 60 * 25 * 1000;

export default function eventsManifest() {

  EventsHelper.runInterval(() => SuggestionsHelper.checkSuggestionsPassed(), baseTickDur * 4);
  EventsHelper.runInterval(() => {
    ChannelsHelper._postToFeed('Should update about messages with new statistics!');
  }, baseTickDur * 5);

  EventsHelper.runInterval(() => CratedropMinigame.run(), baseTickDur);


  EventsHelper.chanceRunInterval(() => SacrificeHelper.random(), 20, baseTickDur * 2.5);
  
  
  EventsHelper.chanceRunInterval(() => PointsHelper.updateCurrentWinner(), 100, baseTickDur * 2);
  // TODO: Update and create most items role
  EventsHelper.chanceRunInterval(() => EggHuntMinigame.run(), 80, baseTickDur / 2);
  EventsHelper.chanceRunInterval(() => MiningMinigame.run(), 80, baseTickDur * 2);
  


  // Miscellaneous features.
  EventsHelper.chanceRunInterval(() => {
    feedSay('Ruuuuuu' + 'u'.repeat(STATE.CHANCE.natural({ min: 1, max: 20 })));
  }, 2.5, baseTickDur * 5);

  EventsHelper.chanceRunInterval(() => { feedSay('._.') }, 7, baseTickDur * 3.5);
}