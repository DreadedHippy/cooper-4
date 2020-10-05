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

const votingDuration = 5;

const forEmoji = '🕊️';
const againstEmoji = '⚔️';

const collectionDuration = 60 * votingDuration * 1000;

// TODO: Refactor all of these below commands into a separate file.
const getRoles = (guild, rolesSelection) => guild.roles.cache.filter(r => rolesSelection.includes(r.name));

const membersPings = (membersCollection) => {
	return membersCollection.map(member => `<@${member.user.id}>`).join(', ');
}

const memberHasSomeOfRoleNames = (guild, member, roleNames) => {
	return guild.roles.cache
		.filter(role => roleNames.includes(role.name))
		.some(role => member.roles.cache.has(role.id));
};

const getOnlineMembers = (guild) => guild.members.cache.filter(member => member.presence.status === 'online');

const getOnlineMembersByRoles = (guild, roleNames) => {
	const notificiationRoles = guild.roles.cache.filter(role => roleNames.includes(role.name));
	
	const notificationMembers = guild.members.cache.filter(member => {
		const matchingRoles = notificiationRoles.some(role => member.roles.cache.has(role.id));
		const isOnline = member.presence.status === 'online';
		return matchingRoles && isOnline;
	});

	return notificationMembers;
}

function noWhiteSpace(strings, ...placeholders) {
	// Build the string as normal, combining all the strings and placeholders:
	let withSpace = strings.reduce((result, string, i) => (result + placeholders[i - 1] + string));
	let withoutSpace = withSpace.replace(/\s\s+/g, ' ');
	return withoutSpace;
}

const getResults = (collected) => {
	return _calcResults(collected.map(reactionType => {
		return {
			name: reactionType.emoji.name,
			count: reactionType.count
		};
	}));
}

const _calcResults = (results) => {
	const yes = (results[0] || { count: 1 }).count - 1;
	const against = (results[1] || { count: 1 }).count - 1;
	return { yes, against };
}

const trackVoting = (msg, member, requiredVotes) => {

	const filter = (reaction, user) => {
		const emoji = reaction.emoji.name;
		const valid = [forEmoji, againstEmoji].includes(emoji);

		// Don't count bot votes.
		if (user.bot) return false;

		// Don't count bot votes or invalid reactions.
		if (!valid) return false;

		// Make sure user has member role to vote, which will also block self-voting.
		const votingMember = msg.channel.guild.members.cache.find(member => member.id === user.id);
		const authorized = memberHasSomeOfRoleNames(msg.guild, votingMember, ['member 💛‍']);
		if (valid && !authorized) return false;

		// TODO: Update embed

		return true;
	};

	const collector = msg.createReactionCollector(filter, { time: collectionDuration });
	
	collector.on('end', collected => {
		const results = getResults(collected);
		const adjustedReq = requiredVotes + results.against;

		msg.channel.send(`<@${member.user.id}>, we have decided your fate. Here is the result:` +
			`\n\n ${(forEmoji).repeat(results.yes)}` +
			`\n ${(againstEmoji).repeat(results.against)} \n\n` +

			noWhiteSpace`
				<:twisty_rope:739153442341388421> 
				\n\n ${results.yes} For ${forEmoji} /
				${results.against} Against ${againstEmoji} /
				${adjustedReq} (+${results.against} ${againstEmoji}) Required 
				<:twisty_rope:739153442341388421>`
		);

		// Respond to election result.
		const won = results.yes >= adjustedReq;

		if (won) {
			try {
				// Post in feed, newest member
				ChannelsHelper._postToFeed(`${member.user.id} was granted membership!`);

				// Display result.
				const newMemberRoles = getRoles(msg.guild, ['member 💛‍', 'beginner 🥚', 'announcement-subscriber']);
				member.roles.add(newMemberRoles);

				// TODO: DM, ask if they want themob and/or are-very-social roles.
				
			} catch(e) {
				console.error(e);
			}
			
		} else {
			// Kick the person out with a warning.
			msg.channel.send('From our community, you have been rejected. Do not feel disrespected, you will now be ejected.');
		}
	});
}


const handleRedemptionEmbed = async (msg, targetUser, reqVotes) => {
	const avatarURL = UsersHelper.avatar(targetUser);

	// Create redemption embed, with democratic vote.
	const content = embedHelper({
		title: `${targetUser.username}, you are being considered for approval!`,
		description: `
			To gain entry, you require ${reqVotes} (2.5%) of the community members to consent.

			Tips for acquiring votes:
			- Post an intro
			- Pretend you're a good egg
			- ||Bribes||
			- Chicken puns

			Approval Voting (Via Emoji Reactions)
			- Approve -> ${forEmoji}
			- Reject -> ${againstEmoji}

			||Note: If user is not approved within ${votingDuration} minutes, they will be automatically removed.||
		`,
		thumbnail: avatarURL
	});
	
	const embedMessage = await msg.embed(content);

	setTimeout(() => { embedMessage.react(forEmoji) }, 333);
	setTimeout(() => { embedMessage.react(againstEmoji) }, 666);

	return embedMessage
}


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
			ChannelsHelper.sendByCodes(
				member.guild, 
				['FEED', 'TALK', 'SPAM'],
				`<${EMOJIS.COOP}> Will you allow ${user.username} into The Coop? :scroll:` +
				` Please vote here:\n ${pollLink}`
			)

			// Ping all online mob/are-very-social users
			// TODO: Refactor to an "alert".
			const membersToNotify = getOnlineMembers(msg.channel.guild);
			await msg.say(
				membersPings(membersToNotify) + noWhiteSpace`! Scramble! All **active** members, 
				you're needed for a potential redemption! 
				A finite determination of their infinity, 
				may now be further determined by its own negation.`
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