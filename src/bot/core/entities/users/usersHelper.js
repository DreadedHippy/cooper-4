export default class UsersHelper {
    static avatar(user) {
        const avatarURL = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128`;
        return avatarURL;
    }
    static memberHasSomeOfRoleNames = (guild, member, roleNames) => {
        return guild.roles.cache
            .filter(role => roleNames.includes(role.name))
            .some(role => member.roles.cache.has(role.id));
    };
    
    static getOnlineMembers(guild) {
        return guild.members.cache.filter(member => member.presence.status === 'online');
    }
    
    static getOnlineMembersByRoles(guild, roleNames) {
        const notificiationRoles = guild.roles.cache.filter(role => roleNames.includes(role.name));
        
        const notificationMembers = guild.members.cache.filter(member => {
            const matchingRoles = notificiationRoles.some(role => member.roles.cache.has(role.id));
            const isOnline = member.presence.status === 'online';
            return matchingRoles && isOnline;
        });
    
        return notificationMembers;
    }
}