import ChannelsHelper from "../../../../bot/core/entities/channels/channelsHelper";
import EMOJIS from "../../../../bot/core/config/emojis.json";
import STATE from "../../../../bot/state";

import MessagesHelper from "../../../../bot/core/entities/messages/messagesHelper";
import UsersHelper from "../../../../bot/core/entities/users/usersHelper";
import ItemsHelper from "../../items/itemsHelper";
import PointsHelper from "../../points/pointsHelper";


export default class MiningMinigame {
    
    // Reaction interceptor to check if user is attempting to interact.
    static async onReaction(reaction, user) {
        // High chance of preventing any mining at all.
        if (STATE.CHANCE.bool({ likelihood: 65 })) return false;

        const isOnlyEmojis = MessagesHelper.isOnlyEmojis(reaction.message.content);
        const isPickaxeReact = reaction.emoji.name === '⛏️';
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
        const rockEmojiUni = MessagesHelper.emojiToUni(EMOJIS.ROCK);
        const isRocksMsg = firstEmojiUni === rockEmojiUni;

        if (!isRocksMsg) return false;

        this.chip(reaction, user);
    }

    // TODO: Bomb skips a few places at random
    static async chip(reaction, user) {
        const msg = reaction.message;

        // Calculate magnitude from message: more rocks, greater reward.
        const textMagnitude = Math.floor(msg.content.length / 2);
        const rewardRemaining = STATE.CHANCE.natural({ min: 1, max: textMagnitude });

        // Check if has a pickaxe
        const userPickaxesNum = await ItemsHelper.getUserItemQty(user.id, 'PICK_AXE');
        if (userPickaxesNum <= 0) {
            const warningMsg = await msg.say(`${user.username} tried to mine the rocks, but doesn't have a pickaxe.`);
            return MessagesHelper.delayDelete(warningMsg, 10000);
        }

        // Handle chance of pickaxe breaking
        const pickaxeBreakPerc = Math.min(30, rewardRemaining);
        const extractedOreNum = Math.ceil(rewardRemaining / 3);
        const didBreak = STATE.CHANCE.bool({ likelihood: pickaxeBreakPerc });
        if (didBreak) {
            const pickaxeUpdate = await ItemsHelper.use(user.id, 'PICK_AXE', 1);
            // console.log(pickaxeUpdate);
            ChannelsHelper._propogate(
                msg,
                `${user.username} broke a pickaxe trying to mine.`
            );
        } else {
            // See if updating the item returns the item and quantity.
            const addMetalOre = await ItemsHelper.add(user.id, 'METAL_ORE', extractedOreNum);
            const addPoints = await PointsHelper.addPointsByID(user.id, 1);
            // console.log(addPoints, addMetalOre);

            // Reduce the number of rocks in the message.
            if (textMagnitude > 1) await msg.edit(EMOJIS.ROCK.repeat(textMagnitude - 1));
            else await msg.delete();
            
            ChannelsHelper._propogate(
                msg, 
                `${user.username} successfully mined a rock. +1 point, +${extractedOreNum} metal ore!`
            );
        }
    }

    static async run() {
        const magnitude = STATE.CHANCE.natural({ min: 1, max: 30 });
        const rockMsg = await ChannelsHelper._randomText().send(EMOJIS.ROCK.repeat(magnitude));

        MessagesHelper.delayReact(rockMsg, '⛏️');

        ChannelsHelper._postToFeed('Hungry? Something to pick at appears!', 1222);
    }
}