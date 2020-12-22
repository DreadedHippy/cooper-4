import ChannelsHelper from "../../core/entities/channels/channelsHelper";
import SacrificeHelper from "../features/events/sacrificeHelper";
import PointsHelper from "../features/points/pointsHelper";

import STATE from "../../state";

import CratedropMinigame from "../features/minigame/small/cratedrop";
import EggHuntMinigame from "../features/minigame/small/egghunt";
import SuggestionsHelper from "../features/suggestions/suggestionsHelper";
import MiningMinigame from "../features/minigame/small/mining";
import EventsHelper from "../features/events/eventsHelper";
import MessageNotifications from "./message/messageNotifications";
import StatisticsHelper from "../features/server/statisticsHelper";

const feedSay = ChannelsHelper._postToFeed;

export const baseTickDur = 60 * 25 * 1000;

export default function eventsManifest() {

  // Server related house keeping items.
  EventsHelper.runInterval(() => SuggestionsHelper.check(), baseTickDur * 4);
  EventsHelper.runInterval(() => StatisticsHelper.update(), baseTickDur * 5);
  EventsHelper.runInterval(() => MessageNotifications.post(), baseTickDur / 2);
  EventsHelper.runInterval(() => SacrificeHelper.random(), baseTickDur * 12);
  

  // Minig game related items
  EventsHelper.runInterval(() => CratedropMinigame.run(), baseTickDur);
  EventsHelper.chanceRunInterval(() => PointsHelper.updateCurrentWinner(), 100, baseTickDur * 2);
  EventsHelper.chanceRunInterval(() => EggHuntMinigame.run(), 80, baseTickDur / 2);
  EventsHelper.chanceRunInterval(() => MiningMinigame.run(), 80, baseTickDur * 2);
  // TODO: Update and create most items role
  


  // Miscellaneous features.
  EventsHelper.chanceRunInterval(() => {
    feedSay('Ruuuuuu' + 'u'.repeat(STATE.CHANCE.natural({ min: 1, max: 20 })));
  }, 2.5, baseTickDur * 5);

  EventsHelper.chanceRunInterval(() => { feedSay('._.') }, 7, baseTickDur * 3.5);
}