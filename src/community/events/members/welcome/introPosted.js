import EMOJIS from '../../../../bot/core/config/emojis.json';
import ROLES from '../../../../bot/core/config/roles.json';

import ChannelsHelper from '../../../../bot/core/entities/channels/channelsHelper';
import MessagesHelper from '../../../../bot/core/entities/messages/messagesHelper';
import UsersHelper from '../../../../bot/core/entities/users/usersHelper';
import createEmbed from '../../../../ui/embed/embedHelper';

export default async (msg) => {

  try {
    // Ignore Cooper's messages.
    if (msg.author.bot) return false;

    // Access the full featured member object for the user.
    const memberSubject = UsersHelper.getMemberByID(msg.guild, msg.author.id);

    // Check they haven't already posted an intro
    let retrievedIntroLink = null;
    const userIntroData = (await UsersHelper.getIntro(memberSubject)).rows[0] || {};
    if (userIntroData.hasOwnProperty('intro_link')) retrievedIntroLink = userIntroData.intro_link;

    if (retrievedIntroLink) {
      const warningMsg = await msg.reply(
        `You have already posted an intro, only one introduction message allowed.
        Deleting your message in 3 seconds, copy it if you want to preserve it.`
      );
      setTimeout(() => { 
        warningMsg.delete(); 
        setTimeout(() => { 
          msg.delete(); 
        }, 3333);
      }, 3333);
    }
    else {
      // Add intro message link and time to intro
      const introLink = MessagesHelper.link(msg);
      await UsersHelper.setIntro(memberSubject, introLink, Math.floor(+new Date() / 1000));

      // Send avatar + header embed (due to loading jitter issue)
      const username = memberSubject.user.username;

      // Post message in feed
      await ChannelsHelper._postToFeed(`${username} posted an introduction! 👋`);

      // Send embed to approval channel for redeeming non-members via introduction.
      if (!UsersHelper.hasRoleID(memberSubject, ROLES.MEMBER.id)) {
        await ChannelsHelper._postToChannelCode('ENTRY', { embed: createEmbed({
          url: MessagesHelper.link(msg),
          title: `${username}, you are being considered for approval!`,
          description: `To vote for ${username} use the emojis on their intro post.`,
          thumbnail: UsersHelper.avatar(memberSubject.user)
        })});
      }

      await msg.react('👋');
      setTimeout(async () => { await msg.react(EMOJIS.VOTE_FOR); }, 333);
      setTimeout(async () => { await msg.react(EMOJIS.VOTE_AGAINST); }, 666);
    }

  } catch(e) {
    console.error(e)
  }
}