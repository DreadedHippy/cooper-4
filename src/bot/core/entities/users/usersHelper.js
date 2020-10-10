export default class UsersHelper {
    static avatar(user) {
        const avatarURL = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128`;
        return avatarURL;
    }

    static getMemberByID = (guild, id) => guild.members.cache.get(id);

    static getUserByID = (guild, id) => guild.users.cache.get(id);

    static hasRoleID = (member, id) => member.roles.cache.get(id);

    static hasRoleNames = (guild, member, roleNames) => 
        guild.roles.cache
            .filter(role => roleNames.includes(role.name))
            .some(role => member.roles.cache.has(role.id));

    static count(guild, includeBots = false) {
        if (includeBots) return guild.members.cache.size;
        else return this.filterMembers(guild, member => !member.user.bot).size; 
    }

    static directMSG = (guild, userID, msg) => UsersHelper.getMemberByID(guild, userID).send(msg);
    
    static getOnlineMembers = (guild) => guild.members.cache.filter(member => member.presence.status === 'online');
    
    static filterMembers = (guild, filter) => guild.members.cache.filter(filter);

    static getOnlineMembersByRoles(guild, roleNames) {
        const notificiationRoles = guild.roles.cache.filter(role => roleNames.includes(role.name));
        
        return this.filterMembers(guild, member => {
            const matchingRoles = notificiationRoles.some(role => member.roles.cache.has(role.id));
            const isOnline = member.presence.status === 'online';
            return matchingRoles && isOnline;
        });
    }
    
}