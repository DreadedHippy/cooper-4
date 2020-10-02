import { Command } from 'discord.js-commando';

export default class PointsCommand extends Command {

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
        try {
            await msg.direct('To topup your coop-points, boost The Cooper server. We accept swipecard, swipe here ---------');
            if (msg.channel.type !== 'dm') await msg.channel.send('POINTS TABLE');
        } catch(err) {
            await msg.reply('Unable to send you the help DM. You probably have DMs disabled.');
        }
    }
    
};