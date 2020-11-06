import CoopCommand from '../../core/classes/coopCommand';
import EMOJIS from '../../core/config/emojis.json';
import ChannelsHelper from '../../core/entities/channels/channelsHelper';

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
		});
	}

	async run(msg) {
		super.run(msg);

		try {
			await msg.say('Add sacrifice message.');

			// Get sacrifice target
			let targetUser;
			if (msg.mentions.users.first()) targetUser = msg.mentions.users.first();
			if (!targetUser) throw new Error('Sacrifice target required.');

			// Add message to sacrifice
			const sacrificeMsg = await ChannelsHelper._postToChannelCode('SACRIFICE', 'TEST');

			// Add reactions for voting
			await sacrificeMsg.react(EMOJIS.VOTE_AGAINST);

		} catch(e) {
			console.error(e);

			// Create error message.
			const errorMsg = await msg.say(e.message);

			// Delete error message when no longer necessary.
			if (errorMsg) setTimeout(() => {
				errorMsg.delete();
			}, 3000);
		}
    }
    
};