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
        // const guild = ServerHelper.getByCode(STATE.CLIENT, 'PROD');

        // Try to access sacrificee from message
        console.log(reaction.message.mentions);

        // const targetUser = reaction.message.author;

        // let sacrificeVotes = 0;
        // let keepVotes = 0;

        // try {
        //     const voterMember = await UsersHelper.fetchMemberByID(guild, user.id);
        //     const targetMember = await UsersHelper.fetchMemberByID(guild, targetUser.id);

        //     // If member left, don't do anything.
        //     if (!targetMember) return false;
            
        //     // If targetMember has "member" role, don't do anything.
        //     if (UsersHelper.hasRoleID(targetMember, ROLES.MEMBER.id)) return false;
            
        //     // Calculate the number of required votes for the redemption poll.
        //     const reqSacrificeVotes = await VotingHelper.getNumRequired(guild, .025);
        //     const reqKeepVotes = await VotingHelper.getNumRequired(guild, .015);

        //     // TODO: Implement if enough keep votes, don't proccess sacrifice.
            
        //     // Get existing reactions on message.
        //     reaction.message.reactions.cache.map(reactionType => {
        //         if (reactionType.emoji.name === EMOJIS.VOTE_AGAINST) sacrificeVotes = Math.max(0, reactionType.count - 1);
        //         if (reactionType.emoji.name === EMOJIS.VOTE_FOR) keepVotes = Math.max(0, reactionType.count - 1);
        //     });
            
        //     // TODO: Add type of vote
        //     const votingStatusTitle = `<@${targetUser.id}>'s sacrifice was voted upon! Remaining Votes:`;

        //     // TODO: When type of vote is identified, only update for that type of vote.
        //     const votingStatusText = votingStatusTitle +
        //         `\nTo Sacrifice: ${EMOJIS.VOTE_FOR}: ${Math.max(0, reqSacrificeVotes - forVotes)} | ` +
        //         `\nTo Protect: ${EMOJIS.VOTE_AGAINST}: ${Math.max(0, reqKeepVotes - againstVotes)}`;
            
            // TODO: Notify when user is protected/kept.

            // TODO: Notify when user is voted out.
                
        } catch(e) {
            console.error(e);
        }
    }
}