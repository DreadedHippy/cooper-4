import ChannelsHelper from "../../../../core/entities/channels/channelsHelper";
import STATE from "../../../../state";
import PointsHelper from "../../points/pointsHelper";
import ItemsHelper from "../itemsHelper";
import { EGG_DATA } from '../../minigame/small/egghunt';

// TODO: Make into "ReactionUsableItem" and add callback

export default class LegendaryEggHandler {

    static async onReaction(reaction, user) {
        if (reaction.emoji.name === 'legendary_egg') {
            try {
                const didUse = await ItemsHelper.use(user.id, 'LEGENDARY_EGG', 1);
                if (!didUse) {
                    setTimeout(async () => {
                        const unableMsg = await reaction.message.say(
                            `${user.username} tried to use a legendary egg, but has none l-`
                        );
                        setTimeout(() => { unableMsg.delete(); }, 10000);
                    }, 666);
                    return await reaction.users.remove(user.id);
                } else {
                    const backFired = STATE.CHANCE.bool({ likelihood: 25 });
                    const author = reaction.message.author;
                    const targetID = backFired ? user.id : author.id;

                    // Toxic bomb damage definition.
                    const damage = EGG_DATA['LEGENDARY_EGG'].points;

                    // Apply the damage to the target's points.
                    const updatedPoints = await PointsHelper.addPointsByID(targetID, damage);

                    // Add visuals animation
                    setTimeout(() => { 
                        reaction.remove(); 
                        setTimeout(() => { reaction.message.react('💜'); }, 666);
                    }, 333);

                    const damageInfoText = ` ${damage} points (${updatedPoints})`;
                    let actionInfoText = `${user.username} used a legendary egg on ${author.username}`;
                    if (backFired) actionInfoText = `${user.username} tried to use a legendary egg on ${author.username}, but it backfired`;

                    const feedbackMsgText = `${actionInfoText}: ${damageInfoText}.`;

                    if (!ChannelsHelper.checkIsByCode(reaction.message.channel.id, 'FEED')) {
                        const feedbackMsg = await reaction.message.say(feedbackMsgText);
                        setTimeout(() => { feedbackMsg.react('💜'); }, 1333);
                        setTimeout(() => { feedbackMsg.delete(); }, 10000);
                    }
                    await ChannelsHelper._postToFeed(feedbackMsgText);
                }
            } catch(e) {
                console.error(e);
            }
        }   
    }
   
}