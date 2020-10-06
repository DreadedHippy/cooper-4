export default class RolesHelper {
    static getRoles(guild, rolesSelection) {
        return guild.roles.cache.filter(r => rolesSelection.includes(r.name));
    }
}