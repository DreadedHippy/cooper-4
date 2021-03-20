import CoopCommand from '../../core/entities/coopCommand';
import MessagesHelper from '../../core/entities/messages/messagesHelper';

export default class CalcCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'calc',
			group: 'info',
			memberName: 'calc',
			aliases: [],
			description: 'Information calc our fine community!',
			details: `Details`,
			examples: ['calc', 'calc example?'],
		});
	}

	async run(msg) {
		super.run(msg);
		
		// Trim query and encode.
		const searchStr = encodeURIComponent(msg.content.replace('!calc ', ''));

		// Generate feedback flash
		MessagesHelper.selfDestruct(msg, 'https://www.google.com/search?q=' + searchStr);
    }
    
};