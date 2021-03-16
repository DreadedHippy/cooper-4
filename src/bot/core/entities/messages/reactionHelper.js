export default class ReactionHelper {

    static didUserReactWith(msg, userID, emoji) {
        let didReactWith = false;

        // Check reactions for user with that reaction.
        reactions.cache.map(react => {
            if (react.emoji.name === emoji && react.users.cache.has(userID)) 
                didReactWith = true;
        });

        return didReactWith
    }

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