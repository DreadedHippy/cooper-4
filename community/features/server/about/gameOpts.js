import ROLES from '../../../../core/config/roles.json';
import RolesHelper from "../../../../core/entities/roles/rolesHelper";
import UsersHelper from "../../../../core/entities/users/usersHelper";

export default class GameOpts {

    static economyToggle(reaction, user) {
        RolesHelper.toggle(user.id, 'ECONOMY');
    }

    static conquestToggle(reaction, user) {
        RolesHelper.toggle(user.id, 'CONQUEST');
    }

}