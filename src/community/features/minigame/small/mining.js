import ChannelsHelper from "../../../../bot/core/entities/channels/channelsHelper";
import EMOJIS from "../../../../bot/core/config/emojis.json";
import STATE from "../../../../bot/state";

import MessagesHelper from "../../../../bot/core/entities/messages/messagesHelper";
import UsersHelper from "../../../../bot/core/entities/users/usersHelper";


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

    static async chip(reaction, user) {
        reaction.message.say('This is a mining minigame message you reacted to!');

        // Reward is based on number of rocks left in message,
        // More rocks, greater reward

        // Rocks reduced every time hit

        // Chance of pickaxe breaking

        // TODO: Bomb skips a few places at random
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