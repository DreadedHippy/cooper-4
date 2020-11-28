import CoopCommand from '../../core/classes/coopCommand';
import STATE from '../../state';

export default class SalCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'sal',
			group: 'misc',
			memberName: 'sal',
			aliases: [],
			description: 'Information sal our fine community!',
			details: `Details`,
			examples: ['sal', 'sal example?'],
		});
	}

	async run(msg) {
        setTimeout(() => {
            super.run(msg);
            msg.say('Saaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaal... Ru.')
        }, 250);
    }
    
};
