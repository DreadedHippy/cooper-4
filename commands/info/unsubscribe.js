import SubscriptionHelper from '../../community/newsletter/subscriptionHelper';
import CoopCommand from '../../core/entities/coopCommand';

export default class UnsubscribeCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'unsubscribe',
			group: 'info',
			memberName: 'unsubscribe',
			aliases: [],
			description: 'Help will always be granted at The Coop to those who ask for it.',
			details: `Details`,
			examples: ['unsubscribe', 'unsubscribe prefix'],
		});
	}

	async run(msg) {
		super.run(msg);

        try {
			await SubscriptionHelper.unsubscribe(msg.author.id);
			// TODO: Beg them a lil bit more and ask for feedback.
			setTimeout(() => msg.say(`${msg.author.username} unsubscribed.`), 666);

        } catch(err) {
            await msg.reply('Unable to unsubscribe you, contact a leader.');
        }
    }
    
};