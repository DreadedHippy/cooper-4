import ItemsHelper from '../../community/features/items/itemsHelper';
import CoopCommand from '../../core/entities/coopCommand';
import MessagesHelper from '../../core/entities/messages/messagesHelper';
import TradeHelper from '../../community/features/economy/tradeHelper';
import UsersHelper from '../../core/entities/users/usersHelper';
import ChannelsHelper from '../../core/entities/channels/channelsHelper';

// TODO: Move to Reactions/Message helper.
const userDesiredReactsFilter = (emojis = []) =>
	({ emoji }, user) => emojis.includes(emoji.name) && !UsersHelper.isCooper(user.id)


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
			// Try to parse item codes.
			offerItemCode = ItemsHelper.parseFromStr(offerItemCode);
			receiveItemCode = ItemsHelper.parseFromStr(receiveItemCode);

			// Check if valid item codes given.
			if (!offerItemCode || !receiveItemCode) return MessagesHelper.selfDestruct(msg, 
				`Invalid item codes for trade, ${offerItemCode} ${receiveItemCode}`);
			
			// Check if user can fulfil the trade.
			const canUserFulfil = await ItemsHelper.hasQty(msg.author.id, offerItemCode, offerQty);
			if (!canUserFulfil) return MessagesHelper.selfDestruct(msg, `Insufficient item quantity for trade.`);

			// Generate strings with emojis based on item codes.
			const tradeAwayStr = `${MessagesHelper._displayEmojiCode(offerItemCode)}x${offerQty}`;
			const receiveBackStr = `${MessagesHelper._displayEmojiCode(receiveItemCode)}x${receiveQty}`;

			// Check if there is an existing offer matching this specifically.
			const matchingOffers = await TradeHelper
				.matches(offerItemCode, receiveItemCode, offerQty, receiveQty);

			// Build the confirmation message string.
			let confirmStr = `**<@${msg.author.id}>, trade away ` +
				`${tradeAwayStr} in return for ${receiveBackStr}?** \n\n` +
				`<- ${tradeAwayStr}\n` +
				`-> ${receiveBackStr}`;
			if (matchingOffers) confirmStr += `\n\n_Matching offers detected._`;

			// Post the confirmation message and add reactions to assist interaction.
			const confirmMsg = await MessagesHelper.selfDestruct(msg, confirmStr, 333, 45000);
			MessagesHelper.delayReact(confirmMsg, '❎', 666);
			MessagesHelper.delayReact(confirmMsg, '✅', 999);

			// Setup the reaction collector for trade confirmation interaction handling.
			const interactions = await confirmMsg.awaitReactions(
				userDesiredReactsFilter(['❎', '✅']), 
				{ max: 1, time: 30000, errors: ['time'] } );

			// Check reaction is from user who asked, if restricting confirmation to original.
			const confirmation = interactions.reduce((acc, { emoji, users }) => {
				// TODO: Refactor this line to Reaction helper
				const userReacted = users.cache.has(msg.author.id);
				if (emoji.name === '✅' && userReacted) return acc = true;
				else return acc;
			}, false);
			
			console.log(interactions);
			console.log(matchingOffers);
			console.log(confirmation);

			if (confirmation) {
				// Move this down later to after cheapest offer found.
				MessagesHelper.delayEdit(confirmMsg, 
					'Trade confirmed, who with? Show amounts again, link to ACTIONS channel so they can view again/later'
				);
				console.log('Trade confirmed');

				// Log confirmed trades

				if (matchingOffers.length > 0) {
					// Log trade matches

					// Accept cheapest matching offer
					console.log('Finding cheapest:');
					console.log(matchingOffers);

				} else {
					// Create open_trade and log to actions
					// TODO: Add to trade stats 

					ChannelsHelper._postToChannelCode('ACTIONS', 
						`${msg.author.username} created a trade... ask me for more details? ;)`)

						const createdOffer = await TradeHelper.create(
							msg.author.id,
							msg.author.username,
							offerItemCode,
							receiveItemCode,
							offerQty,
							receiveQty
						);

						// TODO:
						// Post the inverted accept code for it, so they can copy and paste
						// Actually, add a reaction to accept the trade, using trade logic.
				}

			} else {
				// Log cancelled trades
				console.log('Trade cancelled');
				// Trade cancelled, remove message.
				MessagesHelper.delayDelete(confirmMsg);
			}
			
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

			// if (matchingOffers.length > 0) 
			// 	// TODO: Create delayAppend() method.
			// 	MessagesHelper.delayEdit(
			// 		confirmMsg, 
			// 		confirmMsg.content + `\n\n_Matching offers detected._`
			// 	);

			// TODO: Could potentially allow others to take the same trade with this. GME FTW.

			// TODO: Ensure trades expire, may need a new date/time on open_trades table.