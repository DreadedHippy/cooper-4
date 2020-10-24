import CoopCommand from '../../core/classes/coopCommand';

export default class ChopperCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'chopper',
			group: 'misc',
			memberName: 'chopper',
			aliases: [],
			description: 'Information chopper our fine community!',
			details: `Details`,
			examples: ['chopper', 'chopper example?'],
		});
	}

	async run(msg) {
		super.run(msg);
		
		msg.say(`
			\`\`\`
				___.___
				c00D\`=--/
			
			
			
			    ___.___
				c[_]\`=--/  
			
			
			
			   ___.___
				cHHD\`=--/  
			
			
			
			  ___.___
			  -c00D\`=--/  
						
			     ___.___
				-cC0D\`=--/  
				\`\`\`
			`).then((msg) => { 
			setTimeout(() => {
				setTimeout(() => {
					msg.edit('💥').then((msg) => { 
						setTimeout(() => {
							msg.edit('💨').then(msg => {
								setTimeout(() => { msg.delete() }, 200);
							})
						}, 200);
					});
				}, 200)	
			}, 200);
		})
    }
    
};