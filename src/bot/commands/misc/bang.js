import CoopCommand from '../../core/classes/coopCommand';
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
		
		msg.send('🧨').then((msg) => { 
			setTimeout(() => {
				msg.edit('🔥').then((msg) => { 
					setTimeout(() => {
						msg.edit('💥').then((msg) => { 
							setTimeout(() => {
								msg.edit('💨').then(msg => {
									setTimeout(() => { msg.delete() }, 200);
								})
							}, 200);
						});
					}, 200)	
				}, 200);
			}, 200);
		})
    }
    
};