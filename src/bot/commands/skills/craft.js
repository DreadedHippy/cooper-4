import ItemsHelper from '../../community/features/items/itemsHelper';
import CoopCommand from '../../core/entities/coopCommand';


export default class CraftCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'craft',
			group: 'skills',
			memberName: 'craft',
			aliases: ['c'],
			description: 'This command lets you craft the items you want',
			details: `Details of the craft command`,
			examples: ['craft', '!craft laxative'],
			args: [
				{
					key: 'itemCode',
					prompt: 'What is the code of the item you wish to use? !itemlist if not sure',
					type: 'string'
				},
				{
					key: 'qty',
					prompt: 'How many do you want to craft?',
					type: 'integer',
					default: 1
				},
			],
		});
	}

	async run(msg, { itemCode, qty }) {
		super.run(msg);


		// Check if emoji
		itemCode = ItemsHelper.parseFromStr(itemCode);

		msg.say(`You wanna craft ${qty}x${itemCode}, eyyyy?`);
    }
    
};