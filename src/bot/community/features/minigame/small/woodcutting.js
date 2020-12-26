import ChannelsHelper from "../../../../core/entities/channels/channelsHelper";
import EMOJIS from "../../../../core/config/emojis.json";
import STATE from "../../../../state";

import MessagesHelper from "../../../../core/entities/messages/messagesHelper";
import UsersHelper from "../../../../core/entities/users/usersHelper";
import ItemsHelper from "../../items/itemsHelper";
import PointsHelper from "../../points/pointsHelper";


export default class WoodcuttingMinigame {
    
    // Reaction interceptor to check if user is attempting to interact.
    static async onReaction(reaction, user) {
        // High chance of preventing any mining at all to deal with rate limiting.
        if (STATE.CHANCE.bool({ likelihood: 55 })) return false;

        const isOnlyEmojis = MessagesHelper.isOnlyEmojis(reaction.message.content);
        const isPickaxeReact = reaction.emoji.name === EMOJIS.AXE;
        const isCooperMsg = UsersHelper.isCooperMsg(reaction.message);
        const isUserReact = !UsersHelper.isCooper(user.id);
        
        // Mining minigame guards.
        if (!isUserReact) return false;
        if (!isCooperMsg) return false;
        if (!isPickaxeReact) return false;
        if (!isOnlyEmojis) return false;

        const msgContent = reaction.message.content;

        const firstEmojiString = (msgContent[0] || '') + (msgContent[1] || '');
        const firstEmojiUni = MessagesHelper.emojiToUni(firstEmojiString);
        const rockEmojiUni = MessagesHelper.emojiToUni(EMOJIS.AXE);
        const isRocksMsg = firstEmojiUni === rockEmojiUni;

        if (!isRocksMsg) return false;

        this.chip(reaction, user);
    }

    static async chip(reaction, user) {
        const msg = reaction.message;

        // Calculate magnitude from message: more rocks, greater reward.
        const textMagnitude = Math.floor(msg.content.length / 2);
        const rewardRemaining = STATE.CHANCE.natural({ min: 1, max: textMagnitude });

        // Check if has a pickaxe
        const userPickaxesNum = await ItemsHelper.getUserItemQty(user.id, 'AXE');
        const noPickText = `${user.username} tried to cut wood, but doesn't have an axe.`;
        // Remove reaction and warn.
        // if (userPickaxesNum <= 0) DELETE REACTION
        if (userPickaxesNum <= 0) return MessagesHelper.selfDestruct(msg, noPickText, 10000);

        // Handle chance of pickaxe breaking
        const pickaxeBreakPerc = Math.min(30, rewardRemaining);
        const extractedOreNum = Math.ceil(rewardRemaining / 2.25);
        const didBreak = STATE.CHANCE.bool({ likelihood: pickaxeBreakPerc });
        if (didBreak) {
            const pickaxeUpdate = await ItemsHelper.use(user.id, 'AXE', 1);
            if (pickaxeUpdate) {
                const brokenPickDamage = -2;
                const pointsDamageResult = await PointsHelper.addPointsByID(user.id, brokenPickDamage);
    
                const actionText = `${user.username} broke an axe trying to cut wood, ${userPickaxesNum - 1} remaining!`;
                const damageText = `${brokenPickDamage} points (${pointsDamageResult}).`;
                ChannelsHelper._propogate(msg, `${actionText} ${damageText}`);
            }
        } else {
            // See if updating the item returns the item and quantity.
            const addMetalOre = await ItemsHelper.add(user.id, 'WOOD', extractedOreNum);
            const addPoints = await PointsHelper.addPointsByID(user.id, 1);

            // TODO: Implement something rare from cutting wood
            // if (STATE.CHANCE.bool({ likelihood: 3.33 })) {
            //     const addDiamond = await ItemsHelper.add(user.id, 'DIAMOND', 1);
            //     ChannelsHelper._propogate(msg, `${user.username} found a diamond whilst mining! (${addDiamond})`);
            // }
            
            // if (STATE.CHANCE.bool({ likelihood: 0.25 })) {
            //     const diamondVeinQty = STATE.CHANCE.natural({ min: 5, max: 25 });
            //     await ItemsHelper.add(user.id, 'DIAMOND', diamondVeinQty);
            //     ChannelsHelper._propogate(msg, `${user.username} hit a major diamond vein, ${diamondVeinQty} found!`);
            // }

            // Reduce the number of rocks in the message.
            if (textMagnitude > 1) await msg.edit(EMOJIS.WOOD.repeat(textMagnitude - 1));
            else await msg.delete();
            
            // Provide feedback.
            const actionText = `${user.username} successfully chopped wood.`;
            const rewardText = `+1 point (${addPoints}), +${extractedOreNum} wood (${addMetalOre})!`;
            ChannelsHelper._propogate(msg, `${actionText} ${rewardText}`);
        }
    }

    static async run() {
        const magnitude = STATE.CHANCE.natural({ min: 1, max: 10 });
        const rockMsg = await ChannelsHelper._randomText().send(EMOJIS.AXE.repeat(magnitude));

        MessagesHelper.delayReact(rockMsg, EMOJIS.AXE);

        ChannelsHelper._postToFeed(`Ooo a tree to fell! Branches ${magnitude}!`, 1222);
    }
}