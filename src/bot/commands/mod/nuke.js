import CoopCommand from '../../core/classes/coopCommand';
import STATE from '../../state';


const endNuking = () => {
	if (STATE.NUKING) clearInterval(STATE.NUKING);
	STATE.NUKING = null;
}

export default class NukeCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'nuke',
			group: 'mod',
			memberName: 'nuke',
			aliases: [],
			description: 'Information nuke our fine community!',
			details: `Details`,
			examples: ['nuke', 'nuke example?'],

			// Stop us getting nuked
			ownerOnly: true,
		});
	}

	async run(msg) {
		super.run(msg);

		if (!STATE.NUKING) {
			STATE.NUKING = setInterval(async () => {
				const messages = await msg.channel.messages.fetch({ limit: 5 });
				if (Array.from(messages.keys()).length === 0) endNuking(msg);
				else messages.map(fetchedMsg => fetchedMsg.delete());
			}, 1000)

			await msg.reply('☢☢☢☢☢☢☢ing channel:: ' + msg.channel.name);

		} else {
			endNuking(msg)
		}

    }
    
};