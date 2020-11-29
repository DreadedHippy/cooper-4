export default class MessagesHelper {
    static link(msg) {
        const link = `https://discordapp.com/channels/` +
            `${msg.guild.id}/` +
            `${msg.channel.id}/` +
            `${msg.id}`;
        return link;
    }
    static selfDestruct(msg, delay = 3000) {
        setTimeout(() => { msg.delete() }, delay);
    }
    static noWhiteSpace(strings, ...placeholders) {
        // Build the string as normal, combining all the strings and placeholders:
        let withSpace = strings.reduce((result, string, i) => (result + placeholders[i - 1] + string));
        let withoutSpace = withSpace.replace(/\s\s+/g, ' ');
        return withoutSpace;
    }
    static removeSymbols(str) {
        return str.replace('>', '').replace('<', '');
    }
    static getEmojiIdentifier(msg) {
        return this.removeSymbols(msg.content.trim());
    }

    static isOnlyEmojis(text) {
        const onlyEmojis = text.replace(new RegExp('[\u0000-\u1eeff]', 'g'), '')
        const visibleChars = text.replace(new RegExp('[\n\r\s]+|( )+', 'g'), '')
        return onlyEmojis.length === visibleChars.length
    }

    static emojiToUni(emoji) {
        return emoji.codePointAt(0).toString(16);
    }

    // Convert emojiID into Discord format, but not if its merely an unicode emoji.
    static emojifyID = emojiID => emojiID.split(':')[2].length > 1 ? `<${emojiID}>` : emojiID;

    static titleCase = (str) => {
        str = str.toLowerCase().split(' ');
        for (let i = 0; i < str.length; i++) {
            str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1); 
        }
        return str.join(' ');
        
    }
}