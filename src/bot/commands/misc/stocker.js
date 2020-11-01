import CoopCommand from '../../core/classes/coopCommand';

export default class StockerCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'stocker',
			group: 'misc',
			memberName: 'stocker',
			aliases: [],
			description: 'Information stocker our fine community!',
			details: `Details`,
			examples: ['stocker', 'stocker example?'],
		});
	}

	async run(msg) {
		super.run(msg);
		
        const sefyMsg = await msg.say('🤦‍♂️');
    }
    
};
