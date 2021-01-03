import ItemsHelper from '../../community/features/items/itemsHelper';
import CoopCommand from '../../core/classes/coopCommand';
import MessagesHelper from '../../core/entities/messages/messagesHelper';

export default class ItemTotalCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'itemtotal',
			group: 'economy',
			memberName: 'itemtotal',
			aliases: ['it'],
			description: 'polls will always be stolen at The Coop by those who demand them.',
			details: `Details of the itemtotal command`,
			examples: ['itemtotal', 'an example of how coop-econmics functions, trickle down, sunny side up Egg & Reagonmics. Supply and demand.'],
			args: [
				{
					key: 'itemCode',
					prompt: 'Give the item code/name you want to check.',
					type: 'string'
				},
			]
		});
	}

	async run(msg, { itemCode }) {
		super.run(msg);

		if (!ItemsHelper.getUsableItems().includes(itemCode))
			return msg.reply(`${itemCode} does not exist, please provide a valid item code.`);

		const total = ItemsHelper.count(itemCode);

		const feedbackMsg = await msg.say(`Economic circulation: ${total}x${itemCode}.`);
		MessagesHelper.delayDelete(feedbackMsg, 15000);
    }
    
};