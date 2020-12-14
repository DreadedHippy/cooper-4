import { createClient } from 'redis';

export default class Redis {

    static connection = null;

    static connect() {
        this.connection = createClient(process.env.REDIS_TLS_URL, {
            tls: {
                rejectUnauthorized: false,
            }
        });

        this.connection.on("error", error => {
            console.error(error);
        });

        return this.connection;
    }
}