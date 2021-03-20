import Database from "../../../core/setup/database";
import STATE from "../../../state";

const numberEnding = number => (number > 1) ? 's' : '';

export default class EventsHelper {
   
    static async read(eventCode) {
        let value = null;

        const query = {
            name: "get-event",
            text: "SELECT * FROM events WHERE event_code = $1",
            values: [eventCode]
        };
        const response = await Database.query(query);

        if (response.rows.length) value = response.rows[0];

        return value;
    }
    

    static async update(eventCode, time) {
        const query = {
            name: "update-event",
            text: 'UPDATE events SET last_occurred = $1 WHERE event_code = $2 RETURNING event_code, last_occurred',
            values: [time, eventCode]
        };
        const response = await Database.query(query);
        return response;
    }

    static msToReadableHours(ms) {
        let temp = Math.floor(ms / 1000);
        let hours = Math.floor((temp %= 86400) / 3600);
        if (hours) return hours + ' hour' + numberEnding(hours);
        return 'now';
    }

    static msToReadable(milliseconds) {   
        let temp = Math.floor(milliseconds / 1000);

        let years = Math.floor(temp / 31536000);
        if (years) return years + ' year' + numberEnding(years);

        let days = Math.floor((temp %= 31536000) / 86400);
        if (days) return days + ' day' + numberEnding(days);

        let hours = Math.floor((temp %= 86400) / 3600);
        if (hours) return hours + ' hour' + numberEnding(hours);

        let minutes = Math.floor((temp %= 3600) / 60);
        if (minutes) return minutes + ' minute' + numberEnding(minutes);

        let seconds = temp % 60;
        if (seconds) return seconds + ' second' + numberEnding(seconds);
        
        return 'less than a second';
    }

    static chanceRun(command, likelihood) {
        if (STATE.CHANCE.bool({ likelihood })) command();
    }

    static runInterval(command, interval) {
        return setInterval(command, interval);
    }

    static chanceRunInterval(command, likelihood, interval) {
        return setInterval(() => {
            this.chanceRun(command, likelihood);
        }, interval);
    }

}