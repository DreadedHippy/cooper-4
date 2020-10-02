// Use something like the below to performantly update "feed" channel.
 
// export default (member) => {
//     const guild = member.guild;
//     newUsers.set(member.id, member.user);
  
//     if (newUsers.size > 10) {
//       const userlist = newUsers.map(u => u.toString()).join(" ");
//       defaultChannel.send("Latest messages\n" + userlist);
//     }
// }