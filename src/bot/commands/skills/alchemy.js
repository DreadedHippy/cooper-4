import ItemsHelper from '../../community/features/items/itemsHelper';
import CoopCommand from '../../core/entities/coopCommand';


export default class AlchemyCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'alchemy',
			group: 'skills',
			memberName: 'alchemy',
			aliases: ['alc'],
			description: 'This command lets you alchemy the items you want',
			details: `Details of the alchemy command`,
			examples: ['alchemy', '!alchemy laxative'],
			args: [
				{
					key: 'qty',
					prompt: 'How many eggs?',
					type: 'integer',
					default: 1
				},
				{
					key: 'rarity',
					prompt: 'Which rarity? (item_code)',
					type: 'string',
					default: 'AVERAGE_EGG'
				},
			],
		});
	}

	async run(msg, { qty, rarity }) {
		super.run(msg);

		// Check if emoji
		itemCode = ItemsHelper.parseFromStr(itemCode);

		msg.say(`You wanna alchemise ${qty}x${rarity}, eyyyy?`);
    }
    
};