import ChannelsHelper from "../../core/entities/channels/channelsHelper";
import SacrificeHelper from "../features/events/sacrificeHelper";
import PointsHelper from "../features/points/pointsHelper";
import SuggestionsHelper from "../features/suggestions/suggestionsHelper";
import EventsHelper from "../features/events/eventsHelper";
import StatisticsHelper from "../features/server/statisticsHelper";

import MessageNotifications from "./message/messageNotifications";

import STATE from "../../state";

import CratedropMinigame from "../features/minigame/small/cratedrop";
import EggHuntMinigame from "../features/minigame/small/egghunt";
import MiningMinigame from "../features/minigame/small/mining";
import WoodcuttingMinigame from "../features/minigame/small/woodcutting";



const feedSay = ChannelsHelper._postToFeed;

export const baseTickDur = 60 * 25 * 1000;

export default function eventsManifest() {

  // Server related house keeping items.
  EventsHelper.runInterval(() => StatisticsHelper.update(), baseTickDur * 5);
  // Above is unfinished
  EventsHelper.runInterval(() => SuggestionsHelper.check(), baseTickDur * 4);
  EventsHelper.runInterval(() => MessageNotifications.post(), baseTickDur / 2);
  EventsHelper.runInterval(() => SacrificeHelper.random(), baseTickDur * 12);
  

  // Minigame related items.
  EventsHelper.runInterval(() => CratedropMinigame.run(), baseTickDur);
  EventsHelper.runInterval(() => PointsHelper.updateCurrentWinner(), baseTickDur * 2);
  EventsHelper.chanceRunInterval(() => EggHuntMinigame.run(), 80, baseTickDur / 2);
  EventsHelper.chanceRunInterval(() => MiningMinigame.run(), 80, baseTickDur * 2);
  EventsHelper.chanceRunInterval(() => WoodcuttingMinigame.run(), 80, baseTickDur * 2.5);
    // TODO: Update and create most items role
  


  // Miscellaneous features.
  EventsHelper.chanceRunInterval(() => {
    feedSay('Ruuuuuu' + 'u'.repeat(STATE.CHANCE.natural({ min: 1, max: 20 })));
  }, 2.5, baseTickDur * 5);

  EventsHelper.chanceRunInterval(() => { feedSay('._.') }, 7, baseTickDur * 3.5);
}