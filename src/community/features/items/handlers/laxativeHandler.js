import ChannelsHelper from "../../../../bot/core/entities/channels/channelsHelper";
import EggHuntMinigame from "../../minigame/small/egghunt";
import ItemsHelper from "../itemsHelper";

export default class LaxativeHandler {

    static async use(commandMsg, user) {
        // Attempt to use the laxative item
        const didUseLax = await ItemsHelper.use(user.id, 'LAXATIVE', 1);

        // Respond to usage result.
        if (didUseLax) {
            // Run the egghunt dropper (20% or so chance of doing something).
            setTimeout(() => { EggHuntMinigame.run(); }, 333);

            const feedbackText = `${user.username} used laxative and potentially triggered egg drops!`;

            if (!ChannelsHelper.checkIsByCode(commandMsg.channel.id, 'FEED')) {
                const feedbackMsg = await commandMsg.say(feedbackText);
                setTimeout(() => { feedbackMsg.react('🍫'); }, 1333);
                setTimeout(() => { feedbackMsg.delete(); }, 10000);
            }

            setTimeout(() => { ChannelsHelper._postToFeed(feedbackText); }, 666);
        }
        else {
            const unableMsg = await commandMsg.say('Unable to use LAXATIVE, you own none. :/');
            setTimeout(() => { unableMsg.react('🍫'); }, 1333);
            setTimeout(() => { unableMsg.delete(); }, 10000);
        }
    }
   
}