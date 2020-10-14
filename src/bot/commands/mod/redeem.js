import ROLES from '../../core/config/roles.json';

import CoopCommand from '../../core/classes/coopCommand';
import UsersHelper from '../../core/entities/users/usersHelper';
import RedemptionHelper from '../../../community/redemption/redemptionHelper';


export default class RedeemCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'redeem',
			group: 'mod',
			memberName: 'redeem',
			aliases: [],
			description: 'Sling a rope.',
			details: `Details for redeeming`,
			examples: ['redeem', 'Nice example!'],
			args: [
				{
					key: 'user',
					prompt: 'Which user would you like to approve?',
					type: 'user',
				},
			],
		});
	}

	async run(commandMSG, { user }) {
		super.run(commandMSG);

		try {
			const guild = commandMSG.channel.guild;

			// Access author member data for permissions/guards.
			const authorMember = UsersHelper.getMemberByID(guild, commandMSG.author.id);
			
			// Check person issuing command is a leader or commander.
			const { LEADER, COMMANDER, MEMBER } = ROLES;
			// const isAuthorised = UsersHelper.hasRoleNames(guild, authorMember, [LEADER.name, COMMANDER.name]);
			const isAuthorised = false;
			if (!isAuthorised) return commandMSG.say(':no_entry_sign: You can\'t touch this. :no_entry_sign:');

			// Access target member data for permissions/guards.
			const targetMember = UsersHelper.getMemberByID(guild, user.id);

			// Check if user is still in the server, may have clucked off already.
			if (!targetMember) return commandMSG.reply(`User can't be foooooound.`);
			
			// Check user is not already a member.
			if (UsersHelper.hasRoleID(targetMember, MEMBER.id)) {
				return commandMSG.reply(`Have you lost your cluckin' mind? ${user.username} is already approved.`);
			}

			// Now the voting begins!
			await RedemptionHelper.start(commandMSG, targetMember);

		} catch(e) {
			commandMSG.say('Redemption failed, check logs. :mag_right::wood::wood::wood:');
			console.error(e);
		}
    }
    
};