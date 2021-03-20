import PointsHelper from '../../community/features/points/pointsHelper';
import CoopCommand from '../../core/entities/coopCommand';
import MessagesHelper from '../../core/entities/messages/messagesHelper';


export default class LeaderboardCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'leaderboard',
			group: 'community',
			memberName: 'leaderboard',
			aliases: [],
			description: 'polls will always be stolen at The Coop by those who demand them.',
			details: `Details of the points command`,
			examples: ['points', 'an example of how coop-economics functions, trickle down, sunny side up Egg & Reaganonmics. Supply and demand.'],
			args: [
				{
					key: 'position',
					prompt: 'What rank position to look around?',
					type: 'integer',
					default: 0
				},
			],
		});
	}

	async run(msg, { position }) {
		super.run(msg);

		try {
			// Leaderboard position can either be:
			// None: show top 15
			// User: show user position and 5 either side
			// Number: show rank number and 5 either side
			const leaderboardRows = await PointsHelper.getLeaderboard(position);
			const placeholderMsg = await msg.say('Calculating leaderboard, please wait.');
			const leaderboardMsgText = await PointsHelper.renderLeaderboard(leaderboardRows, position);
			const leaderboardMsg = await placeholderMsg.edit(leaderboardMsgText)

			// Delete after sixty seconds.
			MessagesHelper.delayDelete(leaderboardMsg, 60000);

		} catch(e) {
			console.error(e);
		}
    }
    
};