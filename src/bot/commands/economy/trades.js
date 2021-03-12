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

			// User did not specify a preference, show default response.
			if (offerItemCode === '') {
				// Display all trades
				const allTradesStr = TradeHelper.manyTradeItemsStr(myTrades);
				return MessagesHelper.selfDestruct(msg, tradeslotStr + allTradesStr);
			
			// User attempted to provide offer item code, find only trades with that offer item.
			} else if (offerItemCode !== '' && receiveItemCode === '') {
				// Get trades based on a match.
				const matchingOffered = myTrades.filter(trade => trade.offer_item === offerItemCode);
				const matchingTradesStr = TradeHelper.manyTradeItemsStr(matchingOffered);
				return MessagesHelper.selfDestruct(msg, tradeslotStr + matchingTradesStr);				
			
			// User attempted to provide both item codes, find only matches.
			} else if (offerItemCode !== '' && receiveItemCode !== '') {
				// Get trades based on a match.
				const matchingOfferedReceived = myTrades.filter(trade => 
					trade.offer_item === offerItemCode && trade.receive_item === receiveItemCode
				);
				const matchingOfferedReceivedStr = TradeHelper.manyTradeItemsStr(matchingOfferedReceived);
				return MessagesHelper.selfDestruct(msg, tradeslotStr + matchingOfferedReceivedStr);
			}
			
		} catch(e) {
			console.log('Failed to retrieve user\'s mytrades.');
			console.error(e);
		}
    }
    
};
