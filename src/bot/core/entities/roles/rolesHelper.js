import ROLES from '../../config/roles.json';
import ServerHelper from '../server/serverHelper';
import UsersHelper from '../users/usersHelper';

export default class RolesHelper {
    static getRoles(guild, rolesSelection) {
        return guild.roles.cache.filter(r => rolesSelection.includes(r.name));
    }
    static getRolesByID(guild, rolesSelection) {
        return guild.roles.cache.filter(r => rolesSelection.includes(r.id));
    }
    static getRoleByID(guild, roleID) {
        return guild.roles.cache.get(roleID);
    }

    static async _add(userID, roleCode) {
        try {
            const guild = ServerHelper._coop();
            const role = this.getRoleByID(guild, ROLES[roleCode].id);
            const user = UsersHelper._getMemberByID(userID);
            if (role && user) return await user.roles.add(role);
        } catch(e) {
            console.log('Error adding role');
            console.error(e);
        }
        // 727311131705868299 COMMANDER
        // 723676356818239773 LEADER
    }

    static async _remove(userID, roleCode) {
        try {
            const guild = ServerHelper._coop();
            const role = this.getRoleByID(guild, ROLES[roleCode].id);
            const user = UsersHelper._getMemberByID(userID);
            if (role && user) return await user.roles.remove(role);
        } catch(e) {
            console.log('Error removing role');
            console.error(e);
        }
        // 723676356818239773 LEADER
    }

    static addRoleCodeToUserID(userID, roleCode) {

    }

    static _getUsersWithRoleCodes(roleCodes) {
        const guild = ServerHelper._coop();
        return guild.members.cache.filter(member => {
            let match = false;

            // Test if they have any role codes.
            roleCodes.forEach(roleCode => {
                const roleID = ROLES[roleCode].id;
                if (member.roles.cache.has(roleID)) match = true;
            });

            return match;
        });
    }
}