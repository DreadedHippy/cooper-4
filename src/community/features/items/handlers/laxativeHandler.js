import ChannelsHelper from "../../../../bot/core/entities/channels/channelsHelper";
import PointsHelper from "../../points/pointsHelper";
import ItemsHelper from "../itemsHelper";

export default class LaxativeHandler {

    static async use(commandMsg, user) {
        commandMsg.reply('You are trying to use an item. Give suggestions, please.');
    }
   
}