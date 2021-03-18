import ItemsHelper from '../../community/features/items/itemsHelper';
import CoopCommand from '../../core/entities/coopCommand';
import MessagesHelper from '../../core/entities/messages/messagesHelper';
import UsersHelper from '../../core/entities/users/usersHelper';


export default class RichestCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'richest',
			group: 'items',
			memberName: 'richest',
			aliases: [],
			description: 'Check last message date',
			details: ``,
			examples: ['richest']
		});
	}

	// Find the last sacrifice time of a user.
	async run(msg) {
		super.run(msg);

		// Get user with the most items.
		const mostItems = await ItemsHelper.getBiggestWhale();
		const mostItemsUser = UsersHelper._get(mostItems.owner_id).user;

		// Provide the result to the user.
		const emoji = MessagesHelper._displayEmojiCode('GOLD_COIN');
		const msgText = `${mostItemsUser.username} is the richest member (${mostItems.total}x${emoji}).`;
		MessagesHelper.selfDestruct(msg, msgText);
    }
    
};