import CHANNELS_DATA from '../../../bot/core/config/channels.json';
import STATE from '../../../bot/state';

export default async (member) => {

  try {
    const hell = STATE.CLIENT.channels.cache.find(channel => channel.id === CHANNELS_DATA.ENTRY.id);
    hell.send(
      `Welcome <@${member.user.id}> to The Coop, I am the chicken that guards the realm of hen.` +
      `You may be wondering what the next steps are. We are too, but you are here now - that is all that matters.`
    ); 

    // TODO: Send direct message and channel message about next steps.

  } catch(e) {
    console.error(e)
  }
}