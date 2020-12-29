import ChannelsHelper from "../../../core/entities/channels/channelsHelper";

export default class StatisticsHelper {

    static async update() {
        ChannelsHelper._postToFeed('Should update about messages with new statistics!');
    }

}