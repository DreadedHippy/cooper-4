import EggHuntMinigame from "../../features/minigame/small/egghunt";
import RedemptionHelper from "../../redemption/redemptionHelper";
import EMOJIS from '../../../bot/core/config/emojis.json';

export default async function reactAddedHandler(reaction, user) {
    if (reaction.message.partial) await reaction.message.fetch();

    // If coop emoji ever added, double down on it... just because.
    if (reaction.emoji.name === 'coop') await reaction.message.react(EMOJIS.COOP);
    if (reaction.emoji.name === '🤦‍♂️') await reaction.message.react('🤦‍♂️');

    
    EggHuntMinigame.onReaction(reaction, user);

    // Check for reaction on intro message
    RedemptionHelper.onReaction(reaction, user);
}