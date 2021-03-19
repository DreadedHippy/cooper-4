import DatabaseHelper from "../../../core/entities/databaseHelper";
import Database from "../../../core/setup/database";
import STATE from "../../../state";
import ROLES from "../../../core/config/roles.json";
import ChannelsHelper from "../../../core/entities/channels/channelsHelper";
import ServerHelper from "../../../core/entities/server/serverHelper";
import RolesHelper from "../../../core/entities/roles/rolesHelper";
import UsersHelper from "../../../core/entities/users/usersHelper";
import ItemsHelper from "../items/itemsHelper";



export default class PointsHelper {
    
    static async getPointsByID(id) {
        const qty = await ItemsHelper.getUserItemQty(id, 'COOP_POINT')
        return qty;
    }

    static async addPointsByID(id, points) {
        const addResult = await ItemsHelper.add(id, 'COOP_POINT', points);
        return addResult;
    }

    static async getLeaderboard(pos = 0) {
        const query = {
            name: 'get-leaderboard',
            text: `
                SELECT quantity, owner_id 
                FROM items 
                WHERE item_code = 'COOP_POINT'
                ORDER BY quantity DESC
                OFFSET $1
                LIMIT 15
            `.trim(),
            values: [pos]
        };

        const result = await Database.query(query);
        const rows = DatabaseHelper.many(result);

        return rows;
    }

    static async getAllPositive() {
        const query = {
            name: 'get-all-positive',
            text: `
                SELECT quantity, owner_id
                FROM users 
                WHERE quantity > 0 AND item_code = 'COOP_POINT'
            `.trim(),
        };
        const result = await Database.query(query);
        return result;   
    }

    static async getNegLeaderboard(pos = 0) {
        const query = {
            name: 'get-negative-leaderboard',
            text: `
                SELECT quantity, owner_id 
                FROM items
                ORDER BY quantity ASC
                OFFSET $1
                LIMIT 15
            `.trim(),
            values: [pos]
        };

        const result = await Database.query(query);
        const rows = DatabaseHelper.many(result);

        return rows;
    }

    static async getHighest() {
        const query = {
            name: 'get-highest-points-user',
            text: `SELECT * FROM items
                WHERE item_code = 'COOP_POINT' 
                ORDER BY quantity DESC LIMIT 1`
        };
        return DatabaseHelper.single(await Database.query(query));
    }

    static async updateCurrentWinner() {
        const highestRecord = await this.getHighest();

        const mostPointsRole = RolesHelper._getByCode('MOSTPOINTS');
        
        const mostPointsMember = UsersHelper._get(highestRecord.owner_id);
        const username = mostPointsMember.user.username;
        
        let alreadyHadRole = false;

        // Remove the role from previous winner and commiserate.
        let prevWinner = null;
        mostPointsRole.members.map(prevMostMember => {
            if (prevMostMember.user.id === highestRecord.owner_id) alreadyHadRole = true;
            else {
                prevWinner = prevMostMember.user;
                prevMostMember.roles.remove(mostPointsRole);
            }
        });

        // If the new winner didn't already have the role, award it and notify server.
        if (!alreadyHadRole) {
            let successText = `${username} is now the point leader.`;
            if (prevWinner) successText = ` ${username} overtakes ${prevWinner.username} for most points!`;

            const pointsAfter = await this.addPointsByID(highestRecord.owner_id, 5);
            successText += ` Given MOST POINTS role and awarded 5 points (${pointsAfter})!`;

            ChannelsHelper._postToFeed(successText);
            mostPointsMember.roles.add(mostPointsRole);
        }
    }


    static async renderLeaderboard(leaderboardRows, position = 0) {
        const guild = ServerHelper.getByCode(STATE.CLIENT, 'PROD');
        const rowUsers = await Promise.all(leaderboardRows.map(async (row, index) => {
            let username = '?';
            try {
                const member = await guild.members.fetch(row.owner_id);
                username = member.user.username;

            } catch(e) {
                console.log('Error loading user via ID');
                console.error(e);
            }
            return {
                username,
                rank: index + position,
                points: row.points
            }
        }));

        let leaderboardMsgText = '```\n\n ~ POINTS LEADERBOARD ~ \n\n' + 
            rowUsers.map(user => `${user.rank + 1}. ${user.username} ${user.points}`).join('\n') +
            '```';

        return leaderboardMsgText
    }
}