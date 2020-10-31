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
		// Run as a coop command (clean up the original calling message)
		super.run(msg);

        try {
			const pollAcknowledgement = await msg.reply(msg.content);

			// Add reactions for people to use.
			setTimeout(async () => { await pollAcknowledgement.react('🟢'); }, 333);
			setTimeout(async () => { await pollAcknowledgement.react('🔴'); }, 666);
		
			// Send poll tracking link.
			await msg.direct(
				'I started your poll, track its progress with this link: ' + 
				MessagesHelper.link(pollAcknowledgement) + 
				+ " \n\n\n " + " _ " + msg.content
			);

        } catch(err) {
			console.error(err);
        }
    }
    
};