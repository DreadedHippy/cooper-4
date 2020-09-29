import joined from "./members/joined";

export default (discordClient) => {
  discordClient.on("guildMemberAdd", joined);
}