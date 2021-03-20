import ItemsHelper from '../../community/features/items/itemsHelper';
import CoopCommand from '../../core/entities/coopCommand';
import MessagesHelper from '../../core/entities/messages/messagesHelper';
import ServerHelper from '../../core/entities/server/serverHelper';
import UsersHelper from '../../core/entities/users/usersHelper';
import EMOJIS from '../../core/config/emojis.json';

export default class ChristmasCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'christmas',
			group: 'misc',
			memberName: 'christmas',
			aliases: [],
			description: 'Information christmas our fine community!',
			details: `Details`,
			examples: ['christmas', 'christmas example?'],
			args: [
				{
					key: 'user',
					prompt: 'Who do you wish to give the item to? @ them.',
					type: 'user',
					default: null
				},
			],
			ownerOnly: true
		});
	}

	async run(msg, { user }) {
		super.run(msg);
		
		// const eggEmoji = MessagesHelper.emojiText(EMOJIS.CHRISTMAS_EGG);
		// const coopEmoji = MessagesHelper.emojiText(EMOJIS.COOP);
		// const msgText = `You were given a Christmas Egg ${eggEmoji} as a reward,` +
		// 	` thank you for being part of The Coop! ${coopEmoji}\n` +
		// 	`Merry Christmas, ${user.username}!`;

		// await ItemsHelper.add(user.id, 'CHRISTMAS_EGG', 1)
		// await UsersHelper.directMSG(ServerHelper._coop(), user.id, msgText);
    }
    
};