import EggHuntMinigame from "../../features/minigame/small/egghunt";
import RedemptionHelper from "../../redemption/redemptionHelper";
import EMOJIS from '../../../bot/core/config/emojis.json';
import CratedropMinigame from "../../features/minigame/small/cratedrop";

export default async function reactAddedHandler(reaction, user) {
    try {
        if (reaction.message.partial) await reaction.message.fetch();
        // if (reaction.channel.partial) await reaction.channel.fetch();
        // if (reaction.guild.partial) await reaction.guild.fetch();
        if (reaction.partial) await reaction.fetch();
    
        // If coop emoji ever added, double down on it... just because.
        if (reaction.emoji.name === 'coop') await reaction.message.react(EMOJIS.COOP);
        if (reaction.emoji.name === '🤦‍♂️') await reaction.message.react('🤦‍♂️');
    
        // Reaction based minigame react processors .
        EggHuntMinigame.onReaction(reaction, user);
        CratedropMinigame.onReaction(reaction, user);
    
        // Check for reaction on intro message
        RedemptionHelper.onReaction(reaction, user);
        
    } catch(e) {
        console.error(e);
    }
}