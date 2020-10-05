import CHANNELS_DATA from '../../../../bot/core/config/channels.json';
import ChannelsHelper from '../../../../bot/core/entities/channels/channelsHelper';
import ServerHelper from '../../../../bot/core/entities/server/serverHelper';
import STATE from '../../../../bot/state';

export default async (member) => {

  try {
    const notice = `${member.user.username} posted an introduction! 👋`;

    // Post message in hell and feed
    const server = ServerHelper.getByCode(STATE.CLIENT, 'PROD');
    ChannelsHelper.sendByCodes(server, ['ENTRY', 'FEED'], notice);

  } catch(e) {
    console.error(e)
  }
}