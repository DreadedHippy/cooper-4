import CoopCommand from '../../core/entities/coopCommand';

import ElectionHelper from '../../community/features/hierarchy/election/electionHelper';
import MessagesHelper from '../../core/entities/messages/messagesHelper';


export default class LastElectionCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'last',
			group: 'election',
			memberName: 'last',
			aliases: [],
			description: 'Check last election date',
			details: ``,
			examples: ['last']
		});
	}

	async run(msg) {
		super.run(msg);

		const dateFmt = await ElectionHelper.lastElecFmt();
		const msgText = `Last Election: ${dateFmt}`;

		MessagesHelper.selfDestruct(msg, msgText);
    }
    
};