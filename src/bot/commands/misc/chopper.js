import CoopCommand from '../../core/classes/coopCommand';

const chopperTypes = {
	first: {
		bladeOffset: 1,
		blade: '___.___',
		body: 'c00D\`=--/'
	},
	second: {
		bladeOffset: 0,
		blade: '___.___',
		body: 'c[_]\`=--/'
	},
	third: {
		bladeOffset: 0,
		blade: '___.___',
		body: 'cHHD\`=--/'
	},
	fourth: {
		bladeOffset: 0,
		blade: '___.___',
		body: '-c00D\`=--/'
	},
	fifth: {
		bladeOffset: 0,
		blade: '___.___',
		body: '-cC0D\`=--/'
	}
};


const render = (type, blade = true) => {
	const chopper = chopperTypes[type];
	return (
		`${' '.repeat(chopper.bladeOffset)}${blade ? chopper.blade : ''}` +
		+ " \n \n \n \n\n\n\n\n" +
		`${chopper.body}`
	);
};


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

	static async startScreen(msg) {
		return msg.say(`
			\`\`\`
				${render('first')}
				     ${render('first')}
				${render('first')}   ${render('fifth')}
				   ${render('first')}   ${render('third')}   ${render('first')}
				${render('second')}    ${render('first')}        ${render('fourth')}
				\`\`\`
		`);
	}

	static secondScreen(msg) {
		return msg.edit(`
			\`\`\`
				${render('first')}
					${render('second')}
				${render('first')}   ${render('fifth')}
				${render('second')}   ${render('fourth')}   ${render('second')}
				${render('first')}    ${render('third')}        ${render('first')}
				\`\`\`
		`);
	}

	static async animate(msg) {
		msg = await this.startScreen(msg);

		setTimeout(() => {
			this.secondScreen(msg);

			setTimeout(() => {
				msg.edit('💥').then((msg) => { 
					setTimeout(() => {
						msg.edit('💨').then(msg => {
							setTimeout(() => { msg.delete() }, 200);
						})
					}, 2000);
				});
			}, 2000)	
		}, 2000);
	}

	async run(msg) {
		super.run(msg);

		this.animate(msg);
    }
    
};