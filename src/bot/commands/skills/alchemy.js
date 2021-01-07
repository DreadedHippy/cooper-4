import { drop } from 'lodash';
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
					default: 100
				},
				{
					key: 'itemCode',
					prompt: 'Which rarity? (item_code)',
					type: 'string',
					default: 'AVERAGE_EGG'
				},
			],
		});
	}

	async run(msg, { qty, itemCode }) {
		super.run(msg);

		const alcQty = parseInt(qty);

		// Check if emoji
		itemCode = ItemsHelper.parseFromStr(itemCode);

		let rarity = null;
		if (itemCode === 'AVERAGE_EGG') rarity = 'AVERAGE';
		if (itemCode === 'RARE_EGG') rarity = 'RARE';
		if (itemCode === 'LEGENDARY_EGG') rarity = 'LEGENDARY';

		console.log(alcQty, itemCode, rarity);

		const drop = DropTable.getRandomTieredWithQty(rarity);

		const testStr = `You wanna alchemise ${qty}x${itemCode}, eyyyy? `;
		if (drop) testStr += `You may have won ${drop.qty}x${drop.item}`;
		msg.say(testStr);

		// if (itemCode && rarity) {
		// 	const ownedQty = await ItemsHelper.getUserItemQty(msg.author.id, itemCode);
		// 	if (ownedQty >= alcQty) {
		// 		const didUse = await ItemsHelper.use(msg.author.id, itemCode);
		// 		if (didUse) {
		// 			const drop = DropTable.getRandomTieredWithQty(rarity);
					

		// 		} else {
	
		// 		}

		// 		msg.say(`You wanna alchemise ${qty}x${rarity}, eyyyy? You may have won ${drop.qty}x${drop.item}`);
		// 	}
		// }
    }
    
};