import Database from "../core/setup/database";

// TODO: Consider adding observable for checkIfNewDay (provide events)

import moment from 'moment';

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
        const cooperUnixSecsResp = await this.getConfig('current_day');
        if (cooperUnixSecsResp) secs = parseInt(cooperUnixSecsResp.value);
        return secs;
    }

    static async checkIfNewDay(...callbacks) {
        try {
            let isNewDay = false;
            const currentUnixSecs = Math.floor(+new Date() / 1000);
            const cooperUnixSecs = await this.getCurrentDaySecs();

            // Check if any day value already exists.
            if (cooperUnixSecs) {
                if (currentUnixSecs - (3600 * 24) >=  cooperUnixSecs) {
                    await this.setConfig('current_day', '' + currentUnixSecs);
                    isNewDay = true;                    
                }
            }
            
            // Set a datbase default.
            if (!cooperUnixSecs) isNewDay = true;

            if (isNewDay) {
                await this.setConfig('current_day', '' + currentUnixSecs);
                callbacks.forEach(callback => {
                    if (typeof callback === 'function') callback(currentUnixSecs);
                });
            }

        } catch(e) {
            console.error(e);
            // TODO: Send message that new day failed.
        }
    }

}