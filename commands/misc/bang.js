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
		
		const placedMsg = await msg.say('๐งจ');

		MessagesHelper.delayEdit(placedMsg, '๐ฅ', 333);
		MessagesHelper.delayEdit(placedMsg, '๐ฅ', 666);
		MessagesHelper.delayEdit(placedMsg, '๐จ', 999);

		// Clear the message, animation completed.
		MessagesHelper.delayDelete(placedMsg, 1666);
    }
    
};