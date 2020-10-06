export default class VotingHelper {

  static getResults(collected) {
    return _calcResults(collected.map(reactionType => {
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

  static trackVoting(msg, member, requiredVotes) {
  
    const filter = (reaction, user) => {
      const emoji = reaction.emoji.name;
      const valid = [forEmoji, againstEmoji].includes(emoji);
  
      // Don't count bot votes.
      if (user.bot) return false;
  
      // Don't count bot votes or invalid reactions.
      if (!valid) return false;
  
      // Make sure user has member role to vote, which will also block self-voting.
      const votingMember = msg.channel.guild.members.cache.find(member => member.id === user.id);
      const authorized = memberHasSomeOfRoleNames(msg.guild, votingMember, ['member 💛‍']);
      if (valid && !authorized) return false;
  
      // TODO: Update embed
  
      return true;
    };
  
    const collector = msg.createReactionCollector(filter, { time: collectionDuration });
    
    collector.on('end', collected => {
      const results = getResults(collected);
      const adjustedReq = requiredVotes + results.against;
  
      msg.channel.send(`<@${member.user.id}>, we have decided your fate. Here is the result:` +
        `\n\n ${(forEmoji).repeat(results.yes)}` +
        `\n ${(againstEmoji).repeat(results.against)} \n\n` +
  
        MessagesHelper.noWhiteSpace`
          <:twisty_rope:739153442341388421> 
          \n\n ${results.yes} For ${forEmoji} /
          ${results.against} Against ${againstEmoji} /
          ${adjustedReq} (+${results.against} ${againstEmoji}) Required 
          <:twisty_rope:739153442341388421>`
      );
  
      // Respond to election result.
      const won = results.yes >= adjustedReq;
  
      if (won) {
        try {
          // Post in feed, newest member
          ChannelsHelper._postToFeed(`${member.user.id} was granted membership!`);
  
          // Display result.
          const newMemberRoles = getRoles(msg.guild, ['member 💛‍', 'beginner 🥚', 'announcement-subscriber']);
          member.roles.add(newMemberRoles);
  
          // TODO: DM, ask if they want themob and/or are-very-social roles.
          
        } catch(e) {
          console.error(e);
        }
        
      } else {
        // Kick the person out with a warning.
        msg.channel.send('From our community, you have been rejected. Do not feel disrespected, you will now be ejected.');
      }
    });
  }
}

