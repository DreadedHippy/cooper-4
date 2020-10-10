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
        // TODO: Implement
        console.log('IMPLEMENT POINTS ADDITION');
    }
}