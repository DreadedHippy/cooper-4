import EMOJIS from '../../../bot/core/config/emojis.json';
import CHANNELS from '../../../bot/core/config/channels.json';
import ChannelsHelper from '../../../bot/core/entities/channels/channelsHelper';

export default class SacrificeHelper {
   
    static async onReaction(reaction, user) {
        const emoji = reaction.emoji.name;
        const isVoteEmoji = EMOJIS.VOTE_AGAINST === emoji;
        const channelID = reaction.message.channel.id;

        if (user.bot) return false;
        if (!isVoteEmoji) return false;
        if (channelID !== CHANNELS.SACRIFICE.id) return false;

        // Process the vote.
        this.processVote(reaction, user);
    }

    static async processVote(reaction, user) {
        const guild = ServerHelper.getByCode(STATE.CLIENT, 'PROD');

        // Try to access sacrificee from message
        try {
            const sacrificeEmbedDesc = reaction.message.embeds[0].description;
            const sacrificeeID = /<@(\d+)>/.exec(sacrificeEmbedDesc)[1];
            const sacrificee = guild.members.cache.get(sacrificeeID);

            console.log(sacrificeeID);
            console.log(sacrificee);

            const sacrificeMember = await UsersHelper.fetchMemberByID(guild, user.id);
            const targetMember = await UsersHelper.fetchMemberByID(guild, sacrificee.id);

            // If member left, don't do anything.
            if (!targetMember) return false;
            
            // Calculate the number of required votes for the redemption poll.
            const reqSacrificeVotes = VotingHelper.getNumRequired(guild, .025);
            const reqKeepVotes = VotingHelper.getNumRequired(guild, .015);
        
            // Get existing reactions on message.
            let sacrificeVotes = 0;
            let keepVotes = 0;
            reaction.message.reactions.cache.map(reactionType => {
                if (reactionType.emoji.name === EMOJIS.VOTE_AGAINST) sacrificeVotes = Math.max(0, reactionType.count - 1);
                if (reactionType.emoji.name === EMOJIS.VOTE_FOR) keepVotes = Math.max(0, reactionType.count - 1);
            });

            // TODO: Implement if enough keep votes, don't proccess sacrifice.
            
            // TODO: Add type of vote
            // TODO: When type of vote is identified, only update for that type of vote.
            const votingStatusTitle = `<@${targetUser.id}>'s sacrifice was voted upon! Remaining Votes:`;
            const votingStatusText = votingStatusTitle +
                `\nTo Sacrifice: ${EMOJIS.VOTE_FOR}: ${Math.max(0, reqSacrificeVotes - forVotes)} | ` +
                `\nTo Protect: ${EMOJIS.VOTE_AGAINST}: ${Math.max(0, reqKeepVotes - againstVotes)}`;

            await ChannelsHelper._postToFeed(votingStatusText);
            
            // TODO: Notify when user is protected/kept.
            // TODO: Notify when user is voted out.
                    
        } catch(e) {
            console.error(e);
        }

    }
}