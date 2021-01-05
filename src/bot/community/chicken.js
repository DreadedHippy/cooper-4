import Database from "../core/setup/database";

// TODO: Consider adding observable for checkIfNewDay (provide events)

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


    static async checkIfNewDay(...callbacks) {
        try {
            let isNewDay = false;
            const currentUnixSecs = Math.floor(+new Date() / 1000);
            const cooperUnixSecsResp = await this.getConfig('current_day');

            // Check if any day value already exists.
            if (cooperUnixSecsResp) {
                const cooperUnixSecs = parseInt(cooperUnixSecsResp.value);

                if (currentUnixSecs - (3600 * 24) >=  cooperUnixSecs) {
                    await this.setConfig('current_day', '' + currentUnixSecs);
                    isNewDay = true;                    
                }
            }
            
            // Set a datbase default.
            if (!cooperUnixSecsResp) isNewDay = true;

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