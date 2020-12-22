import ChannelsHelper from "../../../core/entities/channels/channelsHelper";
import EMOJIS from "../../../core/config/emojis.json"

export default class SuggestionsHelper {

    static async onReaction(reaction, user) {
        console.log('Suggestion reaction');
    }

    static async check() {
        // Get last 25 suggestions to check through.
        const candidates = await ChannelsHelper._getCode('SUGGESTIONS').messages.fetch({ limit: 25 });

        candidates.map((suggestion, index) => {
            console.log(suggestion.createdTimestamp);

            console.log(suggestion);
            
            const votes = this.parseVotes(suggestion);
            console.log(votes);

            if (votes.rejected) {
                // Add to talk and feed
            }

            if (votes.passed) {
                // Add to roadmap
            }

            if (votes.invalid) {
                // Remove and message the text to the user.
            }

            // If the message is removed
            // setTimeout(() => {
                // console.log(suggestion.mentions.first());
            // }, 5000 * index);
        });

        // If any have passed WITHOUT check mark... notify that they succeeded

        // Check at least 24 hours have passed.
    }

    static parseVotes(msg) {
        const votes = {
            for: 0,
            against: 0,
            passed: false,
            rejected: false,
            invalid: false
        };

        msg.reactions.cache.map(reaction => {
            // Check if votes are by coopah.

            console.log(reaction);

            if (reaction.emoji.name === EMOJIS.POLL_FOR) votes.for = reaction.count;
            if (reaction.emoji.name === EMOJIS.POLL_AGAINST) votes.against = reaction.count;
        });

        return votes;
    }

    static async pass() {
        // Reward the person who posted the suggestion for contributing to the community
    }

    static async reject() {
        // 
    }

    // static async processVote(reaction, user) {
    //     const guild = ServerHelper.getByCode(STATE.CLIENT, 'PROD');

    //     const targetUser = reaction.message.author;

    //     let forVotes = 0;
    //     let againstVotes = 0;

    //     try {
    //         const voterMember = await UsersHelper.fetchMemberByID(guild, user.id);
    //         const targetMember = await UsersHelper.fetchMemberByID(guild, targetUser.id);

    //         // If member left, don't do anything.
    //         if (!targetMember) return false;
            
    //         // If targetMember has "member" role, don't do anything.
    //         if (UsersHelper.hasRoleID(targetMember, ROLES.MEMBER.id)) return false;
            
    //         // Calculate the number of required votes for the redemption poll.
    //         const reqForVotes = VotingHelper.getNumRequired(guild, .025);
    //         const reqAgainstVotes = VotingHelper.getNumRequired(guild, .015);
            
    //         // Remove invalid reactions.
    //         if (!UsersHelper.hasRoleID(voterMember, ROLES.MEMBER.id)) {
    //             return await reaction.users.remove(user.id)
    //         }
            
    //         // Get existing reactions on message.
    //         reaction.message.reactions.cache.map(reactionType => {
    //             if (reactionType.emoji.name === EMOJIS.VOTE_FOR) forVotes = Math.max(0, reactionType.count - 1);
    //             if (reactionType.emoji.name === EMOJIS.VOTE_AGAINST) againstVotes = Math.max(0, reactionType.count - 1);
    //         });
            
    //         const votingStatusTitle = `<@${targetUser.id}>'s entry was voted upon!`;
    //         const votingStatusText = votingStatusTitle +
    //             `\nStill required: ` +
    //             `Entry ${EMOJIS.VOTE_FOR}: ${Math.max(0, reqForVotes - forVotes)} | ` +
    //             `Removal ${EMOJIS.VOTE_AGAINST}: ${Math.max(0, reqAgainstVotes - againstVotes)}`;
            

            
    //         // Handle user approved.
    //         if (forVotes >= reqForVotes) {
    //             // Give intro roles
    //             const { MEMBER, BEGINNER, SUBSCRIBER } = ROLES;

    //             const introRolesNames = [MEMBER.name, BEGINNER.name, SUBSCRIBER.name];
    //             const introRoles = RolesHelper.getRoles(guild, introRolesNames);
                
    //             // Add to database
    //             await UsersHelper.addToDatabase(targetMember);

    //             await targetMember.roles.add(introRoles);
    //             await targetMember.send('You were voted into The Coop and now have full access!');
    //             await this.notify(guild, 
    //                 `${targetUser.username} approved based on votes!` +
    //                 `${forVotes ? `\n\n${EMOJIS.VOTE_FOR.repeat(forVotes)}` : ''}` +
    //                 `${againstVotes ? `\n\n${EMOJIS.VOTE_AGAINST.repeat(againstVotes)}` : ''}`
    //             );

    //         // Handle user rejected.
    //         } else if (againstVotes >= reqAgainstVotes) {
    //             await this.notify(guild, `${targetUser.username} was removed and banned (voted out)!`);
    //             await targetMember.send('You were voted out of The Coop!');
    //             await targetMember.ban();
    //         } else {
    //             // Notify the relevant channels (throttle based on last entry vote time).
    //             const currentTime = +new Date();
    //             const lastVotetime = STATE.LAST_ENTRY_VOTE_TIME;
    //             const FiveSecondsAgo = currentTime - (5 * 1000);
    //             if (!lastVotetime || lastVotetime < FiveSecondsAgo) {
    //                 STATE.LAST_ENTRY_VOTE_TIME = currentTime;
    //                 await this.notify(guild, votingStatusText);
    //             }
    //         }
                
    //     } catch(e) {
    //         console.error(e);
    //     }
    // }
}