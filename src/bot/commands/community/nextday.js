import Chicken from '../../community/chicken';
import CoopCommand from '../../core/entities/coopCommand';
import MessagesHelper from '../../core/entities/messages/messagesHelper';

export default class NextDayCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'nextday',
			group: 'community',
			memberName: 'nextday',
			aliases: ['nd'],
			description: 'Time until next day',
			details: `Gives the time until the next Coop "day"`,
			examples: ['nextday', 'nextday example']
		});
	}

	async run(msg) {
		super.run(msg);

		try {
			// Check time until next day
			const timeUntilNext = await Chicken._nextdayis();
			const timeUntilMsg = await msg.say(`Time until next day: ${timeUntilNext}`);

			// Delete after sixty seconds.
			MessagesHelper.delayDelete(timeUntilMsg, 60000);

		} catch(e) {
			console.error(e);
		}
    }
    
};