import { createClient } from 'redis';

export default class Redis {

    static connection = null;

    static async connect() {
        this.connection = createClient(process.env.REDIS_TLS_URL);

        this.connection.on("error", error => console.error);
    }
}