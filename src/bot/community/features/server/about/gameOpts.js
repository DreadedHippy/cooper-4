
// import KEY_MESSAGES from '../../../core/config/keymessages.json';
import ROLES from '../../../../core/config/roles.json';
import RolesHelper from "../../../../core/entities/roles/rolesHelper";
import UsersHelper from "../../../../core/entities/users/usersHelper";

export default class GameOpts {

    static economyToggle(reaction, user) {
        try {
            // Get economy role.
            const member = UsersHelper._getMemberByID(user.id);
            
            // Check if user has it or not.
            const hasRoleAlready = UsersHelper.hasRoleID(member, ROLES.ECONOMY.id);
            if (!hasRoleAlready) RolesHelper._add(user.id, 'ECONOMY');
            else RolesHelper._remove(user.id, 'ECONOMY');

        } catch(e) {
            console.log('Error with key info pings toggle.');
            console.error(e);
        }
    }

    static conquestToggle(reaction, user) {
        console.log('economyToggle', reaction.message.id, user.username);
        return 1;
    }

}