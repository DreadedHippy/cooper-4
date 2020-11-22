import EggHuntMinigame from "../../features/minigame/small/egghunt";
import RedemptionHelper from "../../redemption/redemptionHelper";
import EMOJIS from '../../../bot/core/config/emojis.json';
import CratedropMinigame from "../../features/minigame/small/cratedrop";
import SacrificeHelper from "../../features/events/sacrificeHelper";
import STATE from "../../../bot/state";
import ItemsHelper from "../../features/items/itemsHelper";

export default async function reactAddedHandler(reaction, user) {
    const isUser = STATE.CLIENT.user.id !== user.id;

    try {   
        // If coop emoji ever added, double down on it... just because.
        if (reaction.emoji.name === 'coop' && isUser) reaction.message.react(EMOJIS.COOP);
        if (reaction.emoji.name === '🤦‍♂️' && isUser) reaction.message.react('🤦‍♂️');
    
        // Check for usable items being exercised.
        ItemsHelper.onReaction(reaction, user);

        // Reaction based minigame react processors.
        EggHuntMinigame.onReaction(reaction, user);
        CratedropMinigame.onReaction(reaction, user);
    
        // Check for reaction on intro message.
        RedemptionHelper.onReaction(reaction, user);

        // Check for reaction on sacrifice message.
        SacrificeHelper.onReaction(reaction, user);

    } catch(e) {
        console.error(e);
    }
}