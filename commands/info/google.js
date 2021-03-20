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
		
		// Query

		// Feedback
		MessagesHelper.selfDestruct(msg, 'Your google link...');
    }
    
};