import ItemsHelper from '../../../bot/community/features/items/itemsHelper';
import CoopCommand from '../../core/entities/coopCommand';
import MessagesHelper from '../../core/entities/messages/messagesHelper';
import EMOJIS from '../../../bot/core/config/emojis.json';

export default class DropCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'drop',
			group: 'economy',
			memberName: 'drop',
			aliases: ['d'],
			description: 'This command lets you drop the items you own',
			details: `Details of the drop command`,
			examples: ['drop', '!drop laxative'],
			args: [
				{
					key: 'itemCode',
					prompt: 'What is the code of the item you wish to drop? Use !items if not sure',
					type: 'string'
				},
			],
		});
	}

	async run(msg, { itemCode }) {
		super.run(msg);

		itemCode = ItemsHelper.parseFromStr(itemCode);

		const usableItems = ItemsHelper.getUsableItems();
		const noMatchErrText = 'Please provide a valid item name.';
		if (!usableItems.includes(itemCode)) return msg.reply(noMatchErrText);

		// Check user owns it, nvm... let ItemsHelper do that.
		// ItemsHelper.dropItem(msg.author.id, itemCode);

		const dropMsg = await msg.reply(EMOJIS[itemCode]);
		MessagesHelper.delayReact(dropMsg, EMOJIS.DROPPED, 666);

		
    }
    
};