import CoopCommand from '../../core/entities/coopCommand';


export default class ConsiderCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'consider',
			group: 'election',
			memberName: 'consider',
			aliases: ['celec'],
			description: 'Consider an electoral candate, shows their campaign message and platform.',
			details: ``,
			examples: ['consider', '!consider {OPTIONAL:?@user OR "username"?}'],
			args: [
				{
					key: 'candidate',
					prompt: 'Please provide your written electoral campaign message.',
					type: 'user',
				},
			],
		});
	}

	async run(msg, { candidate }) {
		super.run(msg);

		// Retrieve the campaign message of candidate

    }
    
};