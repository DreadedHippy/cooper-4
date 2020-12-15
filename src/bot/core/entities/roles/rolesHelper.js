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
}