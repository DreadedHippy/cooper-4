import PointsHelper from '../../../community/features/points/pointsHelper';
import CoopCommand from '../../core/classes/coopCommand';

export default class SacrificeCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'sacrifice',
			group: 'community',
			memberName: 'sacrifice',
			aliases: [],
			description: 'The command for starting a round of sacrifices.',
			details: `Details of the points command`,
			examples: ['points', 'an example of how coop-econmics functions, trickle down, sunny side up Egg & Reagonmics. Supply and demand.'],
		});
	}

	async run(msg) {
		super.run(msg);

		try {
			await msg.say('Add sacrifice message.');

		} catch(e) {
			console.error(e);
		}
    }
    
};