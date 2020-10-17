import Database from "../../../bot/core/setup/database";

export default class EventsHelper {
   
    static async read(eventCode) {
        let value = null;

        const query = {
            name: "get-event",
            text: "SELECT * FROM events WHERE event_code = $1",
            values: [eventCode]
        };
        const response = await Database.query(query);

        if (response.rows.length) {
            value = response.rows[0];
        }

        return value;
    }

    static async update(eventCode, time) {
        const query = {
            name: "update-event",
            text: 'UPDATE users SET last_occurred = $1 WHERE event_code = $2 RETURNING event_code, last_occurred',
            values: [time, eventCode]
        };
        const response = await Database.query(query);
        return response;
    }

}