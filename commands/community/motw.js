import CoopCommand from '../../core/entities/coopCommand';
import RolesHelper from '../../core/entities/roles/rolesHelper';
import ServerHelper from '../../core/entities/server/serverHelper';
import UsersHelper from '../../core/entities/users/usersHelper';
import ROLES from '../../core/config/roles.json';

export default class DontCommitCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'motw',
			group: 'misc',
			memberName: 'motw',
			aliases: [],
			description: 'Information motw our fine community!',
			details: `Details`,
			examples: ['motw', 'motw example?'],

			// Stop us getting nuked
			ownerOnly: true
		});
	}

	async run(msg) {
		super.run(msg);

		// Create an item that lets people try this and make it vote-guarded.

		const memberOfWeekRole = RolesHelper.getRoleByID(ServerHelper._coop(), ROLES.MEMBEROFWEEK.id);
		const membersOfWeek = UsersHelper.getMembersByRoleID(ServerHelper._coop(), ROLES.MEMBEROFWEEK.id);
		
		membersOfWeek.map(member => {
			member.roles.remove(memberOfWeekRole);
		});

		ServerHelper._coop().members.cache.get('266840470624272385').roles.add(memberOfWeekRole);
    }    
};