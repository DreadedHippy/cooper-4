import Database from "../../../bot/core/setup/database";

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
    static async getLeaderboard(pos) {
        const query = {
            name: 'get-leaderboard',
            text: 'SELECT points, discord_id FROM users ORDER BY points ASC LIMIT 10'
        };
        const result = await Database.query(query);
        console.log(result);
        return result;
    }
}