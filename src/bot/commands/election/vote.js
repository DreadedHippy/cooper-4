import CoopCommand from '../../core/entities/coopCommand';


export default class VoteCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'vote',
			group: 'election',
			memberName: 'vote',
			aliases: [],
			description: 'Vote for an electoral candidate.',
			details: ``,
			examples: ['vote', '!vote {?@user OR username?}'],
			args: [
				{
					key: 'votee',
					prompt: 'Who would you like to vote for?',
					type: 'user'
				}
			],
		});
	}

	async run(msg, { votee }) {
		super.run(msg);

		// Check if votee is member
		// Check if votee is candidate
		// Check if current user has already voted
    }
    
};