import ItemsHelper from '../../community/features/items/itemsHelper';
import CoopCommand from '../../core/entities/coopCommand';
import MessagesHelper from '../../core/entities/messages/messagesHelper';
import ChannelsHelper from '../../core/entities/channels/channelsHelper';
import ServerHelper from '../../core/entities/server/serverHelper';
import UsersHelper from '../../core/entities/users/usersHelper';
import STATE from '../../state';

export default class GiveCommand extends CoopCommand {

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
				`-> ${tradeAwayStr}\n` +
				`<- ${receiveBackStr}`;

			// TODO: Make this a temp message.

			// Inform the user if they don't have that many items to trade away.
			// if () {}

			const confirmMsg = await MessagesHelper.selfDestruct(msg, confirmStr, 333, 45000);
			MessagesHelper.delayReact(confirmMsg, '❎', 666);
			MessagesHelper.delayReact(confirmMsg, '✅', 999);
			

			// Check if there is an existing offer for this then accept.

			// If there is no existing offer, create one.


			// TODO: Notify actions the trade is added.

			

			// // Check if this item code can be given.
			// if (!ItemsHelper.isUsable(itemCode) || itemCode === null) 
			// const targetMember = UsersHelper.getMemberByID(guild, target.id);
			// const itemQty = await ItemsHelper.getUserItemQty(msg.author.id, itemCode);
			// 	return MessagesHelper.selfDestruct(msg, `You do not own enough ${itemCode}. ${itemQty}/${qty}`, 10000);
			// if (await ItemsHelper.use(msg.author.id, itemCode, qty)) {
			// 	await ItemsHelper.add(target.id, itemCode, qty);
			// 	ChannelsHelper.propagate(msg, `${msg.author.username} gave ${target.username} ${itemCode}x${qty}.`, 'ACTIONS');
		} catch(e) {
			console.log('Failed to trade item.');
			console.error(e);
		}
    }
    
};