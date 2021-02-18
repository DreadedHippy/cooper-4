import ItemsHelper from '../../../bot/community/features/items/itemsHelper';
import CoopCommand from '../../core/entities/coopCommand';
import MessagesHelper from '../../core/entities/messages/messagesHelper';

export default class ItemsCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'items',
			group: 'economy',
			memberName: 'items',
			aliases: ['eggs', 'inv', 'inventory', 'i'],
			description: 'polls will always be stolen at The Coop by those who demand them.',
			details: `Details of the items command`,
			examples: ['items', 'an example of how coop-econmics functions, trickle down, sunny side up Egg & Reagonmics. Supply and demand.'],
			args: [
				{
					key: 'targetUser',
					prompt: 'Whose items are you trying to check?',
					type: 'user',
					default: ''
				},
				{
					key: 'itemCode',
					prompt: 'Which item code (default ALL)?',
					type: 'string',
					default: 'ALL'
				},
			]
		});
	}

	async run(msg, { targetUser, itemCode }) {
		super.run(msg);

		if (msg.mentions.users.first()) targetUser = msg.mentions.users.first();
		if (!targetUser) targetUser = msg.author;
		
        try {
			const name = targetUser.username;

			// Retrieve all item counts that user owns.
			if (itemCode === 'ALL') {
				const noItemsMsg = `${name} does not own any items.`;
				const items = await ItemsHelper.getUserItems(targetUser.id);
				if (items.length === 0) return MessagesHelper.selfDestruct(msg, noItemsMsg);
				else {
					const itemDisplayMsg = ItemsHelper.formItemDropText(targetUser, items.rows);
					return MessagesHelper.selfDestruct(msg, itemDisplayMsg, 666, 30000);
				}

				// Check a specific item instead.
			} else {
				const noneOfItemMsg = `${name} does not own ${itemCode}.`;
				const itemQty = await ItemsHelper.getUserItemQty(targetUser.id, itemCode);
				if (itemQty > 0) return MessagesHelper.selfDestruct(msg, noneOfItemMsg);
				else return MessagesHelper.selfDestruct(msg, `${name} owns ${itemQty}x${itemCode}.`);
			}

        } catch(err) {
            console.error(err);
        }
    }
    
};