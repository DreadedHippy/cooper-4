import CoopCommand from '../../core/classes/coopCommand';
import MessagesHelper from '../../core/entities/messages/messagesHelper';

export default class PollCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'poll',
			group: 'util',
			memberName: 'poll',
			aliases: [],
			description: 'polls will always be granted at The Coop to those who ask for them.',
			details: `Details`,
			examples: ['poll', 'poll prefix'],
		});
	}

	async run(msg) {
		// Run as a coop command
		super.run(msg);

		const isDMCommand = msg.channel.type !== 'dm';
        try {
			// TODO: Send link	
			if (isDMCommand) {
				const pollAcknowledgement = await msg.reply('Poll started...');

				// TODO: Add reactions
			
				// Send poll tracking link.
				await msg.direct('I started your poll, track its progress with this link: ' + MessagesHelper.link(pollAcknowledgement));
			}

        } catch(err) {
			console.log(err);
            await msg.reply('Unable to send you the help DM. You probably have DMs disabled.');
        }
    }
    
};