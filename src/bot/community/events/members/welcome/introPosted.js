import EMOJIS from '../../../../core/config/emojis.json';
import ROLES from '../../../../core/config/roles.json';

import ChannelsHelper from '../../../../core/entities/channels/channelsHelper';
import MessagesHelper from '../../../../core/entities/messages/messagesHelper';
import UsersHelper from '../../../../core/entities/users/usersHelper';

import TimeHelper from '../../../features/server/timeHelper';

export default async (msg) => {

  try {
    // Ignore Cooper's messages.
    if (msg.author.bot) return false;

    // Access the full featured member object for the user.
    const memberSubject = UsersHelper.getMemberByID(msg.guild, msg.author.id);

    // Check they haven't already posted an intro
    let retrievedIntroLink = null;
    const userIntroData = await UsersHelper.getIntro(memberSubject) || {};
    if (userIntroData.hasOwnProperty('intro_link')) retrievedIntroLink = userIntroData.intro_link;

    if (retrievedIntroLink) {
      const warningMsg = await msg.reply(
        `**You have already posted an intro**, only one introduction message allowed. \n\n` +
        `Deleting your message in 3 seconds, copy it if you want to preserve it.`
      );

      // Delete two messages. 
      MessagesHelper.delayDelete(warningMsg, 3333);
      MessagesHelper.delayDelete(msg, 3333 * 2);

    } else {
      // Add intro message link and time to intro
      const introLink = MessagesHelper.link(msg);
      await UsersHelper.setIntro(memberSubject, introLink, TimeHelper._secs());

      // Send avatar + header embed (due to loading jitter issue)
      const username = memberSubject.user.username;

      // Post message in feed
      await ChannelsHelper._codes(['FEED', 'ENTRY'], `${username} posted an introduction! 👋`);

      // Send embed to approval channel for redeeming non-members via introduction.
      if (!UsersHelper.hasRoleID(memberSubject, ROLES.MEMBER.id)) {
        await ChannelsHelper._postToChannelCode('ENTRY', MessagesHelper.embed({
          url: MessagesHelper.link(msg),
          title: `${username}, you are being considered for approval!`,
          description: `Vote for/against ${username} using reaction emojis on their intro message.`,
          thumbnail: UsersHelper.avatar(memberSubject.user)
        }));
      }

      // Add helpful emoji reaction suggestions to the message.
      MessagesHelper.delayReact(msg, '👋', 333);
      MessagesHelper.delayReact(msg, EMOJIS.VOTE_FOR, 666);
      MessagesHelper.delayReact(msg, EMOJIS.VOTE_AGAINST, 999);
    }

  } catch(e) {
    console.error(e)
  }
}