import SacrificeHelper from '../../../community/features/events/sacrificeHelper';
import CoopCommand from '../../core/classes/coopCommand';

export default class SacrificeCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'sacrifice',
			group: 'community',
			memberName: 'sacrifice',
			aliases: [],
			description: 'The command for starting a round of sacrifices.',
			details: `Details of the points command`,
			examples: ['points', 'an example of how coop-econmics functions, trickle down, sunny side up Egg & Reagonmics. Supply and demand.'],

			ownerOnly: true
		});
	}

	async run(msg) {
		super.run(msg);

		try {
			// Get sacrifice target
			let targetUser;
			if (msg.mentions.users.first()) targetUser = msg.mentions.users.first();
			if (!targetUser) throw new Error('Sacrifice target required.');

			await SacrificeHelper.offer(targetUser);

		} catch(e) {
			console.error(e);

			// Create error message.
			const errorMsg = await msg.say(e.message);

			// Delete error message when no longer necessary.
			if (errorMsg) setTimeout(() => { errorMsg.delete(); }, 3000);
		}
    }
    
};