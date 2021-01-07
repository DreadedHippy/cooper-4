import _channel from "../../core/entities/channels/channelsHelper";

import SacrificeHelper from "../features/events/sacrificeHelper";
import PointsHelper from "../features/points/pointsHelper";
import SuggestionsHelper from "../features/suggestions/suggestionsHelper";
import EventsHelper from "../features/events/eventsHelper";
import StatisticsHelper from "../features/server/statisticsHelper";

import MessageNotifications from "./message/messageNotifications";
import EconomyNotifications from "../features/minigame/economyNotifications";

import STATE from "../../state";

import CratedropMinigame from "../features/minigame/small/cratedrop";
import EggHuntMinigame from "../features/minigame/small/egghunt";
import MiningMinigame from "../features/minigame/small/mining";
import WoodcuttingMinigame from "../features/minigame/small/woodcutting";
import Chicken from "../chicken";
import CooperMorality from "../features/minigame/small/cooperMorality";
import TradingHelper from "../features/items/tradingHelper";
import EconomyHelper from "../features/economy/economyHelper";


export const baseTickDur = 60 * 25 * 1000;

export default function eventsManifest() {

  // Server related house keeping items.
  EventsHelper.runInterval(() => StatisticsHelper.update(), baseTickDur * 5);

  // New day events/calendar events.
  EventsHelper.runInterval(() => Chicken.checkIfNewDay([
    () => _channel._postToFeed('A new day?')
  ]), baseTickDur / 2);
  
  // Above is unfinished
  EventsHelper.runInterval(() => SuggestionsHelper.check(), baseTickDur * 4);
  EventsHelper.runInterval(() => MessageNotifications.post(), baseTickDur / 2);
  EventsHelper.runInterval(() => EconomyNotifications.post(), baseTickDur / 1.5);
  EventsHelper.runInterval(() => SacrificeHelper.random(), baseTickDur * 12);


  // Update trades channel message
  EventsHelper.runInterval(() => TradingHelper.updateChannel(), baseTickDur * 2);
  EventsHelper.runInterval(() => TradingHelper.updateChannel(), baseTickDur * 6);
  EventsHelper.chanceRunInterval(() => EconomyHelper.circulation(), 45, baseTickDur * 5);

  // Minigame related items.
  EventsHelper.runInterval(() => CooperMorality.evaluate(), baseTickDur * 4.5);
  EventsHelper.runInterval(() => PointsHelper.updateCurrentWinner(), baseTickDur * 2);
  EventsHelper.chanceRunInterval(() => WoodcuttingMinigame.run(), 55, baseTickDur * 2.5);
  EventsHelper.chanceRunInterval(() => MiningMinigame.run(), 45, baseTickDur * 2);
  EventsHelper.runInterval(() => CratedropMinigame.run(), baseTickDur);
  EventsHelper.chanceRunInterval(() => EggHuntMinigame.run(), 65, baseTickDur / 1.5);
    // TODO: Update and create most items role
  


  // Miscellaneous features.
  EventsHelper.chanceRunInterval(() => {
    _channel._postToFeed('Ruuuuuu' + 'u'.repeat(STATE.CHANCE.natural({ min: 1, max: 20 })));
  }, 2.5, baseTickDur * 5);

  EventsHelper.chanceRunInterval(() => { _channel._postToFeed('._.') }, 7, baseTickDur * 3.5);
}