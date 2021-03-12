import TradeHelper from '../../community/features/economy/tradeHelper';
import ItemsHelper from '../../community/features/items/itemsHelper';
import CoopCommand from '../../core/entities/coopCommand';
import MessagesHelper from '../../core/entities/messages/messagesHelper';

export default class TradeFindCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'tradefind',
			group: 'economy',
			memberName: 'tradefind',
			aliases: ['findtr'],
			description: 'This command lets you find the trades you want',
			details: `Details of the tradefind command`,
			examples: ['tradefind', '!tradefind laxative'],
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

		offerItemCode = ItemsHelper.parseFromStr(offerItemCode);
		receiveItemCode = ItemsHelper.parseFromStr(receiveItemCode);

		// Check for index request/all/latest.
		if (offerItemCode === '') {
			// Return a list of 15 latest trades.
			const all = await TradeHelper.all();
			const firstFifteenTrades = all.map(trade => `${TradeHelper.tradeItemsStr(trade)}\n\n`);
			return MessagesHelper.selfDestruct(msg, firstFifteenTrades);

		} else if (receiveItemCode && receiveItemCode !== '') {
			// If receive item code has been given, make sure only those matching returned.
			const matches = await TradeHelper.findOfferReceiveMatches(offerItemCode, receiveItemCode);
			
			// Return no matching trades warning.
			if (matches.length === 0) {
				const noMatchesStr = `No existing trades exchanging ${offerItemCode} for ${receiveItemCode}`;
				return MessagesHelper.selfDestruct(msg, noMatchesStr);

			// Return matching trades.
			} else {
				// Format and present the matches if they exist.
				const matchesStr = TradeHelper.manyTradeItemsStr(matches);
				return MessagesHelper.selfDestruct(msg, matchesStr);
			}

		} else {
			// If only offer item given, list all of that type.
			const types = await TradeHelper.findReceiveMatches(offerItemCode);

			// Return no matching trades types warning.
			if (types.length === 0) {
				const noTypesStr = `No existing trades offering ${offerItemCode}`
				return MessagesHelper.selfDestruct(msg, noTypesStr);

			// Return matching trades.
			} else {
				// Format and present the matches if they exist.
				const typesStr = TradeHelper.manyTradeItemsStr(types);
				return MessagesHelper.selfDestruct(msg, typesStr);
			}
		}

    }
    
};