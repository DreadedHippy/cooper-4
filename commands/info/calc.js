import CoopCommand from '../../core/entities/coopCommand';
import MessagesHelper from '../../core/entities/messages/messagesHelper';
import fetch from 'node-fetch';
import fileType from 'file-type';

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
				// const response = await fetch('https://octodex.github.com/images/Fintechtocat.png');
				// const buffer = await response.buffer();
				// const type = await fileType.fromBuffer(buffer)

				// console.log('buffer, buffer, buffer, buffer buffer, buffer, buffer, buffer, buffer, buffer, buffer, buffer');
				// console.log('buffer, buffer, buffer, buffer buffer, buffer, buffer, buffer, buffer, buffer, buffer, buffer');
				// console.log('buffer, buffer, buffer, buffer buffer, buffer, buffer, buffer, buffer, buffer, buffer, buffer');
				// console.log(buffer);

				// console.log('type, type, type, type type, type, type, type, type, type, type, type');
				// console.log('type, type, type, type type, type, type, type, type, type, type, type');
				// console.log('type, type, type, type type, type, type, type, type, type, type, type');
				// console.log(type);


				// Send the buffer
				return msg.channel.send({
					attachment: await result.buffer(), 
					name: 'file.png'
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