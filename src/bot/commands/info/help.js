import CoopCommand from '../../core/classes/coopCommand';

export default class HelpCommand extends CoopCommand {

	commando = null

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

		this.commando = client;
	}

	async run(msg) {
		super.run(msg);

		console.log(this.commando);
		console.log(this);
		console.log(arguments);

        try {
			// TODO: Implement properly.



			await msg.direct(``);

        } catch(err) {
            await msg.reply('Unable to send you the help DM. You probably have DMs disabled.');
        }
    }
    
};