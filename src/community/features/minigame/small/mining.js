import ChannelsHelper from "../../../../bot/core/entities/channels/channelsHelper";
import EMOJIS from "../../../../bot/core/config/emojis.json";
import Chance from 'chance';

const rand = new Chance;

export default class MiningMinigame {
    
    // Reaction interceptor to check if user is attempting to interact.
    static onReaction(reaction, user) {
        const isPickaxe = reaction.emoji.name === '⛏️';
        // const isMiningMessage =
        if (isPickaxe) {
            reaction.message.say('Do you min-?');
        }
        // A rock rolled away.
    }

    static async run() {
        const magnitude = rand.natural({ min: 1, max: 10 });
        const rockString = EMOJIS.ROCK.repeat(magnitude);
        ChannelsHelper._randomText().send(rockString);
    }
}