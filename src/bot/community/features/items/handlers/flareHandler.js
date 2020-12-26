import ChannelsHelper from "../../../../core/entities/channels/channelsHelper";
import MessagesHelper from "../../../../core/entities/messages/messagesHelper";
import STATE from "../../../../state";
import CratedropMinigame from "../../minigame/small/cratedrop";
import ItemsHelper from "../itemsHelper";

export default class FlareHandler {

    static async use(commandMsg, user) {
        // Attempt to use the laxative item
        const didUseFlare = await ItemsHelper.use(user.id, 'FLARE', 1);

        // Respond to usage result.
        if (didUseFlare) {
            if (STATE.CHANCE.bool({ likelihood: 25 })) setTimeout(() => CratedropMinigame.drop(), 333);

            const feedbackText = `${user.username} used a FLARE and potentially triggered crate drop!`;
            if (!ChannelsHelper.checkIsByCode(commandMsg.channel.id, 'FEED')) {
                const feedbackMsg = await commandMsg.say(feedbackText);
                MessagesHelper.delayReact(feedbackMsg, '🪓', 1333);
                MessagesHelper.delayDelete(feedbackMsg, 10000);
            }
            setTimeout(() => ChannelsHelper._postToFeed(feedbackText), 666);
        }
        else {
            const unableMsg = await commandMsg.say('Unable to use FLARE, you own none. :/');
            MessagesHelper.delayReact(unableMsg, '🪓', 1333);
            MessagesHelper.delayDelete(unableMsg, 10000);
        }
    }
   
}