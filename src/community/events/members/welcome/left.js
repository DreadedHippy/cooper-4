import ChannelsHelper from '../../../../bot/core/entities/channels/channelsHelper';
import ServerHelper from '../../../../bot/core/entities/server/serverHelper';
import STATE from '../../../../bot/state';

export default async function memberLeft(member) {

  try {
    const server = ServerHelper.getByCode(STATE.CLIENT, 'PROD');
    await ChannelsHelper
      .getByCode(server, 'FEED')
      .send(`${member.user.username} has flown the coop. F for ${member.user.username}`); 

    // TODO: Post in leaders channel.

  } catch(e) {
    console.error(e)
  }
}