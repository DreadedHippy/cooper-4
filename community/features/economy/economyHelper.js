import ItemTotalCommand from "../../../commands/economy/itemTotal";
import ChannelsHelper from "../../../core/entities/channels/channelsHelper";
import STATE from "../../../state";
import ItemsHelper from "../items/itemsHelper";

export default class EconomyHelper {

    static async circulation() {
        const items = ItemsHelper.getUsableItems();
        const itemCode = STATE.CHANCE.pickone(items);
        const stat = await ItemTotalCommand.getStat(itemCode);

        await ChannelsHelper._postToChannelCode('ACTIONS', stat);
    }

}