import ChannelsHelper from "../../../bot/core/entities/channels/channelsHelper";
import UsersHelper from "../../../bot/core/entities/users/usersHelper";

export default class ConfessionHandler {

    static async onMessage(msg) {

        console.log(msg);

        console.log(msg.content);
        console.log(msg.author);

        console.log(msg.channel.type !== 'dm');
        console.log(msg.isCommand);
        console.log(UsersHelper.isCooperMsg(msg));

        if (msg.channel.type !== "dm") return false;
        if (UsersHelper.isCooperMsg(msg)) return false;
        if (msg.isCommand) return false;

        console.log('processing msg', msg.content);

        const annotatedMsgText = `DM message from ${msg.author.username}: ${msg.content}`;
        ChannelsHelper._postToChannelCode('COOPERTESTS', annotatedMsgText);

        setTimeout(async () => {
            const replyableMsg = await ChannelsHelper._postToChannelCode('COOPERTESTS', annotatedMsgText);
            const filter = (reaction, user) => true;
            replyableMsg.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
                .then(collected => {
                    console.log(collected.size);
                    console.log(collected);

                    // Send the responses to the user.
                })
                .catch(collected => { console.log(collected); });
        }, 1333);

    }

}