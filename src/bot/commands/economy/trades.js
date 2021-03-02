import ItemsHelper from '../../community/features/items/itemsHelper';
import CoopCommand from '../../core/entities/coopCommand';
import MessagesHelper from '../../core/entities/messages/messagesHelper';
import TradeHelper from '../../community/features/economy/tradeHelper';

export default class TradesCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'trades',
			group: 'economy',
			memberName: 'trades',
			aliases: ['mytr'],
			description: 'This command lets you check your ongoing trades',
			details: `Details of the trades command`,
			examples: ['trades', '!trades LAXATIVE'],
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
			const tradeslotStr = `${msg.author.username} has ?/? available trade slots currently.`;
			await MessagesHelper.selfDestruct(msg, tradeslotStr);

			// Distinguish between whether the user wants all trade information of a specific one.
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
