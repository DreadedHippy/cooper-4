import CoopCommand from '../../core/classes/coopCommand';

export default class EgghuntCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'items',
			group: 'economy',
			memberName: 'items',
			aliases: [],
			description: 'polls will always be stolen at The Coop by those who demand them.',
			details: `Details of the items command`,
			examples: ['items', 'an example of how coop-econmics functions, trickle down, sunny side up Egg & Reagonmics. Supply and demand.'],
		});
	}

	async run(msg) {
		super.run(msg);

		let targetUser = msg.author;
		if (msg.mentions.users.first()) targetUser = msg.mentions.users.first();

        try {
			await msg.say('Your Items: 0');

        } catch(err) {
            console.error(err);
        }
    }
    
};