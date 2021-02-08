import ItemsHelper from '../../community/features/items/itemsHelper';
import CraftingHelper from '../../community/features/skills/crafting/craftingHelper';
import ChannelsHelper from '../../core/entities/channels/channelsHelper';
import CoopCommand from '../../core/entities/coopCommand';
import MessagesHelper from '../../core/entities/messages/messagesHelper';


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

		try {
			// TODO: Check if emoji and handle emoji inputs.
			const itemMatches = ItemsHelper.parseItemCodes(itemCode);
			if (itemMatches.length === 0) 
				return MessagesHelper.selfDestruct(msg, `Cannot craft invalid item code.`);

			// Check if item is craftable
			const craftItemCode = itemMatches[0];
			if (!CraftingHelper.isItemCraftable(craftItemCode))
				return MessagesHelper.selfDestruct(msg, `Cannot craft ${craftItemCode}.`);

			// Check for ingredients and multiply quantities.
			const canCraft = await CraftingHelper.canCraft(msg.author.id, craftItemCode, qty);
			// TODO: Improve this error.
			if (!canCraft) return MessagesHelper.selfDestruct(msg, `Insufficient crafting supplies.`);

			// Attempt to craft the object.
			const craftResult = await CraftingHelper.craft(msg.author.id, craftItemCode, qty);
			if (craftResult) {
				const addText = `${msg.author.username} crafted ${itemCode}x${qty}.`;
				ChannelsHelper.propagate(msg, addText, 'ACTIONS');
			} else {
				MessagesHelper.selfDestruct(msg, `You failed to craft ${qty}x${itemCode}...`);
			}

		} catch(e) {
			console.log('Error crafting item.');
			console.error(e);
		}
    }
    
};