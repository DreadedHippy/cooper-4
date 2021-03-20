import ChannelsHelper from "../../../core/entities/channels/channelsHelper";
import KEY_MESSAGES from "../../../core/config/keymessages.json";
import MessagesHelper from "../../../core/entities/messages/messagesHelper";
import TimeHelper from "../server/timeHelper";

export default class TradingHelper {

    static async updateChannel() {
        // Update message at top of trades :), fuck your sarcastic comments.
        const dateFmt = TimeHelper.secsLongFmt(Date.now() / 1000);
        const editResult = await MessagesHelper.editByLink(KEY_MESSAGES.trade_info, 'Trade Message Updated ' + dateFmt);
        return editResult;
    }

}