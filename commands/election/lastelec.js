import CoopCommand from '../../core/entities/coopCommand';

import ElectionHelper from '../../community/features/hierarchy/election/electionHelper';
import MessagesHelper from '../../core/entities/messages/messagesHelper';


export default class LastElectionCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'lastelec',
			group: 'election',
			memberName: 'lastelec',
			aliases: [],
			description: 'Check lastelec election date',
			details: ``,
			examples: ['lastelec']
		});
	}

	async run(msg) {
		super.run(msg);

		// TODO: If election is currently on, then it is recalculated to the one before that.

		const isOn = await ElectionHelper.isVotingPeriod();

		if (isOn) {
			MessagesHelper.selfDestruct(msg, 'Election is on now, recalculate one previous.');
		} else {
			const dateFmt = await ElectionHelper.lastElecFmt();
			const msgText = `Last Election: ${dateFmt}`;
			MessagesHelper.selfDestruct(msg, msgText);
		}

    }
    
};