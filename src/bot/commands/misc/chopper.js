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
		`\n` +
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
		return msg.edit("```" + `\n` +
		`	   ___.___` + `\n` +
		`	   0c00D\`=--/` + `\n` +
		` ` + `\n` +
		`		___.___` + `\n` +
		`	    0c[_]\`=--/` + `\n` +
		` ` + `\n` +
		`	 ___.___        ___.___` + `\n` +
		`	0c00D\`=--/   0-cC0D\`=--/` + `\n` +
		"```")
	}


	static secondScreen(msg) {
		return msg.edit("```" + `\n` +
		`	    .` + `\n` +
		`	 0c00D\`=--/` + `\n` +
		` ` + `\n` +
		`	   .` + `\n` +
		`	0c[_]\`=--/` + `\n` +
		` ` + `\n` +
		`   .              .` + `\n` +
		`0c00D\`=--/   0-cC0D\`=--/` + `\n` +
		"```")
	}

	static thirdScreen(msg) {
		return msg.edit("```" + `\n` +
		`   ___.___` + `\n` +
		`   0c00D\`=--/` + `\n` +
		` ` + `\n` +
		`  ___.___` + `\n` +
		`  0c[_]\`=--/` + `\n` +
		` ` + `\n` +
		`___.___       ___.___` + `\n` +
		`0c00D\`=--/  0-cC0D\`=--/` +  `\n` +
		"```")
	}

	static fourthScreen(msg) {
		return msg.edit("```" + `\n` +
		`       .   ` + `\n` +
		`	0c00D\`=--/`+ `\n` +
		` ` + `\n` +
		`    .   ` + `\n` +
		` 0c[_]\`=--/` +  `\n` +
		` ` + `\n` +
		` .               .   ` + `\n` +
		`00D\`=--/    0-cC0D\`=--/` + `\n` +
		"```")
	}

	static fourthScreen(msg) {
		return msg.edit("```" + `\n` +
		` ___.___   ` + `\n` +
		` 0c00D\`=--/`+ `\n` +
		` ` + `\n` +
		`   ___.___   ` + `\n` +
		`   0c[_]\`=--/` +  `\n` +
		` ` + `\n` +
		`_.___          ___.___` + `\n` +
		`00D\`=--/     0-cC0D\`=--/` + `\n` +
		"```")
	}

	static fifthScreen(msg) {
		return msg.edit("```" + `\n` +
		`    .   ` + `\n` +
		` 0c00D\`=--/`+ `\n` +
		` ` + `\n` +
		` .      ` + `\n` +
		`[_]\`=--/` +  `\n` +
		` ` + `\n` +
		`              .` + `\n` +
		`D\`=--/   0-cC0D\`=--/` + `\n` +
		"```")
	}

	static sixthScreen(msg) {
		return msg.edit("```" + `\n` +
		`_.___   ` + `\n` +
		`00D\`=--/`+ `\n` +
		` ` + `\n` +
		`___      ` + `\n` +
		`]\`=--/` +  `\n` +
		` ` + `\n` +
		`__     ___.___              ` + `\n` +
		`=--/  0-cC0D\`=--/` + `\n` +
		"```")
	}

	static seventhScreen(msg) {
		return msg.edit("```" + `\n` +
		` ` + `\n` +
		`\`=--/`+ `\n` +
		` ` + `\n` +
		` ` + `\n` +
		`--/` +  `\n` +
		` ` + `\n` +
		`           .              ` + `\n` +
		`-/     0-cC0D\`=--/` + `\n` +
		"```")
	}

	static eigthScreen(msg) {
		return msg.edit("```" + `\n` +
		` ` + `\n` +
		`-/`+ `\n` +
		` ` + `\n` +
		` ` + `\n` +
		` ` +  `\n` +
		` ` + `\n` +
		`   ___.___             ` + `\n` +
		`  0-cC0D\`=--/` + `\n` +
		"```")
	}


	static ninthScreen(msg) {
		return msg.edit("```" + `\n` +
		` ` + `\n` +
		` ` + `\n` +
		` ` + `\n` +
		` ` + `\n` +
		` ` +  `\n` +
		` ` + `\n` +
		`.` + `\n` +
		`0D\`=--/` + `\n` +
		"```")
	}

	static tenthScreen(msg) {
		return msg.edit("```" + `\n` +
		` ` + `\n` +
		` ` + `\n` +
		` ` + `\n` +
		` ` + `\n` +
		` ` +  `\n` +
		` ` + `\n` +
		` ` + `\n` +
		`=--/` + `\n` +
		"```")
	}

	static eleventhScreen(msg) {
		return msg.edit("```" + `\n` +
		` ` + `\n` +
		` ` + `\n` +
		` ` + `\n` +
		` ` + `\n` +
		` ` +  `\n` +
		` ` + `\n` +
		` ` + `\n` +
		` ` + `\n` +
		"```")
	}



	static async animate(msg) {
		// msg = await this.startScreen(msg);

		msg = await msg.say('Radar Detection: Airforce convoy inbound!')

		setTimeout(async () => {
			msg = await this.startScreen(msg);
			setTimeout(async () => {
				msg = await this.secondScreen(msg);
				setTimeout(async () => {
					msg = await this.thirdScreen(msg);
					setTimeout(async () => {
						msg = await this.fourthScreen(msg);
						setTimeout(async () => {
							msg = await this.fifthScreen(msg);
							setTimeout(async () => {
								msg = await this.sixthScreen(msg);
								setTimeout(async () => {
									msg = await this.seventhScreen(msg);
									setTimeout(async () => {
										msg = await this.seventhScreen(msg);
										setTimeout(async () => {
											msg = await this.eigthScreen(msg);
											setTimeout(async () => {
												msg = await this.ninthScreen(msg);
												setTimeout(async () => {
													msg = await this.tenthScreen(msg);
													setTimeout(async () => {
														msg = await this.eleventhScreen(msg);
													}, 2000);
												}, 2000);
											}, 2000);
										}, 2000);
									}, 2000);
								}, 2000);
							}, 2000);
						}, 2000);
					}, 2000);
				}, 2000);
			}, 2000);

			// setTimeout(() => {
			// 	msg.edit('💥').then((msg) => { 
			// 		setTimeout(() => {
			// 			msg.edit('💨').then(msg => {
			// 				setTimeout(() => { msg.delete() }, 200);
			// 			})
			// 		}, 2000);
			// 	});
			// }, 2000)	
		}, 2000);
	}

	async run(msg) {
		super.run(msg);

		this.animate(msg);
    }
    
};