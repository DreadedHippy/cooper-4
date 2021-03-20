import MessagesHelper from "../../../core/entities/messages/messagesHelper";
import UsersHelper from "../../../core/entities/users/usersHelper";
import STATE from "../../../core/state";

export default class LinkPreviewFilter {

        static isLink(str) {
            const urlRegexExp = '(?:(?:http|https)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?';
            const regex = new RegExp(urlRegexExp, 'i');
            return regex.test(str);
        }

        static async onMessage(msg) {
            if (UsersHelper.isCooperMsg(msg)) return false;
            if (msg.command !== null) return false;

            // Check if message contains link.
            if (this.isLink(msg.content)) {
                MessagesHelper.delayReact(msg, '🖼️', 666);

                // If it does not contain gif or tenor, suppress preview.
                if (msg.content.indexOf('tenor') === -1 && msg.content.indexOf('gif') === -1)
                    msg.suppressEmbeds(true);
            }
        }

        // Check if portrait emoji, toggle suppression.
        static onReaction(reaction, user) {
            if (UsersHelper.isCooper(user.id)) return false;
            if (UsersHelper.isCooperMsg(reaction.message)) return false;
            if (reaction.emoji.name !== '🖼️') return false;

            // If not suppressed, default to true (suppressive).
            const toggleVal = reaction.message.embeds.length > 0;

            // "Rate-limited" embed suppression.
            setTimeout(() => reaction.message.suppressEmbeds(toggleVal), 666);
        }

}