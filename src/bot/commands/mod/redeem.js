import ROLES from '../../core/config/roles.json';
import CHANNELS from '../../core/config/channels.json';
import EMOJIS from '../../core/config/emojis.json';

import STATE from '../../state';

import embedHelper from '../../../ui/embed/embedHelper';
import CoopCommand from '../../core/classes/coopCommand';
import UsersHelper from '../../core/entities/users/usersHelper';
import MessagesHelper from '../../core/entities/messages/messagesHelper';
import ServerHelper from '../../core/entities/server/serverHelper';
import ChannelsHelper from '../../core/entities/channels/channelsHelper';

export default class RedeemCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'redeem',
			group: 'mod',
			memberName: 'redeem',
			aliases: [],
			description: 'Sling a rope.',
			details: `Details for redeeming`,
			examples: ['redeem', 'Nice example!'],
			args: [
				{
					key: 'user',
					prompt: 'Which user would you like to approve?',
					type: 'user',
				},
			],
		});
	}

	async run(msg, { user }) {
		super.run(msg);

		const votingDuration = 5;

		const forEmoji = '🕊️';
		const againstEmoji = '⚔️';
		
		const collectionDuration = 60 * votingDuration * 1000;

		try {
			// Check person issuing command is a leader or commander.
			const authorMember = msg.channel.guild.members.cache.get(msg.author.id);

			const isAuthorised = memberHasSomeOfRoleNames(msg.guild, authorMember, ['⚔️.  leader', '👑.  commander']);
			if (!isAuthorised) return msg.say(':no_entry_sign: You can\'t touch this. :no_entry_sign:');

			// Check user is not already a member.
			const member = msg.channel.guild.members.cache.get(user.id);
			if (!member) return msg.reply(`User can't be foooooound.`);

			const isMember = member.roles.cache.get(ROLES.MEMBER.id);
			if (isMember) return msg.reply(`Have you lost your cluckin' mind? ${user.username} is already approved.`);

			const totalMembers = msg.channel.guild.members.cache.filter(member => !member.user.bot).size; 
			const reqVotes = Math.floor(totalMembers * 0.025);

			// Send offer embed
			const embedMessage = await handleRedemptionEmbed(msg, user, reqVotes);

			const pollLink = MessagesHelper.link(embedMessage);

			// Add message to feed/chat/spam
			ChannelsHelper._postToFeed(
				`<${EMOJIS.COOP}> Will you allow ${user.username} into The Coop? :scroll:` +
				` Please vote here:\n ${pollLink}`
			)

			// Ping all online mob/are-very-social users
			await msg.say(
				MessagesHelper.noWhiteSpace`@themob, @are-very-social, scramble! All **active** members, you're needed for a potential redemption! 
				A finite determination of their infinity, may now be further determined by its own negation.`
			);

			// Track the poll voting.
			trackVoting(embedMessage, member, reqVotes);

			// Send poll link (DM) to one being considered and all active leaders.
			const server = ServerHelper.getByID(STATE.CLIENT, msg.channel.guild.id);
			if (server) await server.members.cache.get(member.user.id).send(`Your fate is being voted on: ${pollLink}`);

		} catch(e) {
			msg.say('Redemption failed, check logs. :mag_right::wood::wood::wood:');
			console.error(e);
		}
    }
    
};