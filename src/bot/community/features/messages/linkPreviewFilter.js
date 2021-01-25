
import ChannelsHelper from "../../../core/entities/channels/channelsHelper";
import MessagesHelper from "../../../core/entities/messages/messagesHelper";
import UsersHelper from "../../../core/entities/users/usersHelper";

export default class LinkPreviewFilter {

        static async onMessage(msg) {
            if (UsersHelper.isCooperMsg(msg)) return false;
            if (msg.command !== null) return false;

            const urlRegexExp = '(?:(?:http|https)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?';
            const regex = new RegExp(urlRegexExp, 'i');

            // Check if message contains link.
            if (regex.test(msg.content)) {
                msg.suppressEmbeds(true);
                MessagesHelper.delayReact(msg, '🖼️', 666);
            }
        }

        // Check if portrait emoji, toggle suppression.
        static onReaction(reaction, user) {
            if (UsersHelper.isCooper(user.id)) return false;
            if (UsersHelper.isCooperMsg(reaction.message)) return false;
            if (reaction.emoji.name === '🖼️') reaction.message.suppressEmbeds(false);
        }

}