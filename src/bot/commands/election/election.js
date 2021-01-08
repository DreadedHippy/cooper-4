import ElectionHelper from '../../community/features/hierarchy/election/electionHelper';
import CoopCommand from '../../core/entities/coopCommand';


export default class ConsiderCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'election',
			group: 'election',
			memberName: 'election',
			aliases: [],
			description: 'Tells you whether an election is occurring or not.',
			details: ``,
			examples: ['election'],
		});
	}

	async run(msg) {
		super.run(msg);

		const isElectionActuallyRunning = await ElectionHelper.isElectionOn();
    }
    
};