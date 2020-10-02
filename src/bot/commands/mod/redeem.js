import embedHelper from '../../../ui/embed/embedHelper';
import CoopCommand from '../../core/classes/coopCommand';
import ROLES from '../../core/config/roles.json';
import CHANNELS from '../../core/config/channels.json';
import UsersHelper from '../../core/entities/users/usersHelper';
import MessagesHelper from '../../core/entities/messages/messagesHelper';
import STATE from '../../state';

const votingDuration = 5;

const forEmoji = '🕊️';
const againstEmoji = '⚔️';

// const collectionDuration = 60 * votingDuration * 1000;

const membersPings = (membersCollection) => {
	return membersCollection.map(member => `<@${member.user.id}>`).join(', ');
}

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

		// TODO: Make sure user has member role to vote (SECURITY)
		const authorized = true;

		// TODO: Warn voting non-members
		if (valid && !authorized) {
			// warn
		}

		// TODO: Block from voting for self.

		if (valid && !user.bot) {
			return true;
		}

		return false;
	};

	// const collectionDuration = 60 * votingDuration * 1000;
	const collectionDuration = 16000;
	const collector = msg.createReactionCollector(filter, { time: collectionDuration });

	collector.on('collect', (reaction, user) => {
		const results = getResults(collector.collected);
		const adjustedReq = requiredVotes + results.against;

		reaction.message.channel.send(
			noWhiteSpace`
				<@${user.id}> just voted on the fate of a soul, hope it wasn't yours!` + `\n\n` +
				
				noWhiteSpace`${reaction.emoji.name} 
					<@${member.user.id}> now has ${results.yes}/${adjustedReq} of the necessary votes required for membership.
					${reaction.emoji.name}`
		);
	});
	
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

		setTimeout(() => { msg.channel.send('Hmm...'); }, 500);
		setTimeout(() => { 
			msg.channel.send(`Hmmmm...... Looks like you ${won ? 'won' : 'lost'}.`); 

			if (won) {
				// CTA for winning
				msg.channel.send('<:coop:725006245999935610>'.repeat(5));

				// Display result.
				member.roles.add(msg.guild.roles.find(r => r.name === 'member :yellow_heart:'));
				
			} else member.roles.add(msg.guild.roles.find(r => r.name === 'business :briefcase:'));
		}, 1000);
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
			// Check user is not already a member.
			const member = msg.channel.guild.members.cache.find(member => member.id === user.id);

			if (member) {
				const isMember = member.roles.cache.find(role => role.id === ROLES.MEMBER.id);
				if (isMember) msg.reply(`Have you lost your cluckin' mind? ${user.username} is already approved.`);
				else {
					const totalMembers = msg.channel.guild.members.cache.filter(member => !member.user.bot).size; 
					const reqVotes = Math.floor(totalMembers * 0.025);

					// Send offer embed
					const embedMessage = await handleRedemptionEmbed(msg, user, reqVotes);

					const pollLink = MessagesHelper.link(embedMessage);

					// Add message to feed/chat/spam
					// const channelSelection = [CHANNELS.FEED.id, CHANNELS.TALK.id, CHANNELS.SPAM.id];
					// member.guild.channels.cache
					// 	.filter((channel) => channelSelection.includes(channel.id))
					// 	.map(async (channel, index) => { 
					// 		const jokeIntro = await channel.send(':egg: :cloud_lightning: How egg-citing, a new redemption opportunity appears.');
					// 		setTimeout(() => { 
					// 			jokeIntro.delete();
					// 			channel.send(`<:coop:725006245999935610> Will you allow ${user.username} into The Coop? :scroll: Please vote here:\n ${pollLink}`);
					// 		}, 2000 * index);
					// 	});


					// Ping all online mob/are-very-social users
					// const membersToNotify = getOnlineMembersByRoles(msg.channel.guild, ['themob', 'are-very-social']);
					// await msg.say(
					// 	membersPings(membersToNotify) + noWhiteSpace`Scramble! All **active** __mob__ and __very-social__ members, 
					// 	you're needed for a potential redemption! 
					// 	A finite determination of infinity, 
					// 	may now be further determined by its own negation.`
					// );

					// Track the poll voting.
					// trackVoting(embedMessage, member, reqVotes);

					// Send poll link (DM) to one being considered and all active leaders.
					const server = STATE.CLIENT.guilds.cache.find(guild => guild.id === msg.channel.guild.id);
					console.log(server);
					console.log(server.users);
					if (server) server.users.cache.get(member.user.id).send(`Your fate is being voted on: ${pollLink}`);
				}		
			} else {
				msg.reply(`User can't be foooooound.`);
			}
		} catch(e) {
			msg.say('Redemption failed, check logs. :mag_right::wood::wood::wood:');
			console.error(e);
		}
    }
    
};