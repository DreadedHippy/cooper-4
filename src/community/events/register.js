import workPostHandler from "../features/encouragement/workPosted";
import joined from "./members/joined";


export default function registerCommunityEventsHandlers(discordClient) {
  // Handler for a new member has joined
  discordClient.on("guildMemberAdd", joined);
  // TODO: Member left

  // TODO: Add work posted event
  // workPostHandler();
}