import ChannelsHelper from "../../../../bot/core/entities/channels/channelsHelper";
import EMOJIS from "../../../../bot/core/config/emojis.json";
import STATE from "../../../../bot/state";


export default class MiningMinigame {
    
    // Reaction interceptor to check if user is attempting to interact.
    static async onReaction(reaction, user) {
        const isPickaxe = reaction.emoji.name === '⛏️';
        // const isMiningMessage =
        if (isPickaxe) {
            const jokeTempMsg = await reaction.message.say('Do you min-?');
            setTimeout(() => { jokeTempMsg.delete(); }, 5000);
        }
        // A rock rolled away.

        // Reward is based on number of rocks left in message,
        // More rocks, greater reward

        // Rocks reduced every time hit

        // Chance of pickaxe breaking

        // TODO: Bomb skips a few places at random
    }

    static async run() {
        const magnitude = STATE.CHANCE.natural({ min: 1, max: 30 });
        const rockString = EMOJIS.ROCK.repeat(magnitude);
        const rockMsg = await ChannelsHelper._randomText().send(rockString);

        setTimeout(() => { rockMsg.react('⛏️'); }, 666);
    }
}