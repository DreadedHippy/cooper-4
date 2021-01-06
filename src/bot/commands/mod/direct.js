import CoopCommand from '../../core/entities/coopCommand';
import ChannelsHelper from '../../core/entities/channels/channelsHelper';
import ServerHelper from '../../core/entities/server/serverHelper';
import UsersHelper from '../../core/entities/users/usersHelper';
import STATE from '../../state';

export default class directCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'direct',
			group: 'mod',
			memberName: 'direct',
			aliases: [],
			description: 'Information direct our fine community!',
			details: `Details`,
			examples: ['direct', 'direct example?'],
			args: [
				{
					key: 'target',
					prompt: 'Who do you want to dm?',
					type: 'user',
				},
				{
					key: 'message',
					prompt: 'What message would you like to send?',
					type: 'string',
				},
			],
			ownerOnly: true
		});
	}

	async run(msg, { target, message }) {
		super.run(msg);

		try {
			await UsersHelper.directMSG(ServerHelper._coop(), target.id, message);
		} catch (e) {
			console.error(e);
		}

	}

};