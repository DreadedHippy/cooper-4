import PointsHelper from "../points/pointsHelper";
import UsersHelper from "../../../core/entities/users/usersHelper";
import MessagesHelper from "../../../core/entities/messages/messagesHelper";
import RolesHelper from "../../../core/entities/roles/rolesHelper";

import CHANNELS from '../../../core/config/channels.json';
import KEY_MESSAGES from '../../../core/config/keymessages.json';

import Chicken from "../../chicken";

import AnnouncementOpts from "./about/announceOpts";
import GameOpts from "./about/gameOpts";
import CommunityOpts from "./about/communityOpts";



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
            '❗': AnnouncementOpts.keyInfoToggle, // Done
            '📢': AnnouncementOpts.announcementSubToggle, // Done
            '📰': AnnouncementOpts.newsletterToggle, // More complex unfinished
            '☠️': AnnouncementOpts.privacyBomb, // Most complex unfinished (need to add confirm)
        },
        FOCUS: {
            '💬': (r, user) => RolesHelper.toggle(user.id, 'SOCIAL'),
            '💻': (react, user) => RolesHelper.toggle(user.id, 'CODE'),
            '💼': (react, user) => RolesHelper.toggle(user.id, 'BUSINESS'),
            '🖌️': (react, user) => RolesHelper.toggle(user.id, 'ART')
        },
        GAMES: {
            '🎮': (react, user) => RolesHelper.toggle(user.id, 'GAMING'),
            '🤝': GameOpts.economyToggle, // Done
            '🗡': GameOpts.conquestToggle // Done
        },
        COMMUNITY: {
            '🧵': CommunityOpts.miscToggle, // Done
            '👷': CommunityOpts.projectsToggle // Done
        },
        ACADEMY_AGENCY: {
            '🏢': (react, user) => RolesHelper.toggle(user.id, 'AGENCY'),
            '📝': (react, user) => RolesHelper.toggle(user.id, 'ACADEMY')
        }
    }

    static optionEmojis = [
        ...Object.keys(this.sectionEmojis.ANNOUNCEMENTS),
        ...Object.keys(this.sectionEmojis.FOCUS),
        ...Object.keys(this.sectionEmojis.GAMES),
        ...Object.keys(this.sectionEmojis.COMMUNITY),

        ...Object.keys(this.sectionEmojis.ACADEMY_AGENCY)
    ]

    static async onReaction(reaction, user) {
        const reactEmoji = reaction.emoji.name;

        // Check if this reaction is on about channel.
        if (reaction.message.channel.id !== CHANNELS.ABOUT.id) return false;

        // Ignore Cooper.
        if (UsersHelper.isCooper(user.id)) return false;

        // Check if in array of interaction emojis.
        if (!this.optionEmojis.includes(reactEmoji)) return false;

        // Check if the user is a member, only members may gain access.
        const member = await UsersHelper.loadSingle(user.id);
        if (!member) return false;

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
            KEY_MESSAGES.about_gamesopt_msg,
            KEY_MESSAGES.about_academyagency_msg
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