import CoopCommand from '../../core/entities/coopCommand';

import CHANNELS from '../../core/config/channels.json';

import ElectionHelper from '../../community/features/hierarchy/election/electionHelper';
import ChannelsHelper from '../../core/entities/channels/channelsHelper';
import MessagesHelper from '../../core/entities/messages/messagesHelper';



export default class StandCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'stand',
			group: 'election',
			memberName: 'stand',
			aliases: [],
			description: 'Offer yourself as a potential leader/commander.',
			details: ``,
			examples: ['stand', '!stand {?message?}'],
			args: [
				{
					key: 'campaignText',
					prompt: 'Please provide your written electoral campaign message.',
					type: 'string',
				},
			],
		});
	}

	async run(msg, { campaignText }) {
		super.run(msg);

		const { id: userID, username } = msg.author;

		console.log(userID, username);

		try {
			// Prevent bad campaign texts.
			if (campaignText.length < 30) {
				return MessagesHelper.selfDestruct(
					msg, 
					`${msg.author.username} rewrite campaign message, insufficient.`
				);
			}

			// Check if election is ongoing.
			const isElec = await ElectionHelper.isElectionOn();
	
			if (!isElec) {
				const nextElecFmt = await ElectionHelper.nextElecFmt();
				const noElecText = `There is no election currently ongoing. Next is ${nextElecFmt}`;
				return MessagesHelper.selfDestruct(msg, noElecText);
			}
	
	
			// Check if user is not already a candidate.
			const prevCandidtate = await ElectionHelper.getCandidate(msg.author.id);
			if (!prevCandidtate) {
				MessagesHelper.selfDestruct(msg, `${msg.author.username}, you wanna stand for election, eyyy?`);
	
				// Save message link from election channel
				const electionMsg = await ChannelsHelper._postToChannelCode('ELECTION', 
					`Campaign Ad - ${author.toString()}:\n\n${campaignText}`
				);
				const msgLink = MessagesHelper.link(electionMsg);

				// Add candidate to election
				await ElectionHelper.addCandidate(msg.author.id, msgLink);

				// Post to feed
				ChannelsHelper._postToFeed(`${msg.author.username} was put forward for <#${CHANNELS.ELECTION.id}>`);
				
				// Add coop emoji to campaign message and crown
				MessagesHelper.delayReact(electionMsg, '👑', 666);
			} else {
				// If is already, ask them if they want to replace their campaign text if current message.
				const wannaEditMsg = await msg.say(`${msg.author.username}, react to change your campaign message?`);
				// TODO: create awaitReaction
				MessagesHelper.delayReact(wannaEditMsg, '👑', 666);
				MessagesHelper.delayDelete(wannaEditMsg, 30000);
			}

		} catch(e) {
			console.error(e);
			console.log('!stand failed.');
		}
    }
    
};