import CHANNELS_DATA from '../../../bot/core/config/channels.json';
import STATE from '../../../bot/state';

export default async (member) => {

  try {
    const hell = STATE.CLIENT.channels.cache.find(channel => channel.id === CHANNELS_DATA.ENTRY.id);
    hell.send('**' + member.user.username + '**, has joined the server!'); 

    // TODO: Send direct message and channel message about next steps.

  } catch(e) {
    console.error(e)
  }
}