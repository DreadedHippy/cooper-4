export default class SacrificeHelper {
   
    static async onReaction(reaction, user) {
        const emoji = reaction.emoji.name;
        const isVoteEmoji = EMOJIS.VOTE_AGAINST === emoji;
        const channelID = reaction.message.channel.id;

        if (user.bot) return false;
        if (!isVoteEmoji) return false;
        if (channelID !== CHANNELS.SACRIFICE.id) return false;

        // Process the vote
        this.processVote(reaction, user);
    }

    static async processVote(reaction, user) {
        const guild = ServerHelper.getByCode(STATE.CLIENT, 'PROD');
        let againstVotes = 0;

        // const targetUser = reaction.message.author;
        console.log(reaction.message.mentions);

        try {

                
        } catch(e) {
            console.error(e);
        }
    }
}