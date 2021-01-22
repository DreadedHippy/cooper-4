import CHANNELS from '../../../../core/config/channels.json';

import ChannelsHelper from '../../../../core/entities/channels/channelsHelper';
import MessagesHelper from '../../../../core/entities/messages/messagesHelper';

export default async function memberJoined(member) {

  try {
    const welcomeMessage = await ChannelsHelper._postToChannelCode('ENTRY', 
      `**Welcome, <@${member.user.id}> to The Coop**, I am Cooper.` +
      ` We are an referral/invite only community, please introduce yourself. <#${CHANNELS.INTRO.id}>`
    ); 

    // Send direct message and channel message about next steps.
    await member.send(
      'Welcome to The Coop! View your welcome message and next steps here: ' + 
      MessagesHelper.link(welcomeMessage)
    );

  } catch(e) {
    console.error(e)
  }
}