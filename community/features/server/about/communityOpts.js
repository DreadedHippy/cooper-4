import ROLES from '../../../../core/config/roles.json';
import RolesHelper from "../../../../core/entities/roles/rolesHelper";
import UsersHelper from "../../../../core/entities/users/usersHelper";

export default class CommunityOpts {

    static projectsToggle(reaction, user) {
        RolesHelper.toggle(user.id, 'PROJECTS');
    }

    static miscToggle(reaction, user) {
        RolesHelper.toggle(user.id, 'MISC');
    }

}