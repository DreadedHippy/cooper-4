export default class MessagesHelper {
    static link(msg) {
        const link = `https://discordapp.com/channels/` +
            `${msg.guild.id}/` +
            `${msg.channel.id}/` +
            `${msg.id}`;
        return link;
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
        const onlyEmojis = text.replace(new RegExp('[\u0000-\u1eeff]', 'g'), '');
        const visibleChars = text.replace(new RegExp('[\n\r\s]+|( )+', 'g'), '');
        return onlyEmojis.length === visibleChars.length;
    }

    static isOnlyEmojisOrIDs(text) {
        const codeChars = text.replace(new RegExp(':\w+:', 'g'), '')
        const visibleChars = text.replace(new RegExp('[\n\r\s]+|( )+', 'g'), '')
        const isOnlyIDCodes = codeChars.length === visibleChars.length;
        return this.isOnlyEmojis(text) || isOnlyIDCodes;
    }

    static countAllEmojiCodes(text) {
        const numCodes = text.match(/(:\w+:)/gm).length;
        return numCodes;
    }

    static emojiToUni(emoji) {
        return emoji.codePointAt(0).toString(16);
    }

    static emojiText(emoji) {
        return `<${emoji}>`;
    }

    static delayReactionRemove(reaction, delay) {
        if (reaction) setTimeout(() => { reaction.remove(); }, delay);
    }

    static delayReact(msg, emoji, delay = 666) {
        if (msg) setTimeout(async () => { 
            try {
                await msg.react(emoji); 
            } catch(e) {
                console.log('Delay react error.');
                console.error(e);
            }
        }, delay);
    }

    static delayDelete(msg, delay = 666) {
        if (msg) setTimeout(async () => { 
            try {
                if (typeof msg.delete === 'function') await msg.delete();
                else console.log('Logging msg.delete not function', msg);
            } catch(e) {
                console.log('Delay delete error.');
                console.error(e);
            }
        }, delay);
    }

    static delayEdit(msg, newContent, delay = 666) {
        if (msg) setTimeout(async () => { 
            try {
                await msg.edit(newContent);
            } catch(e) {
                console.log('Delay edit error.');
                console.error(e);
            }
        }, delay);
    }

    static async selfDestruct(msgRef, content, delay = 666, fuse = 30000) {
        setTimeout(async () => {
            const createdMsg = await msgRef.say(content);
            this.delayDelete(createdMsg, fuse);
        }, delay);
    }

    // Convert emojiID into Discord format, but not if its merely an unicode emoji.
    static emojifyID = emojiID => {
        if (emojiID) {
            const idParts = emojiID.split(':');
            if (idParts.length > 1) return idParts[2].length > 1 ? `<${emojiID}>` : emojiID;
        }
        return '_' + emojiID;
    }

    static itemCodeFromMisc(miscString) {
        
    }

    static titleCase = (str) => {
        str = str.toLowerCase().split(' ');
        for (let i = 0; i < str.length; i++) str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1); 
        return str.join(' ');
    }



    static delayedSelfDestructingReply(msgRef, delay, fuse) {
        this.delay
    }
}