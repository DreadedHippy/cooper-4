export default class ReactionHelper {

    static countType(message, type) {
        let count = 0;
        message.reactions.cache.map(reaction => {
            if (reaction.emoji.name === type) count = reaction.count;
        });
        return count;
    }

    static async getReactionType(message, type) {
        
    }

}