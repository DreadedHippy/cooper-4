import CoopCommand from '../../core/entities/coopCommand';
import RolesHelper from '../../core/entities/roles/rolesHelper';

export default class MOTWCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'motw',
			group: 'misc',
			memberName: 'motw',
			aliases: [],
			description: 'Information motw our fine community!',
			details: `Details`,
			examples: ['motw', 'motw example?'],
		});
	}

	async run(msg) {
		super.run(msg);

		// Create an item that lets people try this and make it vote-guarded.

		// Compare historical_points increase % to current points for all members

        // historical_points
        // all points
    }    
};