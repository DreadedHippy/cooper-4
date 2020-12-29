import CoopCommand from '../../core/classes/coopCommand';



const textSplitter = (str, l) => {
    const strs = [];
    while(str.length > l){
        let pos = str.substring(0, l).lastIndexOf(' ');
        pos = pos <= 0 ? l : pos;
		strs.push(str.substring(0, pos));
		
		let i = str.indexOf(' ', pos)+1;
        if(i < pos || i > pos+l) i = pos;
        str = str.substring(i);
    }
    strs.push(str);
    return strs;
}

export default class HelpCommand extends CoopCommand {

	commando = null

	constructor(client) {
		super(client, {
			name: 'help',
			group: 'info',
			memberName: 'help',
			aliases: [],
			description: 'Help will always be granted at The Coop to those who ask for it.',
			details: `Details`,
			examples: ['help', 'help prefix'],
		});

		this.commando = client;
	}

	async run(msg) {
		super.run(msg);

		let helpString = `**Available Commands**:\n\n`;
		
        try {
			// TODO: Implement properly.

			this.commando.registry.groups.map(group => {
				group.commands.map(cmd => {
					console.log(cmd.memberName);
					helpString += `!${cmd.memberName} ${`
						${cmd.aliases.length > 0 ? 
							`[${cmd.aliases.join(', !')}]`
							:
							''
						}
					`}\n`;
					helpString += `__${cmd.examples[1]}`;
					helpString += `-- ${cmd.description}\n\n`;
					// console.log(cmd);
				});
			});


			textSplitter(helpString, 1500).map((helpSection, index) => {
				setTimeout(() => msg.direct(helpSection), 1666 * index);
			});

        } catch(err) {
            await msg.reply('Unable to send you the help DM. You probably have DMs disabled.');
        }
    }
    
};