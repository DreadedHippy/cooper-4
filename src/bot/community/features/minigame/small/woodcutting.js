import ChannelsHelper from "../../../../core/entities/channels/channelsHelper";
import EMOJIS from "../../../../core/config/emojis.json";
import STATE from "../../../../state";

import MessagesHelper from "../../../../core/entities/messages/messagesHelper";
import UsersHelper from "../../../../core/entities/users/usersHelper";
import ItemsHelper from "../../items/itemsHelper";
import PointsHelper from "../../points/pointsHelper";
import EconomyNotifications from "../economyNotifications";
import ServerHelper from "../../../../core/entities/server/serverHelper";


export default class WoodcuttingMinigame {
    
    // Reaction interceptor to check if user is attempting to interact.
    static async onReaction(reaction, user) {
        // High chance of preventing any mining at all to deal with rate limiting.
        if (STATE.CHANCE.bool({ likelihood: 55 })) return false;

        const isOnlyEmojis = MessagesHelper.isOnlyEmojisOrIDs(reaction.message.content);
        const isAxeReact = reaction.emoji.name === '🪓';
        const isCooperMsg = UsersHelper.isCooperMsg(reaction.message);
        const isUserReact = !UsersHelper.isCooper(user.id);
        
        // Mining minigame guards.
        if (!isUserReact) return false;
        if (!isCooperMsg) return false;
        if (!isAxeReact) return false;
        if (!isOnlyEmojis) return false;

        const msgContent = reaction.message.content;

        const firstEmojiString = (msgContent[0] || '') + (msgContent[1] || '');
        const firstEmojiUni = MessagesHelper.emojiToUni(firstEmojiString);
        const rockEmojiUni = MessagesHelper.emojiToUni(EMOJIS.WOOD);
        const isWoodMsg = firstEmojiUni === rockEmojiUni;

        if (!isWoodMsg) return false;

        this.chip(reaction, user);
    }

    static async chip(reaction, user) {
        const msg = reaction.message;

        // Calculate magnitude from message: more rocks, greater reward.
        const textMagnitude = MessagesHelper.countAllEmojiCodes(msg.content);
        const rewardRemaining = STATE.CHANCE.natural({ min: 1, max: textMagnitude });

        // Check if has a axe
        const userAxesNum = await ItemsHelper.getUserItemQty(user.id, 'AXE');
        const noText = `${user.username} tried to cut wood, but doesn't have an axe.`;
        // Remove reaction and warn.
        // if (userAxesNum <= 0) DELETE REACTION
        if (userAxesNum <= 0) return MessagesHelper.selfDestruct(msg, noText, 10000);

        // Handle chance of axe breaking
        const axeBreakPerc = Math.min(30, rewardRemaining);
        const extractedOreNum = Math.ceil(rewardRemaining / 2.25);
        const didBreak = STATE.CHANCE.bool({ likelihood: axeBreakPerc });
        if (didBreak) {
            const axeUpdate = await ItemsHelper.use(user.id, 'AXE', 1);
            if (axeUpdate) {
                const brokenDamage = -2;
                const pointsDamageResult = await PointsHelper.addPointsByID(user.id, brokenDamage);
    
                EconomyNotifications.add('MINING', {
                    playerID: user.id,
                    username: user.username,
                    brokenAxes: 1,
                    pointGain: brokenDamage
                });

                const actionText = `${user.username} broke an axe trying to cut wood, ${userAxesNum - 1} remaining!`;
                const damageText = `${brokenDamage} points (${pointsDamageResult}).`;
                ChannelsHelper.propagate(msg, `${actionText} ${damageText}`, 'ACTIONS');
            }
        } else {
            // See if updating the item returns the item and quantity.
            const addedWood = await ItemsHelper.add(user.id, 'WOOD', extractedOreNum);
            const addPoints = await PointsHelper.addPointsByID(user.id, 1);

            // TODO: Implement something rare from cutting wood
            // if (STATE.CHANCE.bool({ likelihood: 3.33 })) {
            //     const addDiamond = await ItemsHelper.add(user.id, 'DIAMOND', 1);
            //     ChannelsHelper.propagate(msg, `${user.username} found a diamond whilst mining! (${addDiamond})`, 'ACTIONS');
            // }
            
            // if (STATE.CHANCE.bool({ likelihood: 0.25 })) {
            //     const diamondVeinQty = STATE.CHANCE.natural({ min: 5, max: 25 });
            //     await ItemsHelper.add(user.id, 'DIAMOND', diamondVeinQty);
            //     ChannelsHelper.propagate(msg, `${user.username} hit a major diamond vein, ${diamondVeinQty} found!`, 'ACTIONS');
            // }

            // Reduce the number of rocks in the message.
            if (textMagnitude > 1) await msg.edit(EMOJIS.WOOD.repeat(textMagnitude - 1));
            else await msg.delete();
            
            // Provide feedback.
            const actionText = `${user.username} successfully chopped wood.`;
            const rewardText = `+1 point (${addPoints}), +${extractedOreNum} wood (${addedWood})!`;
            ChannelsHelper.propagate(msg, `${actionText} ${rewardText}`, 'ACTIONS');

            EconomyNotifications.add('WOODCUTTING', {
                pointGain: 1,
                recWood: extractedOreNum,
                playerID: user.id,
                username: user.username
            });
        }
    }

    static async run() {
        const magnitude = STATE.CHANCE.natural({ min: 1, max: 10 });
        const woodMsg = await ChannelsHelper._randomText().send(EMOJIS.WOOD.repeat(magnitude));

        // TODO: Count as ungathered wood in activity messages.
        ServerHelper.addTempMessage(woodMsg, 30 * 60);

        MessagesHelper.delayReact(woodMsg, '🪓', 666);

        const branchText = magnitude > 1 ? `${magnitude} branches` : `a branch`;
        const woodcuttingEventText = `${'Ooo'.repeat(Math.floor(magnitude / 2))} a tree with ${branchText} to fell!`
        ChannelsHelper._postToChannelCode('ACTIONS', woodcuttingEventText, 1222);
    }
}