import CHANNELS_DATA from '../../../../bot/core/config/channels.json';
import ChannelsHelper from '../../../../bot/core/entities/channels/channelsHelper';
import ServerHelper from '../../../../bot/core/entities/server/serverHelper';

import STATE from '../../../../bot/state';

export default async function memberJoined(member) {

  try {
    const server = ServerHelper.getByCode(STATE.CLIENT, 'PROD');
    const hell = ChannelsHelper.getByCode(server, 'ENTRY');

    hell.send(
      `Welcome <@${member.user.id}> to The Coop, I am Cooper.` +
      ` We are an referral/invite only community, please introduce yourself.` +
      ` Convince our members why they should approve your entry to the full server, nothing personal, just business! Good cluck.`
    ); 

    // TODO: Send direct message and channel message about next steps.

    // TODO: Add to database

  } catch(e) {
    console.error(e)
  }
}