import ItemsHelper from '../../../bot/community/features/items/itemsHelper';
import CoopCommand from '../../core/entities/coopCommand';
import MessagesHelper from '../../core/entities/messages/messagesHelper';
import EMOJIS from '../../../bot/core/config/emojis.json';
import { Message } from 'discord.js';
import ServerHelper from '../../core/entities/server/serverHelper';

export default class DropCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'drop',
			group: 'economy',
			memberName: 'drop',
			aliases: ['d'],
			description: 'This command lets you drop the items you own',
			details: `Details of the drop command`,
			examples: ['drop', '!drop laxative'],
			args: [
				{
					key: 'itemCode',
					prompt: 'What is the code of the item you wish to drop? Use !items if not sure',
					type: 'string'
				},
			],
		});
	}

	async run(msg, { itemCode }) {
		super.run(msg);

		try {
			itemCode = ItemsHelper.parseFromStr(itemCode);

			const usableItems = ItemsHelper.getUsableItems();
			const noMatchErrText = `${itemCode} is an invalid item name..`;
			if (!usableItems.includes(itemCode)) 
				return MessagesHelper.selfDestruct(noMatchErrText);
	
			const didUse = await ItemsHelper.use(msg.author.id, itemCode, 1);
			if (didUse) {
				// Drop the item based on its code.
				const emojiText = MessagesHelper.emojiText(EMOJIS[itemCode]);
				const dropMsg = await msg.say(emojiText);

				// TODO: Add to statistics.
	
				// Make it a temporary message to it gets cleaned up after an hour.
				ServerHelper.addTempMessage(msg, 60 * 60);
	
				// Add indicative and suggestive icons, maybe refactor.
				MessagesHelper.delayReact(dropMsg, EMOJIS.DROPPED, 333);
				MessagesHelper.delayReact(dropMsg, EMOJIS.BASKET, 666);

				// Add success feedback message. (Could edit instead)
				const emoji = MessagesHelper.emojiText(EMOJIS[itemCode]);
				const userDroppedText = `${msg.author.username} dropped ${itemCode} ${emoji}.`;
				MessagesHelper.selfDestruct(userDroppedText);
			}
	
		} catch(e) {
			console.log('Error with drop command.');
			console.error(e);
		}

    }
    
};