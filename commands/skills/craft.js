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
			// Check if emoji and handle emoji inputs.
			itemCode = ItemsHelper.interpretItemCodeArg(itemCode);

			if (!itemCode)
				return MessagesHelper.selfDestruct(msg, `Cannot craft invalid item code. (${itemCode})`);

			// Check if item is craftable
			if (!CraftingHelper.isItemCraftable(itemCode))
				return MessagesHelper.selfDestruct(msg, `Cannot craft ${itemCode}.`);

			// Check for ingredients and multiply quantities.
			const canCraft = await CraftingHelper.canCraft(msg.author.id, itemCode, qty);
			// TODO: Improve this error.
			if (!canCraft) return MessagesHelper.selfDestruct(msg, `Insufficient crafting supplies.`);

			// Attempt to craft the object.
			const craftResult = await CraftingHelper.craft(msg.author.id, itemCode, qty);
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