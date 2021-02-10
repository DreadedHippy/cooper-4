import Database from "../core/setup/database";

// TODO: Consider adding observable for checkIfNewDay (provide events)

import moment from 'moment';
import TimeHelper from "./features/server/timeHelper";
import ChannelsHelper from "../core/entities/channels/channelsHelper";
import ElectionHelper from "./features/hierarchy/election/electionHelper";

export default class Chicken {

    static async getConfig(key) {
        let value = null;

        try {
            const query = {
                name: "get-chicken-config",
                text: `SELECT * FROM chicken WHERE attribute = $1`,
                values: [key]
            };
            const result = await Database.query(query);
            if ((result.rows || []).length) {
                const resultData = result.rows[0] || null;
                if (resultData) value = resultData;
            }
        } catch(e) {
            console.error(e);
        }

        return value;
    }

    static async getConfigVal(key) {
        let val = null;

        const configEntry = await this.getConfig(key);
        if (configEntry) val = configEntry.value;

        return val;
    }

    static async setConfig(key, value) {
        const query = {
            name: "set-chicken-config",
            text: `INSERT INTO chicken(attribute, value)
                VALUES($1, $2) 
                ON CONFLICT (attribute)
                DO 
                UPDATE SET value = $2
                RETURNING value`,
            values: [key, value]
        };
        const result = await Database.query(query);
        return result;
    }

    static async _nextdayis() {
        const remainingMoment = await this._nextdayisMoment();
        const remainingReadable = moment.utc(remainingMoment).format("HH:mm:ss");
        return remainingReadable;
    }

    static async _nextdayisMoment() {
        const latestSecs = await this.getCurrentDaySecs();
        const presentSecs = Math.floor(+new Date() / 1000);
        const dayDuration = (3600 * 24);

        const latestMoment = moment.unix(latestSecs + dayDuration);
        const currentMoment = moment.unix(presentSecs);
        const remainingMoment = latestMoment.diff(currentMoment);

        return remainingMoment;
    }

    static async getCurrentDaySecs() {
        let secs = null;
        const currentDaySecs = await this.getConfigVal('current_day');
        if (currentDaySecs) secs = parseInt(currentDaySecs);
        return secs;
    }

    static async isNewDay() {
        const currentDaySecs = await this.getCurrentDaySecs();
        const nowSecs = TimeHelper._secs();
        const dayDurSecs = (60 * 60) * 24
        const isNewDay = nowSecs >= currentDaySecs + dayDurSecs;

        return isNewDay;
    }

    static async checkIfNewDay() {
        try {
            const isNewDay = await this.isNewDay();
            if (!isNewDay) return false;

            ChannelsHelper._postToFeed('A new day?')
            ElectionHelper.checkProgress();
            
            // If election is running, it should announce something at beginning of day, with time remaining.
            await this.setConfig('current_day', '' + TimeHelper._secs());
            return true;
            
        } catch(e) {
            console.log('New data detection failed.')
            console.error(e);
        }
    }

}