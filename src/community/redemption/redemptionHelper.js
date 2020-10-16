import EMOJIS from '../../bot/core/config/emojis.json';
import CHANNELS from '../../bot/core/config/channels.json';
import ROLES from '../../bot/core/config/roles.json';

import ChannelsHelper from "../../bot/core/entities/channels/channelsHelper";
import VotingHelper from "../events/voting/votingHelper";
import UsersHelper from "../../bot/core/entities/users/usersHelper";

export default class RedemptionHelper {

    static async onReaction(reaction, user) {
        const emoji = reaction.emoji.name;
        const isVoteEmoji = [EMOJIS.VOTE_FOR, EMOJIS.VOTE_AGAINST].indexOf(emoji) > -1;
        const channelID = reaction.message.channel.id;

        if (user.bot) return false;
        if (!isVoteEmoji) return false;
        if (channelID !== CHANNELS.INTRO.id) return false;

        // Process the vote
        this.processVote(reaction, user);
    }

    static async notify(guild, message) {
        return ChannelsHelper.sendByCodes(guild, ['ENTRY', 'FEED'], message);
    }

    static async processVote(reaction, user) {
        const guild = reaction.message.guild;
        const voterMember = UsersHelper.getMemberByID(guild, user.id);
        const targetUser = reaction.message.author;
        const targetMember = UsersHelper.getMemberByID(guild, targetUser.id);

        // TODO: Check if user still here (may have left or become member).
        // https://github.com/lmf-git/cooper/blob/d1fa1b52a3172099a0e4ce59807715782301c79f/src/community/redemption/redemptionHelper.js

        let forVotes = 0;
        let againstVotes = 0;

        // Calculate the number of required votes for the redemption poll.
        const reqForVotes = VotingHelper.getNumRequired(guild, .05);
        const reqAgainstVotes = VotingHelper.getNumRequired(guild, .025);

        // Remove invalid reactions
        if (!UsersHelper.hasRoleID(voterMember, ROLES.MEMBER.id)) 
            await reaction.remove(user.id);

        // Get existing reactions on message.
        reaction.message.reactions.cache.map(reactionType => {
            if (reactionType.emoji.name === EMOJIS.VOTE_FOR) forVotes = reactionType.count - 1;
            if (reactionType.emoji.name === EMOJIS.VOTE_AGAINST) againstVotes = reactionType.count - 1;
        });


        let updated = false;
        const votingStatusTitle = `${targetUser.username}'s entry was voted upon, current votes:`;
        const votingStatusText = votingStatusTitle +
        `\n\n${EMOJIS.VOTE_FOR.repeat(forVotes)}` +
        `\n\n${EMOJIS.VOTE_AGAINST.repeat(againstVotes)}` +
        `\n\n\nStill required:` +
        `\nFor Entry ${EMOJIS.VOTE_FOR}: ${Math.max(0, reqForVotes - forVotes)}` +
        `\nFor Removal ${EMOJIS.VOTE_AGAINST}: ${Math.max(0, reqAgainstVotes - againstVotes)}`;

        // Check if last messages in ENTRY/FEED were this type, if so update.
        [ChannelsHelper.getByCode(guild, 'ENTRY'), ChannelsHelper.getByCode(guild, 'FEED')]
            .forEach(async (channel) => {
                // Check if a latest message in this channel is an instance of voting for this user.
                (await channel.messages.fetch({ limit: 5 })).map(latestMsg => {
                    if (latestMsg.content.indexOf(votingStatusTitle) > -1) {
                        updated = true;
                        latestMsg.edit(votingStatusText);
                    }
                });
            });
        
        // Give 5 seconds for edits to take place, this message may be unnecessary.
        setTimeout(() => {
            if (!updated) this.notify(guild, votingStatusText);
        }, 5000);

        // Handle user approved.
        if (forVotes >= reqForVotes) {
            targetMember.send('Test?');
            await this.notify(guild, 
                `${targetUser.username} approved!`
            );
        
        // Handle user rejected.
        } else if (againstVotes >= reqAgainstVotes) {
            targetMember.send('Test???');
            await this.notify(guild, 
                `${targetUser.username} rejected!`
            );
        }
    }

}