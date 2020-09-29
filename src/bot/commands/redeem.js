import CoopCommand from '../core/classes/coopCommand';

export default class RedeemCommand extends Command {

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

		

		if (user) {
			try {
				if (msg.channel.type !== 'dm') await msg.reply('Redeeeeeeeeeeeeemed.');
				await msg.direct('You have been approved for The Coop, and now have full access as a member!');
				
			} catch(err) {
				console.log('Unable to send user approval DM.')
			}
		}
    }
    
};