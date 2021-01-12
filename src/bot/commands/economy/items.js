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
					default: null
				},
			]
		});
	}

	async run(msg, { targetUser }) {
		super.run(msg);

		if (msg.mentions.users.first()) targetUser = msg.mentions.users.first();
		if (!targetUser) targetUser = msg.author;


        try {
			const noItemsMsg = `${targetUser.username} does not own any items.`;
			const items = await ItemsHelper.getUserItems(targetUser.id);
			
			if (items.rows.length === 0) await msg.say(noItemsMsg);
			else {
				const itemDisplayMsg = ItemsHelper.formItemDropText(targetUser, items.rows);
				MessagesHelper.selfDestruct(msg, itemDisplayMsg, 666, 30000);
			}

        } catch(err) {
            console.error(err);
        }
    }
    
};