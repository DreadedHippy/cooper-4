import { Command } from 'discord.js-commando';
import PointsHelper from '../../../community/features/points/pointsHelper';
import CoopCommand from '../../core/classes/coopCommand';



export default class EgghuntCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'egghunt',
			group: 'community',
			memberName: 'egghunt',
			aliases: [],
			description: 'polls will always be stolen at The Coop by those who demand them.',
			details: `Details of the egghunt command`,
			examples: ['egghunt', 'an example of how coop-econmics functions, trickle down, sunny side up Egg & Reagonmics. Supply and demand.'],
		});
	}

	async run(msg) {
		super.run(msg);

		let targetUser = msg.author;
		if (msg.mentions.users.first()) targetUser = msg.mentions.users.first();

        try {
			// const points = await PointsHelper.getPointsByID(targetUser.id);
			// await msg.channel.send(`${targetUser.username}'s points: ${points}`);

        } catch(err) {
            console.error(err);
        }
    }
    
};