import ROLES from '../../bot/core/config/roles.json';
import EMOJIS from '../../bot/core/config/emojis.json';

import ChannelsHelper from "../../bot/core/entities/channels/channelsHelper";
import MessagesHelper from "../../bot/core/entities/messages/messagesHelper";
import RolesHelper from '../../bot/core/entities/roles/rolesHelper';
import UsersHelper from "../../bot/core/entities/users/usersHelper";
import createEmbed from '../../ui/embed/embedHelper';
import VotingHelper from "../events/voting/votingHelper";


const votingDuration = 10;
const redemptionPollDuration = 60 * votingDuration * 1000;


const buildRedeemEmbedDescText = (reqVotes, dur, username) =>
    `To gain entry, you require ${reqVotes} votes of community members.

    Tips for acquiring votes:
    - Post an intro
    - Pretend you're a good egg
    - Chicken puns
    - ||Bribes||

    Approval Voting (Via Emoji Reactions)
    - Approve -> ${EMOJIS.VOTE_FOR}
    - Reject -> ${EMOJIS.VOTE_AGAINST}

    Unless ${username} is approved within ${dur / 1000} secs, they'll get cooped.`;


const votingCtaMsgText = MessagesHelper.noWhiteSpace`
	Fuynckes! Members, you're needed for a potential redemption! 
	A finite determination of their infinity, 
    may now be further determined by its own negation.`;

const ejectionMsgText = MessagesHelper.noWhiteSpace`
    From our community, you have been rejected. 
    Do not feel disrespected, you will now be ejected.`;

const feedMessageBuilder = (username, link) => 
    MessagesHelper.noWhiteSpace`<${EMOJIS.COOP}> Will you allow ${username} into The Coop? 
    :scroll: Please vote here:\n ${link}`;

const resultMessageBuilder = (userID, results, adjustedReq) => 
    `<@${userID}>, we have decided your fate. Here is the result:` +
    `\n\n ${(EMOJIS.VOTE_FOR).repeat(results.yes)}` +
    `\n ${(EMOJIS.VOTE_AGAINST).repeat(results.against)} \n\n` +

    MessagesHelper.noWhiteSpace`
    <:twisty_rope:739153442341388421> 
    \n\n ${results.yes} For ${EMOJIS.VOTE_FOR} /
    ${results.against} Against ${EMOJIS.VOTE_AGAINST} /
    ${adjustedReq} (+${results.against} ${EMOJIS.VOTE_AGAINST}) Required 
    <:twisty_rope:739153442341388421>`;


export default class RedemptionHelper {

    static async votingFinished(poll) {
        const results = VotingHelper.getResults(poll);
        const adjustedReq = this.numRequired + results.against;

        try {
            const resultsMessage = await this.msg.say(
                resultMessageBuilder(this.member.user.id, results, adjustedReq)
            );
        
            // TODO: Include results message link in the DM.

            // Respond to election result.
            if (results.yes >= adjustedReq) {
                const approvalAcknowledgementText = `<@${this.member.user.id}> was granted membership!`;

                // Post in feed, newest member
                ChannelsHelper._postToFeed(approvalAcknowledgementText);
        
                // Display result.
                const { MEMBER, BEGINNER, SUBSCRIBER } = ROLES;

                const introRolesNames = [MEMBER.name, BEGINNER.name, SUBSCRIBER.name];
                const introRoles = RolesHelper.getRoles(this.msg.guild, introRolesNames)
                this.member.roles.add(introRoles);
        
                // TODO: DM, ask if they want themob and/or are-very-social roles.

                // Acknowledge member approved in unapproved channel.
                this.msg.say(approvalAcknowledgementText);

                // Inform the user of the result.
                await UsersHelper.directMSG(
                    this.msg.guild, 
                    this.member.user.id, 
                    `Your fate was decided: ${MessagesHelper.link(resultsMessage)}`
                );
            } else {
                // Kick the person out with a warning.
                this.msg.say(ejectionMsgText);
                await this.member.ban();
                setTimeout(() => {
                    this.msg.say(`${this.member.user.username} got cooped! ${EMOJIS.VOTE_AGAINST.repeat(3)}`);
                }, 5000);
            }
        } catch(e) {
            console.error(e);
        }
    }

    static votingFilter(reaction, user) {
        const { guild } = reaction.message;
        const emoji = reaction.emoji.name;
        const valid = [EMOJIS.VOTE_FOR, EMOJIS.VOTE_AGAINST].includes(emoji);
    
        // Don't count bot votes.
        if (user.bot) return false;
    
        // Don't count bot votes or invalid reactions.
        if (!valid) return false;
    
        // Make sure user has member role to vote, which will also block self-voting.
        const votingMember = UsersHelper.getMemberByID(guild, user.id);
        const authorized = UsersHelper.hasRoleNames(guild, votingMember, [ROLES.MEMBER.name]);
        if (valid && !authorized) return false;
    
        return true;
    }

    static trackVoting(redemptionMsg, member, numRequired) {
        return VotingHelper
            // Create the poll that enables the redemption voting.
            .create(redemptionMsg, this.votingFilter, redemptionPollDuration)

            // Add redemption voting finished handler with bound references.
            .on('end', this.votingFinished.bind({ msg: redemptionMsg, member, numRequired }));
    }

    static async start(msg, memberSubject) {
        try {
            // Calculate the number of required votes for the redemption poll.
            const reqVotes = VotingHelper.getNumRequired(msg.guild, .025);

            // Send avatar + header embed (due to loading jitter issue)
            await msg.embed(createEmbed({
                title: `${memberSubject.user.username}, you are being considered for approval!`,
                thumbnail: UsersHelper.avatar(memberSubject.user)
            }));

            // Send redemption embed with description and vote emojis.
            let embedMessage = await this.handleRedemptionEmbed(msg, memberSubject.user, reqVotes);
    
            // Track the poll voting.
            const voteCollector = this.trackVoting(embedMessage, memberSubject, reqVotes);

            // Start embed updating process.
            let countdownRemaining = redemptionPollDuration;
            const countdownProcessor = setInterval(async () => {
                try {
                    if (countdownRemaining > 0) {
                        countdownRemaining -= 10000;
        
                        const embedContent = embedMessage.embeds[0];
                        const results = VotingHelper.getResults(voteCollector.collected);
                        embedContent.description = buildRedeemEmbedDescText(
                            Math.max(0, (reqVotes + results.against) - results.yes),
                            countdownRemaining, 
                            memberSubject.user.username
                        );
    
                        embedMessage = await embedMessage.edit(embedContent);
                    } else 
                        clearInterval(countdownProcessor);
                } catch(e) {
                    console.error(e)
                }
            }, 10000);
            
            // Notify all of the voters to avoid waste of redemption polling time.
            await this.notifyVoters(embedMessage, memberSubject);

        } catch(e) {
            console.error(e);
        }
    }

    static async notifyVoters(voteMessage, voteSubject) {
        try {
            // Ping all mob/are-very-social users.
            await voteMessage.say(votingCtaMsgText);

            // Create link to the redemption event embed for linking messages.
            const pollLink = MessagesHelper.link(voteMessage);
    
            // Add message to feed/chat/spam.
            ChannelsHelper._postToFeed(feedMessageBuilder(voteSubject.user.username, pollLink));
    
            // Send poll link (DM) to one being considered and all active leaders.
            await UsersHelper.directMSG(
                voteMessage.channel.guild, 
                voteSubject.user.id, 
                `Your fate is being voted on here: ${pollLink}`
            );

        } catch(e) {
            console.error(e);
        }
    }

    static voteEmbedContent(user, dur, reqVotes, results = null) {
        return createEmbed({
            title: `Community, please vote on ${user.username}'s approval!`,
            description: buildRedeemEmbedDescText(reqVotes, dur, user.username),
            thumbnail: 'none'
        });
    }
    
    // Create redemption embed via helper and initialise voting reactions.
    static async handleRedemptionEmbed(msg, targetUser, reqVotes) {
        const embedMessage = await msg.embed(
            this.voteEmbedContent(targetUser, redemptionPollDuration, reqVotes)
        );
    
        setTimeout(() => embedMessage.react(EMOJIS.VOTE_FOR), 333);
        setTimeout(() => embedMessage.react(EMOJIS.VOTE_AGAINST), 666);
    
        return embedMessage
    }
}