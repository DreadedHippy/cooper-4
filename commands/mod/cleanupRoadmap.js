import CoopCommand from '../../core/entities/coopCommand';
import ChannelsHelper from '../../core/entities/channels/channelsHelper';
import STATE from '../../core/state';

export default class CleanupRoadmapCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'cur',
			group: 'mod',
			memberName: 'cur',
			aliases: [],
			description: 'Information cur our fine community!',
			details: `Details`,
			examples: ['cur', 'cur example?'],

			// Stop us getting nuked
			ownerOnly: true,
		});
	}

	async run(msg) {
		super.run(msg);
		
		// Delete all messages with check marks inside roadmap
		const roadmap = ChannelsHelper._getCode('ROADMAP');

		const msgs = await roadmap.messages.fetch({ limit: 100 });
		const forRemoval = msgs.filter(msg => {
			let hasElectedTrashEmoji = false;
			// Check if it has check mark emoji on it.
			msg.reactions.cache.map(rct => {
				if (rct.emoji.name === '✅') hasElectedTrashEmoji = true;
			});

			// Add to map of messages for bulk deletion.
			if (hasElectedTrashEmoji) return true;
		});

		forRemoval.map(msg => msg.delete());
    }
    
};