import ItemsHelper from '../../community/features/items/itemsHelper';
import CoopCommand from '../../core/entities/coopCommand';
import MessagesHelper from '../../core/entities/messages/messagesHelper';
import TradeHelper from '../../community/features/economy/tradeHelper';


// TODO: Ensure trades expire, may need a new date/time on open_trades table.

export default class TradeCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'trade',
			group: 'economy',
			memberName: 'trade',
			aliases: ['tr'],
			description: 'This command lets you trade the items you own',
			details: `Details of the trade command`,
			examples: ['trade', '!trade laxative'],
			args: [
				{
					key: 'offerItemCode',
					prompt: 'Which item_code are you offering?',
					type: 'string'
				},
				{
					key: 'receiveItemCode',
					prompt: 'Which item_code are you offering?',
					type: 'string'
				},
				{
					key: 'offerQty',
					prompt: 'How many are you offering?',
					type: 'integer',
					default: 1
				},
				{
					key: 'receiveQty',
					prompt: 'How many are you offering?',
					type: 'integer',
					default: 1
				},
			],
		});
	}

	async run(msg, { offerItemCode, receiveItemCode, offerQty, receiveQty }) {
		super.run(msg);

		try {
			offerItemCode = ItemsHelper.parseFromStr(offerItemCode);
			receiveItemCode = ItemsHelper.parseFromStr(receiveItemCode);

			// Add emojis
			const tradeAwayStr = `${MessagesHelper._displayEmojiCode(offerItemCode)}x${offerQty}`;
			const receiveBackStr = `${MessagesHelper._displayEmojiCode(receiveItemCode)}x${receiveQty}`;

			const confirmStr = `**<@${msg.author.id}>, trade away ` +
				`${tradeAwayStr} in return for ${receiveBackStr}?** \n\n` +
				`<- ${tradeAwayStr}\n` +
				`-> ${receiveBackStr}`;

			const confirmMsg = await MessagesHelper.selfDestruct(msg, confirmStr, 333, 45000);
			MessagesHelper.delayReact(confirmMsg, '❎', 666);
			MessagesHelper.delayReact(confirmMsg, '✅', 999);

			// Check if there is an existing offer matching this specifically.
			const matchingOffers = await TradeHelper.findOfferReceiveMatchesQty(
				offerItemCode, 
				receiveItemCode, 
				offerQty,
				receiveQty
			);

			// Give some feedback to the original message which requires confirmation.
			if (matchingOffers.length > 0) 
				// TODO: Create delayAppend() method.
				MessagesHelper.delayEdit(
					confirmMsg, 
					confirmMsg.content + `\n\n_Matching offers detected._`
				);

			// TODO: Could potentially allow others to take the same trade with this. GME FTW.
			const interactions = await confirmMsg.awaitReactions(
				({ emoji }) => ['❎', '✅'].includes(emoji.name), 
				{ max: 1, time: 30000, errors: ['time'] }
			);

			const confirmation = interactions.reduce((acc, react) => {
				// if (react.emoji.name === '✅' && react.author.id)
				// Check reaction is from user who asked, if restricting confirmation to original.

				console.log(react);

				if (react.emoji.name === '✅') return acc = true;
				return acc;
			}, false);
			
			console.log(interactions);
			console.log(matchingOffers);
			console.log(confirmation);

			
			// collected.size
	
		} catch(e) {
			console.log('Failed to trade item.');
			console.error(e);
		}
    }
    
};





	// Edit to confirm cancelled, then delete.
	// Delete the trade message, since rejected.


	// TODO: Make this a temp message.

	// Inform the user if they don't have that many items to trade away.
	// if () {}

	// TODO: Update message if match found before confirmation.


	// if (matchingOffers) {
	// 	// TODO: Notify actions the trade is accepted.
	// }

	// // 

	// // If there is no existing offer, create one.
	// if (matchingOffers.length === 0) {
	// 	const createdOffer = await TradeHelper.create(
	// 		msg.author.id,
	// 		msg.author.username,
	// 		offerItemCode,
	// 		receiveItemCode,
	// 		offerQty,
	// 		receiveQty
	// 	)

	// 	console.log(createdOffer);

	// 	// TODO: Notify actions the trade is added.
	// }


// // Check if this item code can be given.
// if (!ItemsHelper.isUsable(itemCode) || itemCode === null) 
// const targetMember = UsersHelper.getMemberByID(guild, target.id);
// const itemQty = await ItemsHelper.getUserItemQty(msg.author.id, itemCode);
// 	return MessagesHelper.selfDestruct(msg, `You do not own enough ${itemCode}. ${itemQty}/${qty}`, 10000);
// if (await ItemsHelper.use(msg.author.id, itemCode, qty)) {
// 	await ItemsHelper.add(target.id, itemCode, qty);
// 	ChannelsHelper.propagate(msg, `${msg.author.username} gave ${target.username} ${itemCode}x${qty}.`, 'ACTIONS');

