import CHANNELS_DATA from '../../../bot/core/config/channels.json';
import STATE from '../../../bot/state';

export default async (member) => {

  try {
    const hell = STATE.CLIENT.channels.cache.find(channel => channel.id === CHANNELS_DATA.ENTRY.id);
    hell.send(
      `Welcome <@${member.user.id}> to The Coop, I am Cooper.` +
      ` We are an referral/invite only community, please introduce yourself.` +
      ` Convinuce our members why they should approve your entry to the full server, nothing personal, just business! Good cluck.`
    ); 

    // TODO: Send direct message and channel message about next steps.

  } catch(e) {
    console.error(e)
  }
}