import CoopCommand from '../../core/entities/coopCommand';

export default class AboutCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'about',
			group: 'info',
			memberName: 'about',
			aliases: [],
			description: 'Information about our fine community!',
			details: `Details`,
			examples: ['about', 'about example?'],
		});
	}

	async run(msg) {
		super.run(msg);
		
        try {
            // await msg.direct('DM ;)');
			// if (msg.channel.type !== 'dm') await msg.reply('Sent you a DM with information.');

			await msg.reply('Check the about channel, under welcome category!');

			// TODO: Check if asking for about in about channel... reply, that's just stupid.

        } catch(err) {
            await msg.reply('Unable to send you the help DM. You probably have DMs disabled.');
        }
    }
    
};