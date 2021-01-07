import moment from 'moment';

import ChannelsHelper from "../../../../core/entities/channels/channelsHelper";
import Database from '../../../../core/setup/database';
import Chicken from "../../../chicken";


// MVP: Elections
// Election Start -> Stand -> Consider -> Vote -> Election Declared

export default class ElectionHelper {

    static INTERVAL_SECS = 3600 * 24 * 25;
    static DURATION_SECS = 3600 * 24 * 7;

    // Preload campaign messages into cache so they are always reactable.
    static async onLoad() {
        console.warn('should cache candidate messages here');
    }


    static async addCandidate(userID, msgLink) {
        const query = {
            name: "add-candidate",
            text: `INSERT INTO candidates(campaign_msg_link, candidate_id)
                VALUES($1, $2)`,
            values: [msgLink, userID]
        };
        
        const result = await Database.query(query);
        return result;
    }

    static async getCandidate(userID) {

    }

    static async setCandidate(userID, candidate) {
        
    }

    static async clearCandidates() {

    }

    static async checkProgress() {
        // Are we in an election?
        const isOn = await this.isElectionOn();
        if (isOn) {
            // Time until next ellection?
            ChannelsHelper._postToFeed('Should be outputting election progress.');
        } else {
            // Time until next ellection?
            const nextElectionFmt = await this.nextElectionFmt()
            ChannelsHelper._postToFeed(`Next Election: ${nextElectionFmt}`);
        }
    }

    static async lastElecSecs() {
        const lastElecSecsVal = await Chicken.getConfigVal('last_election');
        const lastElecSecs = parseInt(lastElecSecsVal);
        return lastElecSecs;        
    }

    static async lastElecFmt() {
        const lastElecSecs = await this.lastElecSecs();
        const lastElecMoment = moment.unix(lastElecSecs);
        return lastElecMoment.format('dddd, MMMM Do YYYY, h:mm:ss a');
    }

    static async nextElecFmt() {
        const nextElecSecs = await this.nextElecSecs();
        const nextElecMoment = moment.unix(nextElecSecs);
        return nextElecMoment.format('dddd, MMMM Do YYYY, h:mm:ss a');
    }

    static async nextElecSecs() {
        const lastElecSecs = await this.lastElecSecs();
        const nextElecSecs = lastElecSecs + this.INTERVAL_SECS;
        return nextElecSecs;
    }

    // This is only active from next election interval moment to a week after that
    static async isElectionOn() {
        const lastElecSecs = await this.lastElecSecs();
        const nextElecSecs = await this.nextElecSecs();
        const nextDeclareSecs = lastElecSecs + this.INTERVAL_SECS + this.DURATION_SECS;

        const nowSecs = parseInt(Date.now() / 1000);

        if (nowSecs >= nextElecSecs && nowSecs <= nextDeclareSecs) return true;

        return false;
    }

    static async startElection() {}
    static async declareElection() {}
    static async countVotes() {}


    // Create election results table
    // Create previous commanders table
    // Inspect candidate campaign
    // Stand for election

    // Vote _once_ for candidate.
    // Inspect candidates list
    // Detect when election is running.
    // Last election attribute
    // Election over unix timestamp
    // latest winner
    // Previous winner
    // hasMostVotes
    // potentialLeaders
    // track voting like US election
}