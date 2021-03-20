import ChannelsHelper from "../../../core/entities/channels/channelsHelper";
import UsersHelper from "../../../core/entities/users/usersHelper";
import SubscriptionHelper from "../../newsletter/subscriptionHelper";

export default class ConfessionHandler {

    static async onMessage(msg) {
        if (msg.channel.type !== "dm") return false;
        if (UsersHelper.isCooperMsg(msg)) return false;
        if (msg.command !== null) return false;

        // Ensure an email address is not leaked to leaders etc.
        if (SubscriptionHelper.getEmailFromMessage(msg)) return false;

        const annotatedMsgText = `DM message from ${msg.author.username}: ${msg.content}`;
        ChannelsHelper._postToChannelCode('LEADERS', annotatedMsgText);

        setTimeout(async () => {
            const replyableMsg = await ChannelsHelper._postToChannelCode('COOPERTESTS', annotatedMsgText);
            replyableMsg.channel.awaitMessages(
                (msg) => {
                    // Filter out Cooper messages.
                    const notManualResponse = msg.content.indexOf('!direct') === -1;
                    const notCooper = !UsersHelper.isCooperMsg(msg);
                    return notManualResponse && notCooper;
                },
                { max: 1, time: 30000, errors: ['time'] }
            )
            .then(responses => {
                responses.map(resp => {
                    UsersHelper._dm(msg.author.id, resp.content);
                });
            })
            .catch(console.error);
        }, 1333);
    }

}