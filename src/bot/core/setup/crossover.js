import Redis from "./redis";

import ServerHelper from "../entities/server/serverHelper";
import UsersHelper from "../entities/users/usersHelper";

import ROLES from "../config/roles.json";

export default class Crossover {

    // Load important data into redis for website consumtion.
    static async load() {
        console.log('Redis connected, refreshing crossover data.');
        Redis.connection.flushall((err, success) => {            
            if (err) console.error(err);
            if (success) this.setHierarchy(this.getHierarchy());
        });
    }

    static getHierarchy() {
        const guild = ServerHelper._coop();
        return {
            commander: UsersHelper.getMembersByRoleID(guild, ROLES.COMMANDER.id).first(),
            leaders: UsersHelper.getMembersByRoleID(guild, ROLES.LEADER.id),
            memberCount: guild.memberCount
        };
    }

    static async setHierarchy(hierarchy) {
        return Promise.all([
            new Promise((resolve, reject) => {
                Redis.connection.set(`memberCount`, hierarchy.memberCount, (err, reply) => {
                    if(err) reject(err);
                    else resolve(reply);
                });
            }),
            new Promise((resolve, reject) => {
                const entryData = {
                    username: hierarchy.commander.user.username,
                    id: hierarchy.commander.user.id
                };

                Redis.connection.set(`commander`, JSON.stringify(entryData), (err, reply) => {
                    if (err) reject(err); else resolve(reply);
                });
            }), 
            ...hierarchy.leaders.map(leader => {
                const entryData = {
                    username: leader.user.username,
                    id: leader.user.id
                };

                return new Promise((resolve, reject) => {
                    Redis.connection.hmset(
                        `leaders`, 
                        leader.user.id, 
                        JSON.stringify(entryData), 
                        (err, reply) => {
                            if (err) reject(err);
                            else resolve(reply);
                        }
                    );
                });
            })
        ]);
    }

    static async loadHiearchy() {
        const commander = await new Promise((resolve, reject) => {
            Redis.connection.get('commander', (err, result) => {
                console.log(err, result);
                if (err) reject(err);
                else resolve(result);
            });
        });

        const leaders = await new Promise((resolve, reject) => {
            Redis.connection.hgetall('leaders', (err, result) => {
                console.log(err, result);
                if (err) reject(err);
                else resolve(result);
            });
        });

        const memberCount = await new Promise((resolve, reject) => {
            Redis.connection.get('memberCount', (err, result) => {
                console.log(err, result);
                if (err) reject(err);
                else resolve(result);
            });
        });

        return { 
            commander, 
            leaders,
            memberCount
        };
    }
}
