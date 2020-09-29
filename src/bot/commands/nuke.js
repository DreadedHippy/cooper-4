import CoopCommand from '../core/classes/coopCommand';
import STATE from '../state';


const endNuking = (msg) => {
	if (STATE.NUKING) clearInterval(STATE.NUKING.INTERVAL);
	STATE.NUKING = null;

	console.log('Stopped nuking!');
	msg.reply('Stopped the ☢☢☢☢☢☢☢ of channel: ' + msg.channel.name);
}

export default class NukeCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'nuke',
			group: 'util',
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
			STATE.NUKING = {
				CHANNEL_ID: 'CHANNEL ID',
				LAST_UNDELETED: null,
				INTERVAL: setInterval(async () => {
					const amount = 5;
					
					let cursor = msg.id;
					if (STATE.NUKING.LAST_UNDELETED) cursor = STATE.NUKING.LAST_UNDELETED;
					
					const messages = await msg.channel.messages.fetch({ around: cursor, limit: amount });
					const count = Array.from(messages.keys()).length;

					console.log(count, 'count')

					if (count === 0) endNuking(msg);

					// Attempt to delete messages five at a time, every five seconds.
					console.log('Nuking ' + amount + ' more messages.')
					messages.map(async (fetchedMsg, index) => {
						try {
							if (index !== amount - 1) await fetchedMsg.delete()

							// Leave the last message undeleted and set it to the cursor position so it isn't left.
							else STATE.NUKING.LAST_UNDELETED = fetchedMsg.id;
						} catch(e) {
							console.error(e)
						}
					});					
				}, 1000)
			}

			await msg.reply('☢☢☢☢☢☢☢ing channel:: ' + msg.channel.name);

		} else {
			endNuking(msg)
		}

    }
    
};