import ItemsHelper from '../../community/features/items/itemsHelper';
import CoopCommand from '../../core/entities/coopCommand';
import MessagesHelper from '../../core/entities/messages/messagesHelper';
import UsersHelper from '../../core/entities/users/usersHelper';


export default class MostItemsCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'mostitems',
			group: 'items',
			memberName: 'mostitems',
			aliases: [],
			description: 'Check last message date',
			details: ``,
			examples: ['mostitems']
		});
	}

	// Find the last sacrifice time of a user.
	async run(msg) {
		super.run(msg);

		// Get user with the most items.
		const mostItems = await ItemsHelper.getBiggestWhale();

		const mostItemsUser = UsersHelper._get(mostItems.owner_id).user;

		console.log(mostItems);
		console.log(mostItemsUser);

		// Provide the result to the user.
		const msgText = `${mostItemsUser.username} has the most items (${mostItems.total}).`;
		MessagesHelper.selfDestruct(msg, msgText);
    }
    
};