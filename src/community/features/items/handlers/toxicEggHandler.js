import ChannelsHelper from "../../../../bot/core/entities/channels/channelsHelper";
import STATE from "../../../../bot/state";
import PointsHelper from "../../points/pointsHelper";
import ItemsHelper from "../itemsHelper";

export default class ToxigEggHandler {

    static async onReaction(reaction, user) {
        if (reaction.emoji.name === 'toxic_egg') {
            try {
                const didUse = await ItemsHelper.use(user.id, 'TOXIC_EGG', 1);
                if (!didUse) {
                    setTimeout(async () => {
                        const unableMsg = await reaction.message.say(
                            `${user.username} tried to use a toxic egg, but has none.`
                        );
                        setTimeout(() => { unableMsg.delete(); }, 10000);
                    }, 666);
                    return await reaction.users.remove(user.id);
                } else {
                    const backFired = STATE.CHANCE.bool({ likelihood: 25 });
                    const author = reaction.message.author;
                    const targetID = backFired ? author.id : user.id;

                    // Toxic bomb damage definition.
                    const damage = -3

                    // Apply the damage to the target's points.
                    const updatedPoints = await PointsHelper.addPointsByID(targetID, damage);

                    // Add visuals animation
                    setTimeout(() => { 
                        reaction.remove(); 
                        setTimeout(() => { reaction.message.react('☢️'); }, 666);
                    }, 333);

                    const damageInfoText = ` -${damage} points (${updatedPoints})`;
                    let actionInfoText = `${user.username} used a toxic egg on ${author.username}`;
                    if (backFired) actionInfoText = `${user.username} tried to use a toxic egg on ${author.username}, but it backfired`;
                    await ChannelsHelper._postToFeed(`${actionInfoText}: ${damageInfoText}.`);
                }
            } catch(e) {
                console.error(e);
            }
        }   
    }
   
}