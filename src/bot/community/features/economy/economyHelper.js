import ChannelsHelper from "../../../core/entities/channels/channelsHelper";

export default class EconomyHelper {

    static async circulation() {
        ChannelsHelper._postToChannelCode('ACTIONS', 'Should post circulation tip!');
    }

}