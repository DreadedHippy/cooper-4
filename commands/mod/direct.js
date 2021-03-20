import CoopCommand from '../../core/entities/coopCommand';

import UsersHelper from '../../core/entities/users/usersHelper';
import ServerHelper from '../../core/entities/server/serverHelper';


export default class DirectCommand extends CoopCommand {

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

	// TODO: Allow commander to use.
	async run(msg, { target, message }) {
		super.run(msg);

		try {

			await UsersHelper.directMSG(ServerHelper._coop(), target.id, message);
		} catch (e) {
			console.error(e);
		}

	}

};