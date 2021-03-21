import CoopCommand from '../../core/entities/coopCommand';
import MessagesHelper from '../../core/entities/messages/messagesHelper';
import fetch from 'node-fetch';
import { MessageAttachment } from 'discord.js';

export default class CalcCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'calc',
			group: 'info',
			memberName: 'calc',
			aliases: [],
			description: 'Information calc our fine community!',
			details: `Details`,
			examples: ['calc', 'calc example?'],
		});
	}

	// console.log(await result.text());
	async run(msg) {
		super.run(msg);
		
		const appID = "EL6YXA-LGWAWXQPHE";
		const inputQueryStr = encodeURIComponent('5 + 5');
		const apiEndpoint = `https://api.wolframalpha.com/v1/simple?appid=${appID}&i=${inputQueryStr}`;

		try {		
			const result = await fetch(apiEndpoint);
	
			if (result) {
				// const buffer = Buffer.from(result.buffer());
				const attachment = new MessageAttachment(result.arrayBuffer(), 'file.png')
		
				// Send the buffer
				return msg.channel.send(attachment);
			} else {
				throw new Error('API calc failed.')
			}

		} catch(e) {
			// Generate feedback flash
			MessagesHelper.selfDestruct(msg, '!calc failed');
			console.log('!calc failed');
			console.error(e);
		}
    }
    
};