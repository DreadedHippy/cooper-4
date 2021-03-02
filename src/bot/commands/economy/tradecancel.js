import ItemsHelper from '../../community/features/items/itemsHelper';
import CoopCommand from '../../core/entities/coopCommand';
import MessagesHelper from '../../core/entities/messages/messagesHelper';
import TradeHelper from '../../community/features/economy/tradeHelper';
import UsersHelper from '../../core/entities/users/usersHelper';


export default class TradeCancelCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'tradecancel',
			group: 'economy',
			memberName: 'tradecancel',
			aliases: [],
			description: 'This command lets you tradecancel the items you own',
			details: `Details of the tradecancel command`,
			examples: ['tradecancel', '!tradecancel LAXATIVE AVERAGE_EGG 1 5'],
			args: [
				{
					key: 'tradeID',
					prompt: 'Accept which trade #ID?',
					type: 'string'
				},
			],
		});
	}

	async run(msg, { tradeID }) {
		super.run(msg);

		try {
			const tradeeID = msg.author.id;
			const tradeeName = msg.author.username;

			// Check if valid trade ID given.
			const trade = await TradeHelper.get(tradeID);
			if (!trade) return MessagesHelper.selfDestruct(msg, `Invalid trade ID - already sold?`);
			
			// Check if user can fulfil the trade.
			const hasEnough = await ItemsHelper.hasQty(tradeeID, trade.receive_item, trade.receive_qty);
			if (!hasEnough) return MessagesHelper.selfDestruct(msg, `Insufficient offer quantity for trade.`);

			// Let helper handle accepting logic as it's used in multiple places so far.
			const tradeAccepted = await TradeHelper.accept(tradeID, tradeeID, tradeeName);
			if (tradeAccepted) {
				MessagesHelper.selfDestruct(msg, 'Trade accepted.');
			} else {
				// Log cancelled trades
				MessagesHelper.selfDestruct(msg, 'Trade could not be accepted.');
				console.log('Trade accept failed');
			}
			
		} catch(e) {
			console.log('Failed to trade item.');
			console.error(e);
		}
    }
    
};
