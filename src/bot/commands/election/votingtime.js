import CoopCommand from '../../core/entities/coopCommand';

import ElectionHelper from '../../community/features/hierarchy/election/electionHelper';
import MessagesHelper from '../../core/entities/messages/messagesHelper';
import TimeHelper from '../../community/features/server/timeHelper';


export default class VotingTimeCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'votingtime',
			group: 'election',
			memberName: 'votingtime',
			aliases: [],
			description: 'Check voting time remaining',
			details: ``,
			examples: ['votingtime']
		});
	}

	async run(msg) {
		super.run(msg);

		const isOn = await ElectionHelper.isElectionOn();

		if (isOn) {
			const votingSecs = await ElectionHelper.votingPeriodLeftSecs();
			const readableRemaining = TimeHelper.humaniseSecs(votingSecs);
			MessagesHelper.selfDestruct(msg, `Voting time remaining: ${readableRemaining}`);

		} else {
			MessagesHelper.selfDestruct(msg, 'Election is not running.');
		}

    }
    
};