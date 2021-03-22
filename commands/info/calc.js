import CoopCommand from '../../core/entities/coopCommand';
import MessagesHelper from '../../core/entities/messages/messagesHelper';
import fetch from 'node-fetch';
// import fileType from 'file-type';

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

		const queryString =  msg.content.trim().replace('!calc ', '');

		// Guard.
		if (!queryString) return MessagesHelper.selfDestruct(msg, 'Must include an equation/etc for calc.');
		
		const appID = "EL6YXA-LGWAWXQPHE";
		const inputQueryStr = encodeURIComponent(queryString);
		const apiEndpoint = `https://api.wolframalpha.com/v1/simple?appid=${appID}&i=${inputQueryStr}`;

		try {		
			const result = await fetch(apiEndpoint);
	
			if (result) {	
				// Send the buffer
				return msg.channel.send(
					"**!calc result for " + queryString + "**:", 
					{ files: [Buffer.from(await result.buffer())] 
				});
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