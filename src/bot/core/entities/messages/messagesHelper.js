export default class MessagesHelper {
    static link(msg) {
        const link = `https://discordapp.com/channels/` +
            `${msg.guild.id}/` +
            `${msg.channel.id}/` +
            `${msg.id}`;
        return link;
    }
    static selfDestruct(msg) {
        setTimeout(() => { msg.delete() }, 3000);
        setTimeout(() => { msg.delete() }, 4000);
    }
}