import DatabaseHelper from "../../../core/classes/databaseHelper";
import ServerHelper from "../../../core/entities/server/serverHelper";
import Database from "../../../core/setup/database";
import STATE from "../../../state";
import ROLES from "../../../core/config/roles.json";
import ChannelsHelper from "../../../core/entities/channels/channelsHelper";

export default class PointsHelper {
    static async getPointsByID(id) {
        let points = 0;
        const result = await Database.query({
            name: 'fetch-user-points',
            text: 'SELECT points FROM users WHERE discord_id = $1',
            values: [id],
        });
        if (result.rows.length > 0) points = result.rows[0].points || 0;
        return points;
    }
    static async addPointsByID(id, points) {
        let newPoints = 0;
        const result = await Database.query({
            name: 'add-user-points',
            text: 'UPDATE users SET points = points + $1 WHERE discord_id = $2 RETURNING points',
            values: [points, id],
        });

        newPoints = (result.rows[0] || { points: 0 }).points;

        return newPoints;
    }

    // TODO: Add a shoutout/edit shoutout for current highest points in about
    // TODO: Add to about every 12 hours or so
    static async getLeaderboard(pos = 0) {
        const query = {
            name: 'get-leaderboard',
            text: `
                SELECT points, discord_id 
                FROM users 
                ORDER BY points DESC
                OFFSET $1
                LIMIT 15
            `.trim(),
            values: [pos]
        };
        const result = await Database.query(query);
        return result;
    }

    static async getNegLeaderboard(pos = 0) {
        const query = {
            name: 'get-negative-leaderboard',
            text: `
                SELECT points, discord_id 
                FROM users 
                ORDER BY points ASC
                OFFSET $1
                LIMIT 15
            `.trim(),
            values: [pos]
        };
        const result = await Database.query(query);
        return result;
    }

    static async getHighest() {
        const query = {
            name: 'get-highest-points-user',
            text: 'SELECT * FROM users ORDER BY points DESC LIMIT 1'
        };
        return DatabaseHelper.single(await Database.query(query));
    }

    static async updateCurrentWinner() {
        const highestRecord = await this.getHighest();
        const guild = ServerHelper.getByCode(STATE.CLIENT, 'PROD');

        const mostPointsRole = await guild.roles.fetch(ROLES.MOSTPOINTS.id);

        const mostPointsMember = await guild.members.fetch(highestRecord.discord_id);

        let alreadyHadRole = false;

        // Remove the role from previous winner.
        // TODO: Get name of previous winner and commiserate in text.
        const prevWinner = null;
        mostPointsRole.members.map(prevMostMember => {
            if (prevMostMember.user.id === highestRecord.discord_id) alreadyHadRole = true;
            else {
                prevWinner = prevMostMember.user;
                prevMostMember.roles.remove(mostPointsRole);
            }
        });

        // If the new winner didn't already have the role, award it and notify server.
        if (!alreadyHadRole) {
            const username = mostPointsMember.user.username;
            let successText = `${username} is now the point leader.`;
            if (prevWinner) successText = `${username} overtakes ${prevWinner.username} for most points!`;

            const pointsAfter = await this.addPointsByID(highestRecord.discord_id, 5);
            successText += ` Given MOST POINTS role and awarded 5 points (${pointsAfter})!`;

            ChannelsHelper._postToFeed(successText);
            mostPointsMember.roles.add(mostPointsRole);
        }
    }
}