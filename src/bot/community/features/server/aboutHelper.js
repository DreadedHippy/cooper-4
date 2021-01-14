import ChannelsHelper from "../../../core/entities/channels/channelsHelper";
import PointsHelper from "../points/pointsHelper";
import UsersHelper from "../../../core/entities/users/usersHelper";
import MessagesHelper from "../../../core/entities/messages/messagesHelper";
import embedHelper from "../../../ui/embed/embedHelper";

import Chicken from "../../chicken";
import CHANNELS from '../../../core/config/channels.json';

import KEY_MESSAGES from '../../../core/config/keymessages.json';
import AnnouncementOpts from "./about/announceOpts";
import GameOpts from "./about/gameOpts";



export default class AboutHelper {

    // Refactor to a reduce.
    static getEmojiHandler(emoji) {
        let handler = null;
        Object.keys(this.sectionEmojis).map(section => {
            const methods = this.sectionEmojis[section];
            if (typeof methods[emoji] === 'function')
                handler = methods[emoji];
        });
        return handler;
    }

    static getEmojiHandler(emoji) {
        return Object.keys(this.sectionEmojis).reduce((acc, section) => {
            const methods = this.sectionEmojis[section];
            if (typeof methods[emoji] === 'function') return acc = methods[emoji];
            return acc;
        }, null);
    }

    
    static sectionEmojis = {
        ANNOUNCEMENTS: {
            '❗': AnnouncementOpts.keyInfoToggle,
            '📰': AnnouncementOpts.newsletterToggle,
            '📢': AnnouncementOpts.announcementSubToggle,
            '☠️': AnnouncementOpts.privacyBomb
        },
        // Add economy and 
        GAMES: {
            '🤝': GameOpts.economyToggle,
            '🗡': GameOpts.conquestToggle
        }
    }

    static optionEmojis = [
        ...Object.keys(this.sectionEmojis.ANNOUNCEMENTS),
        ...Object.keys(this.sectionEmojis.GAMES),
    ]

    static async onReaction(reaction, user) {
        const reactEmoji = reaction.emoji.name;

        // Check if this reaction is on about channel.
        if (reaction.message.channel.id !== CHANNELS.ABOUT.id) return false;
        
        // Ignore Cooper.
        if (UsersHelper.isCooper(user.id)) return false;
        
        // Check if in array of interaction emojis.
        if (!this.optionEmojis.includes(reactEmoji)) return false;

        // Map emojis to right option handler.
        const resultCallback = this.getEmojiHandler(reactEmoji);
        if (resultCallback) resultCallback(reaction, user);
    }

    static async preloadMesssages() {
        const links = [
            KEY_MESSAGES.about_community_msg,
            KEY_MESSAGES.about_notifications_msg,
            KEY_MESSAGES.about_ourfocus_msg,
            KEY_MESSAGES.about_optout_msg,
            KEY_MESSAGES.about_gamesopt_msg
        ];
        return await MessagesHelper.preloadMsgLinks(links);
    }


    static async addAboutStats() {
        // Edit latest member message.
        const last = await UsersHelper.getLastUser();
        const lastMember = UsersHelper._getMemberByID(last.discord_id);
        const lastJoinLink = await Chicken.getConfigVal('about_lastjoin_msg');
        await MessagesHelper.editByLink(lastJoinLink, `**Latest Member**\n` +
            `${lastMember.user.username} was our latest member!`
        );
        
        // post leaderboard to economy
        const leaderboardMsgLink = await Chicken.getConfigVal('about_leaderboard_msg');
        const leaderboard = await PointsHelper.getLeaderboard(0);
        const leaderboardMsgText = await PointsHelper.renderLeaderboard(leaderboard.rows);
        await MessagesHelper.editByLink(leaderboardMsgLink, leaderboardMsgText);
    }

}