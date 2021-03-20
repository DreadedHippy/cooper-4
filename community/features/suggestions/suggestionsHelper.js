import ChannelsHelper from "../../../core/entities/channels/channelsHelper";
import EMOJIS from "../../../core/config/emojis.json"
import UsersHelper from "../../../core/entities/users/usersHelper";
import MessagesHelper from "../../../core/entities/messages/messagesHelper";
import ServerHelper from "../../../core/entities/server/serverHelper";
import PointsHelper from "../points/pointsHelper";
import CHANNELS from "../../../core/config/channels.json";


// TODO: Make sure when adding to roadmap, talk, and feed that the votes are displayed to indicate mandate!
export default class SuggestionsHelper {

    static onMessage(msg) {
        if (msg.channel.id === CHANNELS.SUGGESTIONS.id && !msg.author.bot) 
            ChannelsHelper._postToFeed(`New suggestion: <#${CHANNELS.SUGGESTIONS.id}>`);
    }

    static async onReaction(reaction, user) {
        console.log('Suggestion reaction');
    }

    static async onAdd(msg) {
        // Validate a suggestion when it is originally added, part of house cleaning.   
    }

    static async check() {
        // Get last 25 suggestions to check through.
        const candidates = await ChannelsHelper._getCode('SUGGESTIONS').messages.fetch({ limit: 50 });
        let processedOne = false;
        candidates.map((suggestion, index) => {
            if (!processedOne) {
                const dayMs = ((60 * 60) * 72) * 1000;
                if (Date.now() - dayMs >= suggestion.createdAt.getTime()) {
                    const votes = this.parseVotes(suggestion);
                    if (votes.rejected) this.reject(suggestion, votes, index);
                    if (votes.passed) this.pass(suggestion, votes, index);
                    if (votes.tied) this.tied(suggestion, votes, index);
    
                    // Invalidate votes do not count as a vote processed.
                    if (votes.invalid) this.invalidate(suggestion, index);
    
                    // Prevent processing more, one action per iteration is enough.
                    if (votes.tied || votes.passed || votes.rejected) processedOne = true;
                }
            }
        });
    }

    // Post a link in feed and talk to try to break the deadlock.
    static tied(suggestion, votes, index) {
        setTimeout(() => {
            try {
                const link = MessagesHelper.link(suggestion);
                const tiedText = `Tied suggestion detected, please break the deadlock: \n\n ${link} \n\n` +
                    `${EMOJIS.POLL_FOR.repeat(votes.for)}${EMOJIS.POLL_AGAINST.repeat(votes.against)}`;
    
                ['TALK', 'FEED'].forEach((channelKey, channelIndex) => {
                    setTimeout(
                        () => ChannelsHelper._postToChannelCode(channelKey, tiedText), 
                        channelIndex * 666
                    );
                });
            } catch(e) {
                console.log('Tied suggestion handling error');
                console.error(e);
            }
        }, index * 5000);
    }

    static invalidate(suggestion, index) {
        setTimeout(async () => {
            try {
                // If not a cooper message, we know who to notify.
                if (!UsersHelper.isCooperMsg(suggestion)) {
                    const warningText = `Suggestion removed, please use !poll [text] to make suggestions. \n` +
                        `Your suggestion was: ${suggestion.content}`;
                    await UsersHelper.directMSG(ServerHelper._coop(), suggestion.author.id, warningText);
                }

                // Delete the message with a delay to avoid rate limiting.
                MessagesHelper.delayDelete(suggestion, 3333 * index);

            } catch(e) {
                console.log('Error during invalidation of suggestion');
                console.error(e);
            } 
        }, 5555 * index);
    }

    static parseVotes(msg) {
        const votes = {
            for: 0,
            against: 0,
            passed: false,
            rejected: false,
            tied: false,
            invalid: false,
            roadmap: false
        };

        if (UsersHelper.isCooperMsg(msg)) {
            msg.reactions.cache.map(reaction => {
                if (reaction.emoji.name === EMOJIS.POLL_FOR) votes.for = reaction.count;
                if (reaction.emoji.name === EMOJIS.POLL_AGAINST) votes.against = reaction.count;
                if (reaction.emoji.name === EMOJIS.ROADMAP) votes.roadmap = true;
            });
        } else votes.invalid = true;

        if (!votes.invalid) {
            if (votes.for > votes.against) votes.passed = true;
            if (votes.for < votes.against) votes.rejected = true;
            if (votes.for === votes.against) votes.tied = true;
        }

        return votes;
    }

    static async pass(suggestion, votes, index) {
        setTimeout(() => {
            try {
                // Reward the person who posted the suggestion for contributing to the community
                // TODO: ^
                // PointsHelper.addPointsByID
                console.log(suggestion.mentions);

                const rejectedText = `Suggestion passed, proposal: ${suggestion.content}\n` +
                    `${EMOJIS.POLL_FOR.repeat(votes.for)}${EMOJIS.POLL_AGAINST.repeat(votes.against)}`;
                
                // Inform the server of rejected suggestion.
                ['TALK', 'FEED'].forEach((channelKey, channelIndex) => {
                    setTimeout(
                        () => ChannelsHelper._postToChannelCode(channelKey, rejectedText), 
                        channelIndex * 666
                    );
                });

                // Post to roadmap if necessary
                if (votes.roadmap) ChannelsHelper._postToChannelCode('ROADMAP', suggestion.content);

                // Delete the message with a delay to avoid rate limiting.
                MessagesHelper.delayDelete(suggestion, 3333 * index);
            } catch(e) {
                console.log('Reject suggestion handling error');
                console.error(e);
            }
        }, index * 5000);
    }

    static async reject(suggestion, votes, index) {
        setTimeout(() => {
            try {
                const rejectedText = `Suggestion rejected, proposal: ${suggestion.content}\n` +
                    `${EMOJIS.POLL_FOR.repeat(votes.for)}${EMOJIS.POLL_AGAINST.repeat(votes.against)}`;
                
                // Inform the server of rejected suggestion.
                ['TALK', 'FEED'].forEach((channelKey, channelIndex) => {
                    setTimeout(
                        () => ChannelsHelper._postToChannelCode(channelKey, rejectedText), 
                        channelIndex * 666
                    );
                });

                // Delete the message with a delay to avoid rate limiting.
                MessagesHelper.delayDelete(suggestion, 3333 * index);
            } catch(e) {
                console.log('Reject suggestion handling error');
                console.error(e);
            }
        }, index * 5000);
    }
}