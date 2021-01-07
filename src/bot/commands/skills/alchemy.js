import DropTable from '../../community/features/items/droptable';
import ItemsHelper from '../../community/features/items/itemsHelper';
import CoopCommand from '../../core/entities/coopCommand';


export default class AlchemyCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'alchemy',
			group: 'skills',
			memberName: 'alchemy',
			aliases: ['alc'],
			description: 'Alchemise various eggs, we\'re not yolking.',
			details: ``,
			examples: ['alchemy', '!alchemy 100 RARE_EGG'],
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
		rarity = ItemsHelper.parseFromStr(rarity);

		// Implement drop table: DropTable.getRandomWithQty()

		msg.say(`You wanna alchemise ${qty}x${rarity}, eyyyy?`);
    }
    
};