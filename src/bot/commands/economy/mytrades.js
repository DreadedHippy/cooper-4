import ItemsHelper from '../../community/features/items/itemsHelper';
import CoopCommand from '../../core/entities/coopCommand';
import MessagesHelper from '../../core/entities/messages/messagesHelper';
import TradeHelper from '../../community/features/economy/tradeHelper';

export default class MyTradesCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'mytrades',
			group: 'economy',
			memberName: 'mytrades',
			aliases: ['mytr'],
			description: 'This command lets you mytrades the items you own',
			details: `Details of the mytrades command`,
			examples: ['mytrades', '!mytrades laxative'],
			args: [
				{
					key: 'offerItemCode',
					prompt: 'Which item_code are you offering?',
					type: 'string',
					default: 'ALL'
				},
			],
		});
	}

	async run(msg, { offerItemCode }) {
		super.run(msg);

		try {
			// Calculate used/total trade slots.
			const tradeslotStr = `${msg.author.username} have ?/? trade slots currently.`;
			await MessagesHelper.selfDestruct(msg, tradeslotStr);


			if (offerItemCode === 'ALL') {
				// Display all trades

			} else {
				// Get trades by a certain item code
			}
			
		} catch(e) {
			console.log('Failed to retrieve user\'s mytrades.');
			console.error(e);
		}
    }
    
};
