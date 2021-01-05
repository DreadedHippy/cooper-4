import CoopCommand from '../../core/classes/coopCommand';
import MessagesHelper from '../../core/entities/messages/messagesHelper';

export default class TimeCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'time',
			group: 'community',
			memberName: 'time',
			aliases: ['tim', 'whattime', 'currenttime', 'now'],
			description: 'Time until next day',
			details: `Gives the time until the next Coop "day"`,
			examples: ['time', 'time example']
		});
	}

	async run(msg) {
		super.run(msg);

		try {
			// Check time until next day
			const dateString = (new Date((+new Date))).toUTCString();
			const timeMsg = await msg.say(`Current Time: ${dateString}`);

			// Delete after sixty seconds.
			MessagesHelper.delayDelete(timeMsg, 60000);

		} catch(e) {
			console.error(e);
		}
    }
    
};