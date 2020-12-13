import PointsHelper from '../../../bot/community/features/points/pointsHelper';
import CoopCommand from '../../core/classes/coopCommand';
import ServerHelper from '../../core/entities/server/serverHelper';
import STATE from '../../state';

export default class LeaderboardCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'leaderboard',
			group: 'community',
			memberName: 'leaderboard',
			aliases: [],
			description: 'polls will always be stolen at The Coop by those who demand them.',
			details: `Details of the points command`,
			examples: ['points', 'an example of how coop-econmics functions, trickle down, sunny side up Egg & Reagonmics. Supply and demand.'],
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
			const leaderboard = await PointsHelper.getLeaderboard(position);
			const placeholderMsg = await msg.say('Calculating leaderboard, please wait.');
			const leaderboardRows = leaderboard.rows;

			const guild = ServerHelper.getByCode(STATE.CLIENT, 'PROD');
			
			// TODO: Form leaderboard text and bring into points helper
			const rowUsers = await Promise.all(leaderboardRows.map(async (row, index) => {
				let username = '?';
				try {
					const member = await guild.members.fetch(row.discord_id);
					username = member.user.username;

				} catch(e) {
					console.log('Error loading user via ID');
					console.error(e);
				}
				return {
					username,
					rank: index + position,
					points: row.points
				}
			}));

			let leaderboardMsgText = '```\n\n ~ LEADERBOARD ~ \n\n' + 
				rowUsers.map(user => `${user.rank + 1}. ${user.username} ${user.points}`).join('\n') +
				'```';

			await placeholderMsg.edit(leaderboardMsgText)

		} catch(e) {
			console.error(e);
		}
    }
    
};