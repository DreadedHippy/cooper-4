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
					type: 'string',
				},
			],
		});
	}

	async run(msg, { user }) {
		super.run(msg);

		// Check user is not already a member.

		// Create redemption embed, with democratic vote.

		// Save offer to database
    }
    
};