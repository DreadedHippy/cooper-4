import SERVERS from '../../config/servers.json';

export default class ServerHelper {
    static getByID(client, id) {
        return client.guilds.cache.get(id);
    }
    static getByCode(client, code) {
        return this.getByCode(client, SERVERS[code].id);
    }
}