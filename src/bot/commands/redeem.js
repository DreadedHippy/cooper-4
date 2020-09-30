import embedHelper from '../../ui/embed/embedHelper';
import CoopCommand from '../core/classes/coopCommand';
import ROLES from '../core/config/roles.json';

const votingDuration = 5;

const trackVoting = (msg, targetUser) => {
	const filter = (reaction, user) => {
		const emoji = reaction.emoji.name;
		const valid = ['🕊️', '⚔️'].includes(emoji);
		const isBot = user.bot;

		// TODO: Make sure user has member role to vote (SECURITY)
		const authorized = true;

		// TODO: Warn voting non-members
		if (valid && !authorized) {
			// warn
		}

		// TODO: Block from voting for self.

		// console.log(user);
		// console.log('----------------------');
		// console.log(reaction);

		if (valid && !isBot) {
			return true;
		}

		return false;
	};

	// const collectionDuration = 60 * votingDuration * 1000;
	const collectionDuration = 15000;
	const collector = msg.createReactionCollector(filter, { time: collectionDuration });

	collector.on('collect', (reaction, user) => {
		const fateUpdate = `
			<@${targetUser.id}>, 
			<@${user.id}> just voted on your fate! ${reaction.emoji.name}
		`;
		reaction.message.channel.send(fateUpdate);
	});
	
	collector.on('end', collected => {
		const results = collected.map(reactionType => {
			return {
				name: reactionType.emoji.name,
				count: reactionType.count
			}
		})
		console.log(results);
		// console.log(`collected ${collected.size} reactions`);
	});
}


const handleRedemptionEmbed = async (msg, targetUser) => {
	const avatarURL = `https://cdn.discordapp.com/avatars/${targetUser.id}/${targetUser.avatar}.png?size=128`
	const totalMembers = msg.channel.guild.members.cache.filter(member => !member.user.bot).size; 
	const reqVotes = Math.floor(totalMembers * 0.025);

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
			- Approve -> 🕊️
			- Reject -> ⚔️

			||Note: If user is not approved within ${votingDuration} minutes, they will be automatically removed.||
		`,
		thumbnail: avatarURL
	});
	const embedMessage = await msg.embed(content);

	setTimeout(() => { embedMessage.react('🕊️') }, 333);
	setTimeout(() => { embedMessage.react('⚔️') }, 666);

	trackVoting(embedMessage, targetUser);
}


export default class RedeemCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'redeem',
			group: 'util',
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

	run(msg, { user }) {
		super.run(msg);

		// Check user is not already a member.
		const userData = msg.channel.guild.members.cache.find(member => member.id === user.id);
		const isMember = userData.roles.cache.find(role => role.id === ROLES.MEMBER.id);
		if (isMember) msg.reply(`Have you lost your cluckin' mind? ${user.username} is already approved.`);
		else {
			// Save offer to database
			

			// Send offer embed
			handleRedemptionEmbed(msg, user);
		}		
    }
    
};