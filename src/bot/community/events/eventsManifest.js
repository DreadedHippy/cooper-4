import ChannelHelper from "../../core/entities/channels/channelsHelper";

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
import ElectionHelper from "../features/hierarchy/election/electionHelper";
import UsersHelper from "../../core/entities/users/usersHelper";
import ServerHelper from "../../core/entities/server/serverHelper";
import InstantFurnaceMinigame from "../features/minigame/small/instantfurnace";


export const baseTickDur = 60 * 25 * 1000;

export default function eventsManifest() {

  // Server related house keeping items.
  EventsHelper.runInterval(() => StatisticsHelper.update(), baseTickDur * 5);

  // Clean up user data, may have missed detection on a leave/kick/ban.
  EventsHelper.runInterval(() => UsersHelper.cleanupUsers(), baseTickDur * 5);

  // Clean up temporary messages around every 3.33 minutes.
  EventsHelper.runInterval(() => ServerHelper.cleanupTempMessages(), baseTickDur / 7.5);

  // New day events/calendar events.
  EventsHelper.runInterval(() => Chicken.checkIfNewDay(), baseTickDur / 2);


  // Check progess is left within new day due to significance, but add another runner.
  EventsHelper.runInterval(() => ElectionHelper.shouldTriggerStart(), baseTickDur * 4);

  // TODO: Ensure leadership and commander based on items so they are treated seriously.
  EventsHelper.runInterval(() => ElectionHelper.ensureItemSeriousness(), baseTickDur * 6);
  
  // Above is unfinished
  EventsHelper.runInterval(() => SuggestionsHelper.check(), baseTickDur * 4);
  EventsHelper.runInterval(() => MessageNotifications.post(), baseTickDur * 2);
  EventsHelper.runInterval(() => EconomyNotifications.post(), baseTickDur * 1.75);
  EventsHelper.runInterval(() => SacrificeHelper.random(), baseTickDur * 12);

  // Update trades channel message
  EventsHelper.runInterval(() => TradingHelper.updateChannel(), baseTickDur * 2);
  EventsHelper.runInterval(() => TradingHelper.updateChannel(), baseTickDur * 6);

  // TODO: Incomplete.
  EventsHelper.chanceRunInterval(() => EconomyHelper.circulation(), 45, baseTickDur * 4);

  // Minigame related items.
  
  // TODO: Needs a lot more effort.
  EventsHelper.runInterval(() => CooperMorality.evaluate(), baseTickDur * 4.5);

  EventsHelper.runInterval(() => PointsHelper.updateCurrentWinner(), baseTickDur * 3);
  EventsHelper.chanceRunInterval(() => WoodcuttingMinigame.run(), 55, baseTickDur * 5);
  EventsHelper.chanceRunInterval(() => MiningMinigame.run(), 45, baseTickDur * 6);
  EventsHelper.runInterval(() => CratedropMinigame.run(), baseTickDur * 5);
  EventsHelper.chanceRunInterval(() => EggHuntMinigame.run(), 2.5, baseTickDur / 10);

  EventsHelper.chanceRunInterval(() => InstantFurnaceMinigame.run(), 65, baseTickDur * 7.5);

  // TODO: Update and create most items role
 
  // Processes announcements and election events.
  EventsHelper.runInterval(() => ElectionHelper.checkProgress(), baseTickDur * 4);

  // TODO: Add a !bang very, very, rarely.



  // Miscellaneous features.
  EventsHelper.chanceRunInterval(() => {
    ChannelHelper._postToFeed('Ruuuuuu' + 'u'.repeat(STATE.CHANCE.natural({ min: 1, max: 20 })));
  }, 2.5, baseTickDur * 5);

  EventsHelper.chanceRunInterval(() => { ChannelHelper._postToFeed('._.') }, 7, baseTickDur * 3.5);
}
