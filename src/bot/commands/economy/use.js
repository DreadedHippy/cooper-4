import FlareHandler from '../../../community/features/items/handlers/flareHandler';
import LaxativeHandler from '../../../community/features/items/handlers/laxativeHandler';
import ItemsHelper from '../../../community/features/items/itemsHelper';
import CoopCommand from '../../core/classes/coopCommand';


export default class UseCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'use',
			group: 'economy',
			memberName: 'use',
			aliases: ['u'],
			description: 'This command lets you use the items you own',
			details: `Details of the use command`,
			examples: ['use', '!use laxative'],
			args: [
				{
					key: 'itemCode',
					prompt: 'What is the code of the item you wish to use? !itemlist if not sure',
					type: 'string'
				},
			],
		});
	}

	async run(msg, { itemCode }) {
		super.run(msg);

		const usableItems = ItemsHelper.getUsableItems();
		const noMatchErrText = 'Please provide a valid item name or check with !itemlist';
		if (!usableItems.includes(itemCode)) return msg.reply(noMatchErrText);

		// Item is usable, therefore use it.
		if (itemCode === 'LAXATIVE') LaxativeHandler.use(msg, msg.author);
		if (itemCode === 'FLARE') FlareHandler.use(msg, msg.author);
    }
    
};