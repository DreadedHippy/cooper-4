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
					key: 'offerItemCodeStr',
					prompt: 'Which item_code are you offering?',
					type: 'string',
					default: ''
				},
				{
					key: 'receiveItemCodeStr',
					prompt: 'Which item_code should you receive?',
					type: 'string',
					default: ''
				}
			],
		});
	}

	async run(msg, { offerItemCodeStr, receiveItemCodeStr }) {
		super.run(msg);

		const offerItemCode = ItemsHelper.parseFromStr(offerItemCodeStr);
		const receiveItemCode = ItemsHelper.parseFromStr(receiveItemCodeStr);

		// Check if offer item code is default (all) or valid.
		if (offerItemCodeStr !== '' && !offerItemCode)
			return MessagesHelper.selfDestruct(msg, `Invalid item code (${offerItemCodeStr}).`);

		// Check if receive item code is default (all) or valid.
		if (receiveItemCodeStr !== '' && !receiveItemCode)
			return MessagesHelper.selfDestruct(msg, `Invalid item code (${receiveItemCodeStr}).`);

		// Check for index request/all/latest.
		if (offerItemCodeStr === '') {
			// Return a list of 15 latest trades.
			const all = await TradeHelper.all();
			const allTitleStr = `**Latest 15 trade listings:**\n\n`;
			return MessagesHelper.selfDestruct(msg, allTitleStr + TradeHelper.manyTradeItemsStr(all));

		} else if (offerItemCodeStr !== '' && receiveItemCodeStr !== '') {
			// If receive item code has been given, make sure only those matching returned.
			const matches = await TradeHelper.findOfferReceiveMatches(offerItemCode, receiveItemCode);
			
			// Return no matching trades warning.
			if (matches.length === 0) {
				const noMatchesStr = `No existing trades exchanging ${offerItemCode} for ${receiveItemCode}`;
				return MessagesHelper.selfDestruct(msg, noMatchesStr);

			// Return matching trades.
			} else {
				// Format and present the matches if they exist.
				const matchesTitleStr = `**Trades exchanging ${offerItemCode} for ${receiveItemCode}:**\n\n`;
				const matchesStr = TradeHelper.manyTradeItemsStr(matches);
				return MessagesHelper.selfDestruct(msg, matchesTitleStr + matchesStr);
			}

		} else if (offerItemCodeStr !== '' && receiveItemCodeStr === '') {
			// If only offer item given, list all of that type.
			const types = await TradeHelper.findReceiveMatches(offerItemCode);

			// Return no matching trades types warning.
			if (types.length === 0) {
				const noTypesStr = `No existing trades offering ${offerItemCode}`
				return MessagesHelper.selfDestruct(msg, noTypesStr);

			// Return matching trades.
			} else {
				// Format and present the matches if they exist.
				const typesTitleStr = `**Trades requiring your ${offerItemCode}:**\n\n`;
				const typesStr = TradeHelper.manyTradeItemsStr(types);
				return MessagesHelper.selfDestruct(msg, typesTitleStr + typesStr);
			}
		}

    }
    
};