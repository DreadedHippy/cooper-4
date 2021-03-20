import SacrificeHelper from '../../community/features/events/sacrificeHelper';
import TimeHelper from '../../community/features/server/timeHelper';
import CoopCommand from '../../core/entities/coopCommand';
import MessagesHelper from '../../core/entities/messages/messagesHelper';
import UsersHelper from '../../core/entities/users/usersHelper';


export default class LastMessageCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'lastmsg',
			group: 'messages',
			memberName: 'lastmsg',
			aliases: [],
			description: 'Check last message date',
			details: ``,
			examples: ['lastmsg'],
			args: [
				{
					key: 'targetUser',
					prompt: 'Whose last message are you trying to check?',
					type: 'user',
					default: ''
				},
			]
		});
	}

	// Find the last sacrifice time of a user.
	async run(msg, { targetUser }) {
		super.run(msg);

		// Without any target
		if (targetUser === '') targetUser = msg.author;

		// Requires a valid user.
		if (!targetUser) 
			return MessagesHelper.selfDestruct(msg, '!lastmsg requires a valid user target to provide results.');

		// Default status for last sacrifice date.
		let lastMsgFmt = 'unknown';

		// Load and format last sacrifice time.
		const lastMsgSecs = await UsersHelper.getField(targetUser.id, 'last_msg_secs')
		if (lastMsgSecs) lastMsgFmt = TimeHelper.secsLongFmt(lastMsgSecs);
		
		// Provide the result to the user.
		const msgText = `${targetUser.username}'s last message was: ${lastMsgFmt}.`;
		MessagesHelper.selfDestruct(msg, msgText);
    }
    
};