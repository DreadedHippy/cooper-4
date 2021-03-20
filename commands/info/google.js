import CoopCommand from '../../core/entities/coopCommand';
import MessagesHelper from '../../core/entities/messages/messagesHelper';

export default class GoogleCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'google',
			group: 'info',
			memberName: 'google',
			aliases: ['gg'],
			description: 'Information google our fine community!',
			details: `Details`,
			examples: ['google', 'google example?'],
		});
	}

	async run(msg) {
		super.run(msg);
		
		// Trim query and encode
		const searchStr = encodeURIComponent(
			msg.content
				.replace('!google ', '')
				.replace('!gg ', '')
		);

		// Generate feedback flash
		MessagesHelper.selfDestruct(msg, 'https://www.google.com/search?q=' + searchStr);
    }
    
};