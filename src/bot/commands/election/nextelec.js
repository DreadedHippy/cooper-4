import CoopCommand from '../../core/entities/coopCommand';
import ElectionHelper from '../../community/features/hierarchy/election/electionHelper';
import MessagesHelper from '../../core/entities/messages/messagesHelper';


export default class NextElectionCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'nextelec',
			group: 'election',
			memberName: 'nextelec',
			aliases: [],
			description: 'Check nextelec election date',
			details: ``,
			examples: ['nextelec']
		});
	}

	async run(msg) {
		super.run(msg);

		const dateFmt = await ElectionHelper.nextElecFmt();
		const humanRemaining = await ElectionHelper.humanRemainingNext();
		const msgText = `Next Election: ${dateFmt}, (${humanRemaining}).`;

		MessagesHelper.selfDestruct(msg, msgText);
    }
    
};