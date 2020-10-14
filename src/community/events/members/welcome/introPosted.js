import EMOJIS from '../../../../bot/core/config/emojis.json';
import ChannelsHelper from '../../../../bot/core/entities/channels/channelsHelper';
import ServerHelper from '../../../../bot/core/entities/server/serverHelper';
import STATE from '../../../../bot/state';

export default async (msg) => {

  try {
    // TODO: Check they haven't already posted an intro
    // TODO: Add intro message link column into users table

    // Form the notice message.
    const notice = `${msg.author.username} posted an introduction! 👋`;

    // Post message in hell and feed
    const server = ServerHelper.getByCode(STATE.CLIENT, 'PROD');
    ChannelsHelper.sendByCodes(server, ['ENTRY', 'FEED'], notice);


    await msg.react('👋');
    setTimeout(() => { await msg.react(EMOJIS.VOTE_FOR); }, 333);
    setTimeout(() => { await msg.react(EMOJIS.VOTE_AGAINST); }, 666);

  } catch(e) {
    console.error(e)
  }
}