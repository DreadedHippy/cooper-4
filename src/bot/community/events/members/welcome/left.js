import ChannelsHelper from '../../../../core/entities/channels/channelsHelper';
import ServerHelper from '../../../../core/entities/server/serverHelper';
import UsersHelper from '../../../../core/entities/users/usersHelper';
import STATE from '../../../../state';

export default async function memberLeft(member) {

  try {
    const server = ServerHelper.getByCode(STATE.CLIENT, 'PROD');
    await ChannelsHelper
      .getByCode(server, 'FEED')
      .send(`${member.user.username} has flown the coop. F for ${member.user.username}`); 

    // Remove from database and cascade all other entries (optimisation)
    await UsersHelper.removeFromDatabase(member);

    // TODO: Post in leaders channel.

  } catch(e) {
    console.error(e)
  }
}