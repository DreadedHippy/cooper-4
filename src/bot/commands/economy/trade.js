import ItemsHelper from '../../community/features/items/itemsHelper';
import CoopCommand from '../../core/entities/coopCommand';
import MessagesHelper from '../../core/entities/messages/messagesHelper';
import TradeHelper from '../../community/features/economy/tradeHelper';
import UsersHelper from '../../core/entities/users/usersHelper';
import ChannelsHelper from '../../core/entities/channels/channelsHelper';

// TODO: Move to Reactions/Message helper.
const userDesiredReactsFilter = (emojis = []) =>
	({ emoji }, user) => emojis.includes(emoji.name) && !UsersHelper.isCooper(user.id)

// TODO: Create delayAppend() method.
// 	MessagesHelper.delayEdit(confirmMsg, confirmMsg.content + `...`);
// TODO: Could potentially allow others to take the same trade with this. GME FTW.
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
					prompt: 'Which ITEM_CODE are you offering?',
					type: 'string'
				},
				{
					key: 'receiveItemCode',
					prompt: 'Which ITEM_CODE do you expect in return?',
					type: 'string'
				},
				{
					key: 'offerQty',
					prompt: 'Number quantity you are offering?',
					type: 'integer',
					default: 1
				},
				{
					key: 'receiveQty',
					prompt: 'Number quantity you expect in return?',
					type: 'integer',
					default: 1
				},
			],
		});
	}

	async run(msg, { offerItemCode, receiveItemCode, offerQty, receiveQty }) {
		super.run(msg);

		try {
			const tradeeID = msg.author.id;
			const tradeeName = msg.author.username;

			// Try to parse item codes.
			offerItemCode = ItemsHelper.parseFromStr(offerItemCode);
			receiveItemCode = ItemsHelper.parseFromStr(receiveItemCode);

			// Check if valid item codes given.
			if (!offerItemCode || !receiveItemCode) return MessagesHelper.selfDestruct(msg, 
				`Invalid item codes for trade, ${offerItemCode} ${receiveItemCode}`);
			
			// Check if user can fulfil the trade.
			const canUserFulfil = await ItemsHelper.hasQty(tradeeID, offerItemCode, offerQty);
			if (!canUserFulfil) return MessagesHelper.selfDestruct(msg, `Insufficient item quantity for trade.`);

			// Generate strings with emojis based on item codes.
			const tradeAwayStr = `${MessagesHelper._displayEmojiCode(offerItemCode)}x${offerQty}`;
			const receiveBackStr = `${MessagesHelper._displayEmojiCode(receiveItemCode)}x${receiveQty}`;

			// Check if there is an existing offer matching this specifically.
			const matchingOffers = await TradeHelper
				.matches(offerItemCode, receiveItemCode, offerQty, receiveQty);

			// Build the confirmation message string.
			let confirmStr = `**<@${tradeeID}>, trade away ` +
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
				const userReacted = users.cache.has(tradeeID);
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
					
					// Accept cheapest matching offer
					console.log('Finding cheapest:');
					console.log(matchingOffers);
					
					// const tradeAccepted = TradeHelper.accept(cheapest.id, tradeeID);
					// if (traceAccepted) {}

					// Post accepted trade to channel and record channel.
					ChannelsHelper.propagate(msg, 
						`${tradeeName} accepted a trade... ask me for more details? ;)`,
						'ACTIONS');

					// Log trade matches

				} else {
					// Use the items to create a trade, so we can assume its always fulfillable,
					//  the item becomes a trade credit note, can be converted back.
					if (await ItemsHelper.use(tradeeID, offerItemCode, offerQty)) {
						const createdOffer = await TradeHelper.create(
							tradeeID, tradeeName,
							offerItemCode, receiveItemCode,
							offerQty, receiveQty);

							
						// TODO:
						// Post the inverted accept code for it, so they can copy and paste
						// Actually, add a reaction to accept the trade, using trade logic.
						// Ideally show created offer id number and tell to use !tradeaccept ID_NUM
						ChannelsHelper.propagate(msg, 
							`${tradeeName} created a trade... ask me for more details? ;)`,
							'ACTIONS');

						// TODO: Add to trade stats
					} else {
						return MessagesHelper.selfDestruct(msg, 
							`${tradeeName} Lol, something went wrong using your items.`);
					}				
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
