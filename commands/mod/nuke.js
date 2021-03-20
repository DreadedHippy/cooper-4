import CoopCommand from '../../core/entities/coopCommand';
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
			
		await msg.reply('☢☢☢☢☢☢☢ing channel:: ' + msg.channel.name);
		
		setTimeout(async () => {
			const messages = await msg.channel.messages.fetch({ limit: 50 });
			if (Array.from(messages.keys()).length === 0) endNuking(msg);

			// Bulk delete the messages.
			await msg.channel.bulkDelete(messages);
		}, 5000);
    }
    
};