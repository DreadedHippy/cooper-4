import moment from 'moment';

import ChannelsHelper from "../../../../core/entities/channels/channelsHelper";
import MessagesHelper from '../../../../core/entities/messages/messagesHelper';
import ServerHelper from '../../../../core/entities/server/serverHelper';
import Database from '../../../../core/setup/database';
import Chicken from "../../../chicken";


// MVP: Elections
// Election Start -> Stand -> Consider -> Vote -> Election Declared

// TODO:
// Preload candidates messages. [DONE]
// Create previous commanders table [DONE]
// Tell the community once a day when the next election is [DONE]

// Detect the start of an election.

// Should be posted/maintain an election message in about channel?

// Detect a vote
// Count votes and announce until election over

// Declare election over
// Assign roles
// Announce win

// Inspect candidate campaign
// Stand for election

// Create election results table


// Vote _once_ for candidate.
// Inspect candidates list
// Last election attribute
// Election over unix timestamp
// latest winner
// Previous winner
// hasMostVotes
// potentialLeaders

// track voting like US election


export default class ElectionHelper {

    static INTERVAL_SECS = 3600 * 24 * 25;
    static DURATION_SECS = 3600 * 24 * 7;

    static candidateCampaigns = [];

    static async clearCandidates() {
        // Remove js local ref to messages
        // Ensure all messages deleted, use bulk delete won't be outside of 14 days
        // Clear database
    }

    static async checkProgress() {
        // Are we in an election?
        const wasOn = await this.isElectionOn();
        let isOn = false;

        // Detect the start of an election.
        const isTime = await this.isElectionTime();
        if (isTime && !wasOn) {
            await Chicken.setConfig('election_on', true);
            isOn = true;
        }

        if (isOn) {
            // Time until next ellection?
            // TODO: Reuse formatting for consider here.
            ChannelsHelper._postToFeed('Should be outputting election progress.');

            // Get and format all votes.
            const allVotes = await this.fetchAllVotes();
            console.log('all votes', allVotes);

            // TODO: Output time remaining to vote!
            
        } else {
            // Time until next ellection?
            const nextElectionFmt = await this.nextElectionFmt();
            ChannelsHelper._postToFeed(`Next Election: ${nextElectionFmt}`);
        }

        // Check if election has finished!
        if (wasOn) {
            const elecDoneSecs = 100;
            // await this.declareElection()
        }
    }


    // Check if this reaction applies to elections.
    static async onReaction(reaction, user) {
        console.log(reaction, user);
        // Check if occurred in election channel
        // Check if reaction is crown (indicates vote)
        // Check if already voted
        // Check if reaction message is a campaign message
    }

    static async fetchAllVotes() {
        // Count all reactions.
        return [];
    }


    static async declareElection() {

    }

    static async countVotes() {

    }

    static async getCandidate(userID) {
        const query = {
            name: "get-candidate",
            text: `SELECT * FROM election_candidates WHERE candidate_id = $1`,
            values: [userID]
        };

        const result = await Database.query(query);
        return result;
    }


    // Preload campaign messages into cache so they are always reactable.
    static async onLoad() {
        console.warn('should cache candidate messages here');

        const candidates = await this.getAllCandidates();
        const preloadMsgIDs = candidates.map(candidate => 
            MessagesHelper.parselink(candidate.campaign_msg_link)
        );

        // Preload each candidate message.
        this.candidateCampaigns = await Promise.all(preloadMsgIDs.map((idSet, index) => {
            const guild = ServerHelper._coop();
            return new Promise((resolve, reject) => {
                setTimeout(async () => {
                    const chan = guild.channels.cache.get(idSet.channel);
                    if (chan) {
                        const msg = await chan.messages.fetch(idSet.message);
                        resolve(msg);
                    } 
                }, 666 * index);
            });
        }));
        console.log('Preloaded election messages');
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

    static async getAllCandidates() {
        const query = {
            name: "get-all-candidates",
            text: `SELECT * FROM candidates`
        };
        
        let candidates = null;
        const result = await Database.query(query);
        if (result.rows) candidates = result.rows;

        return candidates;
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
        const electionOnVal = await Chicken.getConfigVal('election_on');
        return electionOnVal === 'true';
    }

    static async isElectionTime() {
        const lastElecSecs = await this.lastElecSecs();
        const nextElecSecs = await this.nextElecSecs();
        const nextDeclareSecs = lastElecSecs + this.INTERVAL_SECS + this.DURATION_SECS;

        const nowSecs = parseInt(Date.now() / 1000);

        if (nowSecs >= nextElecSecs && nowSecs <= nextDeclareSecs) return true;

        return false;
    }

}