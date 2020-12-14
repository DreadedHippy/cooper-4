import STATE from "../../state";
import ServerHelper from "../entities/server/serverHelper";
import Redis from "./redis";

export default class Crossover {

    // Load important data into redis for website consumtion.
    static async load() {
        console.log('Redis connected, loading crossover data.');


        const guild = ServerHelper._coop();

    }

}
