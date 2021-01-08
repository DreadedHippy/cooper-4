import ElectionHelper from '../../community/features/hierarchy/election/electionHelper';
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
			//args: [
			//	{
			//		key: 'candidate',
			//		prompt: 'Please provide your written electoral campaign message.',
			//		type: 'user',
			//		default: null
			//	},
			//],
		});
	}

	async run(msg, { candidate }) {
		super.run(msg);

		// Check if election is ongoing.
		const isElec = await ElectionHelper.isElectionOn();

		if (!isElec) {
			const nextElecFmt = await ElectionHelper.nextElecFmt();
			const noElecText = `There is no election currently ongoing. Next is ${nextElecFmt}`;
			return MessagesHelper.selfDestruct(msg, noElecText);
		}

		if (candidate) {
			// Retrieve the campaign message of candidate
		} else {
			// Otherwise show the list in a self-destruct msg.
			const candidates = await ElectionHelper.getAllCandidates();
			const VotesCounts = await ElectionHelper.countVotes();


			const Results = candidates.map(u => `${u.candidate_id}:${VotesCounts[u.candidate_id]}`).join('\n');
			await msg.reply(Results);
		
		}

    }
    
};