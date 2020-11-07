import embedHelper from '../../../ui/embed/embedHelper';
import CoopCommand from '../../core/classes/coopCommand';
import EMOJIS from '../../core/config/emojis.json';
import ChannelsHelper from '../../core/entities/channels/channelsHelper';
import MessagesHelper from '../../core/entities/messages/messagesHelper';
import UsersHelper from '../../core/entities/users/usersHelper';

export default class SacrificeCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'sacrifice',
			group: 'community',
			memberName: 'sacrifice',
			aliases: [],
			description: 'The command for starting a round of sacrifices.',
			details: `Details of the points command`,
			examples: ['points', 'an example of how coop-econmics functions, trickle down, sunny side up Egg & Reagonmics. Supply and demand.'],

			ownerOnly: true
		});
	}

	async run(msg) {
		super.run(msg);

		try {
			// Get sacrifice target
			let targetUser;
			if (msg.mentions.users.first()) targetUser = msg.mentions.users.first();
			if (!targetUser) throw new Error('Sacrifice target required.');

			// Add message to sacrifice
			const sacrificeEmbed = { embed: embedHelper({ 
				title: `${targetUser.username}, you are being considered for sacrifice!`,
				description: `To sacrifice <@${targetUser.id}> press dagger, to protect the user press the shield.`,
				thumbnail: UsersHelper.avatar(targetUser)
			}) };
			const sacrificeMsg = await ChannelsHelper._postToChannelCode('SACRIFICE', sacrificeEmbed);
			const sacrificeLink = MessagesHelper.link(sacrificeMsg);

			// Post to feed
			setTimeout(() => {
				const sacrificeMsgText = `<@${targetUser.id}> is being considered for sacrifice! Vote now! :O ` + sacrificeLink;
				ChannelsHelper._postToFeed(sacrificeMsgText);
			}, 1500);

			// Add reactions for voting
			setTimeout(async () => { await sacrificeMsg.react(EMOJIS.DAGGER); }, 1500);
			setTimeout(async () => { await sacrificeMsg.react(EMOJIS.SHIELD); }, 2000);

		} catch(e) {
			console.error(e);

			// Create error message.
			const errorMsg = await msg.say(e.message);

			// Delete error message when no longer necessary.
			if (errorMsg) setTimeout(() => { errorMsg.delete(); }, 3000);
		}
    }
    
};