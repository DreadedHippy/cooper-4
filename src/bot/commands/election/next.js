import CoopCommand from '../../core/entities/coopCommand';

import ElectionHelper from '../../community/features/hierarchy/election/electionHelper';
import MessagesHelper from '../../core/entities/messages/messagesHelper';


export default class NextElectionCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'next',
			group: 'election',
			memberName: 'next',
			aliases: [],
			description: 'Check next election date',
			details: ``,
			examples: ['next']
		});
	}

	async run(msg) {
		super.run(msg);

		const dateFmt = await ElectionHelper.nextElecFmt();
		const msgText = `Next Election: ${dateFmt}`;

		MessagesHelper.selfDestruct(msg, msgText);
    }
    
};