import EMOJIS from '../../../bot/core/config/emojis.json';
import CHANNELS from '../../../bot/core/config/channels.json';
import ChannelsHelper from '../../../bot/core/entities/channels/channelsHelper';
import ServerHelper from '../../../bot/core/entities/server/serverHelper';
import UsersHelper from '../../../bot/core/entities/users/usersHelper';
import VotingHelper from '../../events/voting/votingHelper';
import STATE from '../../../bot/state';
import MessagesHelper from '../../../bot/core/entities/messages/messagesHelper';
import embedHelper from '../../../ui/embed/embedHelper';
import Chance from 'chance';

const chanceInstance = new Chance;

export default class SacrificeHelper {
   
    static isReactionSacrificeVote(reaction, user) {
        const emoji = reaction.emoji.name;
        const isVoteEmoji = [EMOJIS.DAGGER, EMOJIS.SHIELD].indexOf(emoji) > -1;
        const channelID = reaction.message.channel.id;

        if (user.bot) return false;
        if (!isVoteEmoji) return false;
        if (channelID !== CHANNELS.SACRIFICE.id) return false;

        // Guards passed.
        return true;
    }

    static emojiToUni(emoji) {
        return emoji.codePointAt(0).toString(16);
    }

    static isBackDagger(reaction, user) {
        const emoji = reaction.emoji.name;
        const channelID = reaction.message.channel.id;
        const isSacrificeChannel = channelID === CHANNELS.SACRIFICE.id;
        const isDagger = this.emojiToUni(emoji) === this.emojiToUni(EMOJIS.DAGGER);

        if (isSacrificeChannel) return false;
        if (user.bot) return false;
        if (reaction.message.author.bot) return false;
        if (!isDagger) return false;

        // Guards passed.
        return true;
    }

    static async onReaction(reaction, user) {
        // Is back dagger
        if (this.isBackDagger(reaction, user)) {
            this.processBackDagger(reaction, user);
        }

        // Process the vote.
        if (this.isReactionSacrificeVote(reaction, user)) {
            this.processVote(reaction, user);
        }
    }

    static async processVote(reaction, user) {
        const guild = ServerHelper.getByCode(STATE.CLIENT, 'PROD');

        // Try to access sacrificee from message
        try {
            const sacrificeEmbedDesc = reaction.message.embeds[0].description;
            const sacrificeeID = /<@(\d+)>/.exec(sacrificeEmbedDesc)[1];
            const targetMember = await UsersHelper.fetchMemberByID(guild, sacrificeeID);

            // If member left, don't do anything.
            if (!targetMember) return false;
            
            // Calculate the number of required votes for the redemption poll.
            const reqSacrificeVotes = VotingHelper.getNumRequired(guild, .025);
            const reqKeepVotes = VotingHelper.getNumRequired(guild, .02);
        
            // Get existing reactions on message.
            let sacrificeVotes = 0;
            let keepVotes = 0;
            reaction.message.reactions.cache.map(reactionType => {
                if (reactionType.emoji.name === EMOJIS.DAGGER) sacrificeVotes = Math.max(0, reactionType.count - 1);
                if (reactionType.emoji.name === EMOJIS.SHIELD) keepVotes = Math.max(0, reactionType.count - 1);
            });


            // Process votes with feedback for currently unprotected user.
            const rawKeepVotes = reqKeepVotes - keepVotes;
            if (rawKeepVotes > 0) {
                const remainingProtectVotes = Math.max(0, rawKeepVotes);
                const remainingSacrificeVotes = Math.max(0, reqSacrificeVotes - sacrificeVotes);   

                // Check if enough votes to sacrifice.
                if (remainingSacrificeVotes === 0) {
                    // Notify when user is voted out.
                    await ChannelsHelper._postToFeed(`<@${targetMember.id}>'s was sacrificed!`);
                    await targetMember.ban();

                } else {
                    // Provide feedback for user who is not currently protected or sacrificed.
                    await ChannelsHelper._postToFeed(
                        `<@${targetMember.id}>'s sacrifice was voted upon!` +
                        `\n\n**Remaining Votes:**` +
                        `\nTo Protect: ${EMOJIS.SHIELD}: ${remainingProtectVotes}` +
                        `\nTo Sacrifice: ${EMOJIS.DAGGER}: ${remainingSacrificeVotes}`
                    );
                }

                
            // Intercept latest vote granted protection to user.
            } else if (rawKeepVotes === 0 && reaction.emoji.name === EMOJIS.SHIELD) {
                await ChannelsHelper._postToFeed(`<@${targetMember.id}>'s was protected from sacrifice by votes!`);
            } 

        } catch(e) {
            console.error(e);
        }
    }

    static async processBackDagger(reaction, user) {
        const guild = ServerHelper.getByCode(STATE.CLIENT, 'PROD');

        // Calculate the number of required votes for the redemption poll.
        const reqSacrificeVotes = VotingHelper.getNumRequired(guild, .015);
    
        // Get existing reactions on message.
        let sacrificeVotes = 0;
        reaction.message.reactions.cache.map(reactionType => {
            const emoji = reactionType.emoji.name;
            if (this.emojiToUni(emoji) === this.emojiToUni(EMOJIS.DAGGER)) {
                sacrificeVotes = reactionType.count;
            }
        });

        if (sacrificeVotes >= reqSacrificeVotes) {
            const targetID = reaction.message.author.id;
            const targetMember = await UsersHelper.fetchMemberByID(guild, targetID);

            // TODO: Award points to bakcstabbers
            // TODO: Award points for successfully removing a backstabbed member.
            // TODO: Also reward points for approving/rejecting an incoming member (reward more for rejection)

            await this.offer(targetMember.user);

            setTimeout(async () => {
                // May have got stabbed more in the past 3 seconds.
                let updatedNumVotes = sacrificeVotes;
                const backstabbers = [];
                reaction.message.reactions.cache.map(reactionType => {
                    console.log('attempt to log reactor so we can provide a list of the backstabbers');
                    console.log(reactionType);
                    const emoji = reactionType.emoji.name;
                    if (this.emojiToUni(emoji) === this.emojiToUni(EMOJIS.DAGGER)) {
                        updatedNumVotes = reactionType.count;
                    }
                });

                const backstabMsg = await reaction.message.say(
                    `${targetMember.user.username} got backstabbed! ${EMOJIS.DAGGER.repeat(updatedNumVotes)}`
                );
            }, 3000)
        }
    }

    static async offer(user) {
        // TODO: Check last sacrifice time

        // Add message to sacrifice
        const sacrificeEmbed = { embed: embedHelper({ 
            title: `${user.username}, you are being considered for sacrifice!`,
            description: `To sacrifice <@${user.id}> press dagger, to protect the user press the shield.`,
            thumbnail: UsersHelper.avatar(user)
        }) };

        const sacrificeMsg = await ChannelsHelper._postToChannelCode('SACRIFICE', sacrificeEmbed);
        const sacrificeLink = MessagesHelper.link(sacrificeMsg);

        // Post to feed
        setTimeout(() => {
            const sacrificeMsgText = `<@${user.id}> is being considered for sacrifice! Vote now! :O ` + sacrificeLink;
            ChannelsHelper._postToFeed(sacrificeMsgText);

            setTimeout(() => {
                const begPromptMsgText = `<@${user.id}> you may beg to be spared from sacrifice here.`;
                ChannelsHelper._postToChannelCode('TALK', begPromptMsgText);
            }, 1500);
        }, 1500);

        // Add reactions for voting
        setTimeout(async () => { await sacrificeMsg.react(EMOJIS.DAGGER); }, 1500);
        setTimeout(async () => { await sacrificeMsg.react(EMOJIS.SHIELD); }, 2000);

        return true;
    }

    static async random() {
        const usersQuery = await UsersHelper.load();
        const rowCount = usersQuery.rowCount || 0;
        const users = usersQuery.rows || [];
        if (rowCount > 0) {
            const randomIndex = chanceInstance.natural({ min: 0, max: rowCount });
            const randomUser = users[randomIndex];

            const guild = ServerHelper.getByCode(STATE.CLIENT, 'PROD');
            const member = await guild.members.fetch(randomUser.discord_id);
            if (member) this.offer(member.user);
        }
    }
}