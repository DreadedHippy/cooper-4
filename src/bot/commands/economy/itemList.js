import ItemsHelper from '../../../community/features/items/itemsHelper';
import CoopCommand from '../../core/classes/coopCommand';

export default class ItemListCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'itemlist',
			group: 'economy',
			memberName: 'itemlist',
			aliases: ['il', 'list'],
			description: 'Retrieves a list of usable item codes',
			details: `Details of the itemlist command`,
			examples: ['itemlist', '!itemlist'],
		});
	}

	async run(msg) {
		super.run(msg);

		const usableItems = ItemsHelper.getUsableItems().join('\n');
		const usableItemsMsgText = `Usable Items: \n ${usableItems}`;
		const listMsg = await msg.say(usableItems);

		setTimeout(() => { listMsg.delete(); }, 10000);
    }
    
};