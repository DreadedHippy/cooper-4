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
					default: ''
				},
				{
					key: 'receiveItemCode',
					prompt: 'Which item_code should you receive?',
					type: 'string',
					default: ''
				}
			],
		});
	}

	async run(msg, { offerItemCode, receiveItemCode }) {
		super.run(msg);

		try {
			// Load trades for that user.
			const myTrades = await TradeHelper.getByTrader(msg.author.id);
			

			// TODO: Filter out invalid item codes before they cause major issues.



			// Calculate used/total trade slots.
			// TODO: Implement trade slots as a separate command.
			const tradeslotStr = `${msg.author.username} has ${myTrades.length}/5 active trades slots.\n\n`;

			// Distinguish between whether the user wants all trade information of a specific one.
			if (offerItemCode === '') {
				// Display all trades
				const allTradesStr = myTrades.map(trade => `${TradeHelper.tradeItemsStr(trade)}\n\n`)
				return MessagesHelper.selfDestruct(msg, tradeslotStr + allTradesStr);
			
			}else if (offerItemCode !== '' && receiveItemCode === '') {
				// Get trades based on a match.
				const matchingTradesStr = myTrades.map(trade => {
					if (trade.offer_item === offerItemCode)
						return `${TradeHelper.tradeItemsStr(trade)}\n\n`;
					else 
						return '';
				});
				return MessagesHelper.selfDestruct(msg, tradeslotStr + matchingTradesStr);				
			} else if (offerItemCode !== '' && receiveItemCode !== '') {
				// Get trades based on a match.
				const matchingTradesStr = myTrades.map(trade => {
					if (trade.offer_item === offerItemCode && trade.receive_item === receiveItemCode)
						return `${TradeHelper.tradeItemsStr(trade)}\n\n`;
					else 
						return '';
				});
				return MessagesHelper.selfDestruct(msg, tradeslotStr + matchingTradesStr);
			}
			
		} catch(e) {
			console.log('Failed to retrieve user\'s mytrades.');
			console.error(e);
		}
    }
    
};
