import CoopCommand from '../../core/entities/coopCommand';
import MessagesHelper from '../../core/entities/messages/messagesHelper';

export default class BangCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'bang',
			group: 'misc',
			memberName: 'bang',
			aliases: [],
			description: 'Information bang our fine community!',
			details: `Details`,
			examples: ['bang', 'bang example?'],
		});
	}

	async run(msg) {
		super.run(msg);
		
		const placedMsg = await msg.say('🧨');

		MessagesHelper.delayEdit(placedMsg, '🔥', 333);
		MessagesHelper.delayEdit(placedMsg, '💥', 666);
		MessagesHelper.delayEdit(placedMsg, '💨', 999);

		// Clear the message, animation completed.
		MessagesHelper.delayDelete(placedMsg, 1666);
    }
    
};