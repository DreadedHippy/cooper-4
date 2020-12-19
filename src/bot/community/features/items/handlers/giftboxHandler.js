import ChannelsHelper from "../../../../core/entities/channels/channelsHelper";
import MessagesHelper from "../../../../core/entities/messages/messagesHelper";
import PointsHelper from "../../points/pointsHelper";
import ItemsHelper from "../itemsHelper";

export default class GiftboxHandler {

    static async use(useMSG) {
        useMSG.say('Work in progress, you\'ll be able to give gifts and traps soon!');
    }

    static async onReaction(reaction, user) {
        // Check if it is meant for the collector or if safety period timed out.
    }
   
}