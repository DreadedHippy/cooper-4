import PointsHelper from '../../community/features/points/pointsHelper';
import CoopCommand from '../../core/entities/coopCommand';
import MessagesHelper from '../../core/entities/messages/messagesHelper';
import UsersHelper from '../../core/entities/users/usersHelper';


export default class MostPointsCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'mostpoints',
			group: 'items',
			memberName: 'mostpoints',
			aliases: [],
			description: 'Check the user with the most points',
			details: ``,
			examples: ['mostpoints']
		});
	}

	// Find the last sacrifice time of a user.
	async run(msg) {
		super.run(msg);

		// Get user with the most items.
		const mostPoints = await PointsHelper.getHighest();

		const mostPointsUser = UsersHelper._get(mostPoints.owner_id).user;

		// Provide the result to the user.
		const msgText = `${mostPointsUser.username} has the most points (${mostPoints.quantity}).`;
		MessagesHelper.selfDestruct(msg, msgText);
    }
    
};