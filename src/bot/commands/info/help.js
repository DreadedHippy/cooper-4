import CoopCommand from '../../core/classes/coopCommand';

export default class HelpCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'help',
			group: 'info',
			memberName: 'help',
			aliases: [],
			description: 'Help will always be granted at The Coop to those who ask for it.',
			details: `Details`,
			examples: ['help', 'help prefix'],
		});
	}

	async run(msg) {
		super.run(msg);
		
        try {
			// TODO: Implement properly.
			await msg.direct(`

				HELP, HELP, HELP!
			
			`);
            if (msg.channel.type !== 'dm') await msg.reply('Sent you a DM with information.');
        } catch(err) {
            await msg.reply('Unable to send you the help DM. You probably have DMs disabled.');
        }
    }
    
};