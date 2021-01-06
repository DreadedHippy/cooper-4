import CoopCommand from '../../core/entities/coopCommand';
import ChannelsHelper from '../../core/entities/channels/channelsHelper';
import MessagesHelper from '../../core/entities/messages/messagesHelper';

import EMOJIS from '../../core/config/emojis.json';

export default class PollCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'poll',
			group: 'util',
			memberName: 'poll',
			aliases: ['suggest', 'vote', 'suggestion'],
			description: 'polls will always be granted at The Coop to those who ask for them.',
			details: `Details`,
			examples: ['poll', 'poll prefix'],
		});
	}

	async run(msg) {
		// Run as a coop command (clean up the original calling message)
		super.run(msg);

        try {
			// Post in suggestions.
			const pollAcknowledgement = await ChannelsHelper._postToChannelCode('SUGGESTIONS', msg.content);

			// Add reactions for people to use.
			MessagesHelper.delayReact(pollAcknowledgement, EMOJIS.POLL_FOR, 333);
			MessagesHelper.delayReact(pollAcknowledgement, EMOJIS.POLL_AGAINST, 666);

			// Add intended for roadmap, add roadmap reaction for adding to roadmap.
			if (msg.content.toLowerCase().indexOf('roadmap') > -1) {
				MessagesHelper.delayReact(pollAcknowledgement, EMOJIS.ROADMAP, 999);
			}
		
			// Send poll tracking link.
			await msg.direct(
				'I started your poll, track its progress with this link: ' + 
				MessagesHelper.link(pollAcknowledgement) + 
				+ " \n\n\n " + " _ " + msg.content
			);

        } catch(err) {
			console.error(err);
        }
    }
    
};