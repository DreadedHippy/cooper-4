import ChannelsHelper from "../../../core/entities/channels/channelsHelper";
import ServerHelper from "../../../core/entities/server/serverHelper";
import Chicken from "../../chicken";
import PointsHelper from "../points/pointsHelper";
import CHANNELS from '../../../core/config/channels.json';

export default class StatisticsHelper {

    static async update() {
        ChannelsHelper._postToFeed('Should update about messages with new statistics!');

        try {
            await this.addAboutStats();
        } catch(e) {
            console.error(e);
        }
    }

    static async addAboutStats() {
        const configOpt = await Chicken.getConfig('about_leaderboard_msg');
        const leaderboard = await PointsHelper.getLeaderboard(0);
        const leaderboardMsgText = await PointsHelper.renderLeaderboard(leaderboard.rows);

        // post message to about
        if (!configOpt) {
            const leaderboardMsg = await ChannelsHelper._postToChannelCode('ABOUT', leaderboardMsgText);
            await Chicken.setConfig('about_leaderboard_msg', leaderboardMsg.id);
        } else {
            // Load message fraom existing configOpt
            const aboutChannel = ChannelsHelper._get(CHANNELS.ABOUT.id)
            const existingMsg = await aboutChannel.messages.fetch(configOpt.value);
            await existingMsg.edit(leaderboardMsgText);
        }
    }

}