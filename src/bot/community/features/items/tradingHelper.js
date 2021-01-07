import ChannelsHelper from "../../../core/entities/channels/channelsHelper";

export default class TradingHelper {

    static async updateChannel() {
        ChannelsHelper._postToChannelCode('TRADE', 'Should update trade message.')
    }

}