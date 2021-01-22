import ChannelsHelper from "../../../core/entities/channels/channelsHelper";
import AboutHelper from "./aboutHelper";

export default class StatisticsHelper {

    static async update() {
        ChannelsHelper._postToFeed('Should update about messages with new statistics!');

        try {
            await AboutHelper.addAboutStats();
        } catch(e) {
            console.error(e);
        }
    }

    static async addItemStats() {
        // parseFloat("123.456").toFixed(2);
        // for each usable item, get circulation, etc
    }

}