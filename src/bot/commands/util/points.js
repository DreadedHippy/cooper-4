import { Command } from 'discord.js-commando';
import PointsHelper from '../../../community/features/points/pointsHelper';
import CoopCommand from '../../core/classes/coopCommand';



export default class PointsCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'points',
			group: 'util',
			memberName: 'points',
			aliases: [],
			description: 'polls will always be stolen at The Coop by those who demand them.',
			details: `Details of the points command`,
			examples: ['points', 'an example of how coop-econmics functions, trickle down, sunny side up Egg & Reagonmics. Supply and demand.'],
		});
	}

	async run(msg) {
		super.run(msg);

        try {
            if (msg.channel.type !== 'dm') {
				const points = await PointsHelper.getPointsByID(msg.author.id);
				await msg.channel.send(`${msg.author.username}'s points: ${points}`);
			}
        } catch(err) {
            await msg.reply('Unable to send you the help DM. You probably have DMs disabled.');
        }
    }
    
};