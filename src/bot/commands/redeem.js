import embedHelper from '../../ui/embed/embedHelper';
import CoopCommand from '../core/classes/coopCommand';

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


	// Currently can fail in argument mode, because argument is not the same as a user.
	// const subject = msg.mentions.users.first();
	// Check if a user was actually mentioned!
	async run(msg, { user }) {
		super.run(msg);

		// Check user is not already a member.
		console.log(user);

		// Save offer to database

		const avatarURL = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128`

		const reqVotes = 5;

		// Create redemption embed, with democratic vote.
		const content = embedHelper({
			title: `${user.username}, you are being considered for approval!`,
			description: `
				To gain entry, you require 2.5% of the community members to consent.

				Currently, you have 0/${reqVotes} required votes.

				Tips for acquiring votes:
				- Post an intro
				- Pretend you're a good person
				- Bribes
				- Chicken puns

				Approval Voting:
				To approve this user, press on the dove emoji reaction. 
				If you want to keep this user out, react with the swords.

				If user is not approved within 30 minutes, they will be automatically removed.
			`,
			thumbnail: avatarURL
		});
		const embedMessage = await msg.embed(content);

		// TODO: Add reactions
		console.log(embedMessage)
    }
    
};