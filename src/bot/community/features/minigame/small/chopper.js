import ChannelsHelper from "../../../../core/entities/channels/channelsHelper";
import MessagesHelper from "../../../../core/entities/messages/messagesHelper";

// If negative, start cutting pieces away
const wrapString = (str) => 
    "```\n" + str + "\n```";

const chopperStr = (blade = false, lineSpc = 0) => {
    let bladeString = (blade ? ` ___.___` : `    .`);
    let bodyString = '0-cC0D\`=--/';

    if (lineSpc < 0) {
        bladeString = bladeString.slice(lineSpc);
        bodyString = bladeString.slice(lineSpc);
    }

    return wrapString(
        ' '.repeat(Math.max(lineSpc, 0)) + bladeString + 
            `\n` + 
        ' '.repeat(Math.max(lineSpc, 0)) + bodyString,
    );
}

export default class ChopperMinigame {
    
	static async launch(delayInc = 1000) {
        const msg = await ChannelsHelper._postToChannelCode(
            'TALK', 
            wrapString('Radar Detection: Airforce convoy inbound!'),
            delayInc * 1000
        );

		MessagesHelper.delayEdit(msg, chopperStr(true, 8), delayInc * 2000);
        MessagesHelper.delayEdit(msg, chopperStr(false, 7), delayInc * 3000);
        MessagesHelper.delayEdit(msg, chopperStr(true, 6), delayInc * 4000);
        MessagesHelper.delayEdit(msg, chopperStr(false, 5), delayInc * 5000);
        MessagesHelper.delayEdit(msg, chopperStr(true, 4), delayInc * 7000);
        MessagesHelper.delayEdit(msg, chopperStr(false, 3), delayInc * 8000);
        MessagesHelper.delayEdit(msg, chopperStr(true, 2), delayInc * 9000);
        MessagesHelper.delayEdit(msg, chopperStr(false, 1), delayInc * 10000);
        MessagesHelper.delayEdit(msg, chopperStr(true, 0), delayInc * 11000);
        MessagesHelper.delayEdit(msg, chopperStr(false, -1), delayInc * 12000);
        MessagesHelper.delayEdit(msg, chopperStr(true, -2), delayInc * 13000);
        MessagesHelper.delayEdit(msg, chopperStr(false, -3), delayInc * 14000);
        MessagesHelper.delayEdit(msg, chopperStr(true, -4), delayInc * 15000);
        MessagesHelper.delayEdit(msg, chopperStr(false, -5), delayInc * 16000);
        MessagesHelper.delayEdit(msg, chopperStr(true, -6), delayInc * 17000);
        MessagesHelper.delayEdit(msg, chopperStr(false, -7), delayInc * 18000);
        MessagesHelper.delayEdit(msg, chopperStr(true, -8), delayInc * 19000);
        MessagesHelper.delayEdit(msg, chopperStr(false, -9), delayInc * 20000);
        MessagesHelper.delayEdit(msg, chopperStr(true, -10), delayInc * 21000);

        MessagesHelper.delayDelete(msg, delayInc * 22000);
	}

}