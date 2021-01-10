import moment from 'moment';

import ChannelsHelper from "../../../../core/entities/channels/channelsHelper";
import MessagesHelper from '../../../../core/entities/messages/messagesHelper';
import ServerHelper from '../../../../core/entities/server/serverHelper';
import UsersHelper from '../../../../core/entities/users/usersHelper';
import Database from '../../../../core/setup/database';
import Chicken from "../../../chicken";
import TimeHelper from '../../server/timeHelper';

import CHANNELS from '../../../../core/config/channels.json';
import STATE from '../../../../state';
import DatabaseHelper from '../../../../core/entities/databaseHelper';

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

    static async addVote(userID, candidateID) {
        const query = {
            name: "add-vote",
            text: `INSERT INTO election_votes(candidate_id, voter_id, time)
                VALUES($1, $2, $3)`,
            values: [userID, candidateID, (parseInt(Date.now() / 1000))]
        };
        
        const result = await Database.query(query);
        return result;
    }

    static async clearElection() {
        // vv same as below but for votes.
        await this.clearVotes();
        await this.clearCandidates();
    }

    static async clearVotes() {
        const query = {
            name: "delete-votes",
            text: `DELETE FROM election_votes`
        };
        
        const result = await Database.query(query);
        return result;
    }

    static async clearCandidates() {
        const candidates = await this.getAllCandidates();
        
        // Bulk delete may be better here.
        // Ensure all messages deleted, use bulk delete won't be outside of 14 days
        candidates.map((candidate, index) => {
            setTimeout(() => {
                MessagesHelper.deleteByLink(candidate.campaign_msg_link);
            }, 1500 * index);
        });

        // Clear database
        const query = {
            name: "delete-candidates",
            text: `DELETE FROM candidates`
        };
        const result = await Database.query(query);
        return result;
    }

    static async isVotingPeriod(electionSecs) {
        const nowSecs = parseInt(Date.now() / 1000);
        const votingDurSecs = this.DURATION_SECS;
        const isVotingPeriod = !!(nowSecs >= electionSecs && nowSecs <= electionSecs + votingDurSecs);
        return isVotingPeriod;
    }

    static async startElection() {
        try {
            ChannelsHelper._postToFeed('Starting the election...');
    
            // Turn election on and set latest election to now! :D
            await Chicken.setConfig('election_on', 'true');
            await Chicken.setConfig('last_election', parseInt(Date.now() / 1000));
    
            // Update the election message
            // TODO: Calculate and add time remaining here!!! :D :D :D READABLE SHIT.
            await this.editElectionInfoMsg('The election is currently ongoing! Time remaining... who knows?');

        } catch(e) {
            console.log('Starting the election failed... :\'(');
            console.error(e);
        }

    }

    static async commentateElectionProgress() {
        // Provide updates and functionality for an ongoing election.
        console.log('ongoing');
        const votes = await this.fetchAllVotes();
        console.log(votes);

        await ChannelsHelper._postToFeed('Election is ongoing! Should post updates.');

        // Save community reaction backed counts to database/ovewrite.
    }

    static async endElection() {
        try {
            const votes = await this.fetchAllVotes();
            
            console.log('Ending the election!', votes);
            
            // Get winners hierarchy
            // Slatxyo could convert that to an embed hopefully.
            ChannelsHelper._postToFeed('Ending the election...');

            // Cleanup database records fresh for next run.
            await this.clearElection();

            // Set Cooper's config election_on to 'false' so he does not think election is ongoing.
            await Chicken.setConfig('election_on', 'false');

            // Set the election info message to next election data, previous winners.
            await this.editElectionInfoMsg('Election ended... next will be?');

        } catch(e) {
            console.log('Something went wrong ending the election...');
            console.error(e);
        }
    }

    static async checkProgress() {
        try {
            const nextElecSecs = await this.nextElecSecs();
            const isVotingPeriod = await this.isVotingPeriod(nextElecSecs);
            const isElecOn = await this.isElectionOn();
            let electionStarted = false;

            console.log('checking pwooooogreesssssss');

            // TODO: May need to clean up any non-info/candidates messages leftover.

            // Election needs to be started?
            if (isVotingPeriod && !isElecOn) {
                await this.startElection();
                electionStarted = true;
            }
    
            // Election needs to be declared?
            if (!isVotingPeriod && isElecOn) await this.endElection();
    
            // Election needs to announce update?
            if (isVotingPeriod && isElecOn) await this.commentateElectionProgress();

            // If election isn't running (sometimes) update about next election secs.
            if (!isElecOn && !electionStarted) { // dev only <--

                // Can get time of last edit to see if it's worth doing...? Countdown every muhhhhhhhhh.

                console.log('Editing election message with next elec time! :D');

                const diff = await ElectionHelper.nextElecSecs() - parseInt(Date.now() / 1000)
                const humanRemaining = moment.duration(diff).humanize();
                const nextElecReadable = await this.nextElecFmt();
                await this.editElectionInfoMsg(`Next Election: ${nextElecReadable} (${humanRemaining})`);

                // Load message and edit to:
                // Election is not currently running, next is:
                // Or if is on, edit to current hierarchy
            }

        } catch(e) {
            console.log('SOMETHING WENT WRONG WITH CHECKING ELECTION!');
            console.error(e);
        }
    }

    static async editElectionInfoMsg(text) {
        const electionInfoMsgLink = await Chicken.getConfigVal('election_message_link');
        const msgData = MessagesHelper.parselink(electionInfoMsgLink);

        console.log(msgData);

        const channel = ChannelsHelper._get(msgData.channel);
        const msg = await channel.messages.fetch(msgData.message);
        const editedMsg = await msg.edit(text);
        return editedMsg;
    }

    static async getVoteByVoterID(voterID) {
        let voter = null;
        const query = {
            name: "get-voter",
            text: `SELECT * FROM election_votes WHERE voter_id = $1`,
            values: [voterID]
        };
        
        const result = await Database.query(query);

        if (result.rows) voter = result.rows[0];

        return voter;
    }

    // Check if this reaction applies to elections.
    static async onReaction(reaction, user) {
        // Check if occurred in election channel
        if (reaction.message.channel.id !== CHANNELS.ELECTION.id) return false;

        // Ignore Cooper's prompt emoji.
        if (UsersHelper.isCooper(user.id)) return false;

        // Check if reaction is crown (indicates vote)
        if (reaction.emoji.name !== '👑') return false;

        // Check if reaction message is a campaign message and get author.
        const msgLink = MessagesHelper.link(reaction.message);
        const candidate = await this.getCandByMsgLink(msgLink); 

        // If is candidate message and identified, allow them the vote.
        if (candidate) {
            // Check if already voted
            const vote = await this.getVoteByVoterID(user.id);
            console.log(vote);

            if (vote) {
                // self destruct message stating you've already voted.
                console.log('existing vote');
                console.log('you already voted for $1 this election, you cheeky fluck.');
                return false;
            }

            if (!vote) {
    
                // Add vote to database
                await this.addVote(user.id, candidate.candidate_id);

                // Need ot load candidate via cache id, no access YET.
                console.log('voted for candidate id ' + candidate.candidate_id);
    
                // Acknowledge vote in feed.
            }
        }
        console.log(candidate);
    }

    static async countVotes() {
        const query = {
            name: "get-candidate",
            text: `SELECT candidateID, COUNT(*) FROM votes GROUP BY candidateID`,
            values: [userID]
        };

        const result = await Database.query(query);
        return result;
    }

    static async calcHierarchy(votes) {

    }

    static async loadAllCampaigns() {
        const candidates = await this.getAllCandidates();
        const preloadMsgIDs = candidates.map(candidate => 
            MessagesHelper.parselink(candidate.campaign_msg_link)
        );

        // Preload each candidate message.
        const campaigns = await Promise.all(preloadMsgIDs.map((idSet, index) => {
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
        return campaigns;
    }

    static async getCandByMsgLink(msgLink) {
        const query = {
            name: "get-candidate-by-msg",
            text: `SELECT * FROM candidates WHERE campaign_msg_link = $1`,
            values: [msgLink]
        };

        let candidate = null;
        const result = await Database.query(query);

        if (result.rows) candidate = result.rows[0];

        return candidate;
    }

    static async fetchAllVotes() {
        const votes = [];

        // Candidates for access later.
        const candidates = await this.getAllCandidates();
        const campaignMsgs = await this.loadAllCampaigns();

        // Calculate votes and map author data.
        campaignMsgs.map(campaignMsg => {
            // Calculate the author from storage.
            const campaignAuthor = candidates.reduce((acc, cand) => {
                const campLink = cand.campaign_msg_link;
                const candLink = MessagesHelper.link(campaignMsg);
                const user = UsersHelper._getMemberByID(cand.candidate_id).user || null;
                const username = user.username || null;
                cand.username = username;
                if (campLink === candLink) return acc = cand;
            }, null);        
    
            // TODO: could use this feature/data to direct message the candidates an update

            // Add to the overall data.
            votes.push({
                username: campaignAuthor.username,
                id: campaignAuthor.id,
                votes: campaignMsg.reactions.cache.reduce((acc, reaction) => {
                    // Count all crown reactions.
                    if (reaction.emoji.name === '👑') return acc += (reaction.count - 1);
                    else return 0;
                }, 0)
            });
        });

        // Dev testing only.
        // votes.push({
        //     username: 'example',
        //     id: 'tester',
        //     votes: 15
        // });

        // Replaces this line: votes = votes.sort((a, b) => a.votes > b.votes);
        // Ensure in highest order first.
   
        votes.sort((a, b) => {
            if (a.votes < b.votes) return 1;
            if (a.votes > b.votes) return -1;
            return 0;
        });

        return votes;
    }

    static async getCandidate(userID) {
        const query = {
            name: "get-candidate",
            text: `SELECT * FROM candidates WHERE candidate_id = $1`,
            values: [userID]
        };
        
        const result = await Database.query(query);
        const candidate = DatabaseHelper.single(result);

        return candidate;
    }


    // Preload campaign messages into cache so they are always reactable.
    static async onLoad() {
        console.warn('should cache candidate messages here');

        const candidates = await this.loadAllCampaigns();

        return candidates;
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