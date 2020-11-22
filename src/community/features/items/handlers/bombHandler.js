import ChannelsHelper from "../../../../bot/core/entities/channels/channelsHelper";
import PointsHelper from "../../points/pointsHelper";
import ItemsHelper from "../itemsHelper";

export default class BombHandler {

    static async onReaction(reaction, user) {
        // TODO: Pass the bomb needs to be implemented somehow from here.
        
        if (reaction.emoji.name === '💣') {
            try {
                const didUse = await ItemsHelper.use(user.id, 'BOMB', 1);
                if (!didUse) return await reaction.users.remove(user.id);
                else {
                    const messageAuthor = reaction.message.author;

                    // Let bombs stack and amplify the damage.
                    const damage = -5 * reaction.count;

                    // Apply the damage to the target's points.
                    const updatedPoints = await PointsHelper.addPointsByID(messageAuthor.id, damage);

                    // Add visuals animation
                    setTimeout(() => { reaction.remove(); }, 333);
                    setTimeout(() => { reaction.message.react('💥'); }, 666);
    
                    let doubledInfo = null;
                    if (reaction.count > 1) doubledInfo = `(x${reaction.count})`;
                    await ChannelsHelper._postToFeed(
                        `${user.username} bombed ${messageAuthor.username}: -${damage}${doubledInfo} points (${updatedPoints}).`
                    );
                }
            } catch(e) {
                console.error(e);
            }
        }   
    }
   
}