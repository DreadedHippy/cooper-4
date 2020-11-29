import ChannelsHelper from "../../../../bot/core/entities/channels/channelsHelper";
import EMOJIS from "../../../../bot/core/config/emojis.json";
import STATE from "../../../../bot/state";

import MessagesHelper from "../../../../bot/core/entities/messages/messagesHelper";
import UsersHelper from "../../../../bot/core/entities/users/usersHelper";
import ItemsHelper from "../../items/itemsHelper";


export default class MiningMinigame {
    
    // Reaction interceptor to check if user is attempting to interact.
    static async onReaction(reaction, user) {
        const isOnlyEmojis = MessagesHelper.isOnlyEmojis(reaction.message.content);
        const isPickaxeReact = reaction.emoji.name === '⛏️';
        const isCooperMsg = UsersHelper.isCooperMsg(reaction.message);
        const isUserReact = !UsersHelper.isCooper(user.id);
        
        const msgContent = reaction.message.content;
        const firstEmojiString = (msgContent[0] || '') + (msgContent[1] || '');
        const firstEmojiUni = MessagesHelper.emojiToUni(firstEmojiString);
        const rockEmojiUni = MessagesHelper.emojiToUni(EMOJIS.ROCK);
        const isRocksMsg = firstEmojiUni === rockEmojiUni;

        // Mining minigame guards.
        if (!isUserReact) return false;
        if (!isCooperMsg) return false;
        if (!isPickaxeReact) return false;
        if (!isOnlyEmojis) return false;
        if (!isRocksMsg) return false;

        this.chip(reaction, user);
    }

    // TODO: Bomb skips a few places at random
    static async chip(reaction, user) {
        const msg = reaction.message;

        // Calculate magnitude from message: more rocks, greater reward.
        const textMagnitude = Math.floor(msg.content.length / 2);
        const rewardRemaining = STATE.CHANCE.natural({ min: 1, max: textMagnitude * 3 });

        // Check if has a pickaxe
        const userPickaxesNum = (await ItemsHelper.getUserItem(user.id, 'PICK_AXE')).quantity || 0;
        if (userPickaxesNum <= 0) {
            const warningMsg = await msg.say(`${user.username} tried to mine the rocks, but doesn't have a pickaxe.`);
            return setTimeout(() => { warningMsg.delete(); }, 10000);
        }

        // Handle chance of pickaxe breaking
        const pickaxeBreakPerc = Math.min(45, rewardRemaining);
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
            const addMetalOre = await ItemsHelper.add(user.id, 'METAL_ORE', rewardRemaining);
            // console.log('addMetalOre', addMetalOre);

            // Reduce the number of rocks in the message.
            await msg.edit(EMOJIS.ROCK.repeat(textMagnitude - 1));
            
            ChannelsHelper._propogate(
                msg, 
                `${user.username} successfully mined a rock. +1 point, +${rewardRemaining} metal ore!`
            );
        }
    }

    static async run() {
        const magnitude = STATE.CHANCE.natural({ min: 1, max: 30 });
        const rockMsg = await ChannelsHelper._randomText().send(EMOJIS.ROCK.repeat(magnitude));
        setTimeout(() => { rockMsg.react('⛏️'); }, 666);

        setTimeout(() => { 
            ChannelsHelper._postToFeed('Hungry? Something to pick at appears!'); 
        }, 1222);
    }
}