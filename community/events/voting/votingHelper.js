import UsersHelper from "../../../core/entities/users/usersHelper";


export default class VotingHelper {

  static getNumRequired(guild, rate) {
    return Math.ceil(UsersHelper.count(guild) * rate);
  }

  static getResults(collected) {
    return this._calcResults(collected.map(reactionType => {
      return {
        name: reactionType.emoji.name,
        count: reactionType.count
      };
    }));
  }
  
  static _calcResults(results) {
    // Remove Cooper's initial emojis (prompts)
    const yes = (results[0] || { count: 1 }).count - 1;
    const against = (results[1] || { count: 1 }).count - 1;
    return { yes, against };
  }

  static create(msg, filter, duration) {
    return msg.createReactionCollector(filter, { time: duration });
  }

}

