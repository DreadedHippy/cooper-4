import ChannelsHelper from "../../../core/entities/channels/channelsHelper";
import ServerHelper from "../../../core/entities/server/serverHelper";
import Chicken from "../../chicken";
import PointsHelper from "../points/pointsHelper";
import CHANNELS from '../../../core/config/channels.json';
import UsersHelper from "../../../core/entities/users/usersHelper";
import embedHelper from "../../../ui/embed/embedHelper";

export default class StatisticsHelper {

    static async update() {
        ChannelsHelper._postToFeed('Should update about messages with new statistics!');

        
        try {

            await this.addAboutStats();
        } catch(e) {
            console.error(e);
        }
    }

    static async addItemStats() {
        // parseFloat("123.456").toFixed(2);
        // for each usable item, get circulation, etc
    }

    static async addAboutStats() {
        const configOpt = await Chicken.getConfig('about_leaderboard_msg');
        const leaderboard = await PointsHelper.getLeaderboard(0);
        const leaderboardMsgText = await PointsHelper.renderLeaderboard(leaderboard.rows);

        // Edit latest member message.
        const last = await UsersHelper.getLastUser();
        const lastMember = UsersHelper._getMemberByID(last.discord_id);
        const lastJoinLink = await Chicken.getConfigVal('about_lastjoin_msg');
        await MessagesHelper.editByLink(lastJoinLink, { embed: createEmbed({
            title: `${lastMember.user.username} was our latest member!`,
            thumbnail: UsersHelper.avatar(lastMember)
        }) });

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