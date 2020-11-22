import ChannelsHelper from "../../../../bot/core/entities/channels/channelsHelper";
import EggHuntMinigame from "../../minigame/small/egghunt";
import ItemsHelper from "../itemsHelper";

export default class LaxativeHandler {

    static async use(commandMsg, user) {
        commandMsg.reply('You are trying to use an item. Give suggestions, please.');

        // Attempt to use the laxative item
        const didUseLax = await ItemsHelper.use(user.id, 'LAXATIVE', 1);

        // Respond to usage result.
        if (didUseLax) {
            // Run the egghunt dropper (20% or so chance of doing something).
            EggHuntMinigame.run();

            const feedbackText = `${user.username} used laxative and potentially triggered egg drops!`;
            const feedbackMsg = await commandMsg.say(feedbackText);
            setTimeout(() => { feedbackMsg.react('🍫'); }, 1333);
            setTimeout(() => { feedbackMsg.delete(); }, 10000);

            setTimeout(() => { ChannelsHelper._postToFeed(feedbackText); }, 666);
        }
        else {
            // Wtf does this even mean?!?!?!?!?
            console.log('!didUseLax');
        }
    }
   
}