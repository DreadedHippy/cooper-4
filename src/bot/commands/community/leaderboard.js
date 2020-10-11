import { Command } from 'discord.js-commando';
import PointsHelper from '../../../community/features/points/pointsHelper';
import CoopCommand from '../../core/classes/coopCommand';



export default class PointsCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'leaderboard',
			group: 'community',
			memberName: 'leaderboard',
			aliases: [],
			description: 'polls will always be stolen at The Coop by those who demand them.',
			details: `Details of the points command`,
			examples: ['points', 'an example of how coop-econmics functions, trickle down, sunny side up Egg & Reagonmics. Supply and demand.'],
		});
	}

	async run(msg) {
		super.run(msg);

		try {
			// Leaderboard position can either be:
			// None: show top 10
			// User: show user position and 5 either side
			// Number: show rank number and 5 either side
			const leaderboard = await PointsHelper.getLeaderboard();

		} catch(e) {
			console.error(e);
		}
    }
    
};