import CoopCommand from '../../core/entities/coopCommand';



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

		let helpString = `**Available Commands**: \nTo find out more provide a command group or command name. !help {?CMD|GROUP?}\n\n`;
		
		// TODO: Add category support

		let category = null;

		// TODO: Improve hidden to filter by roles
		const hidden = [
			'nuke'
		];

		const hiddenGroups = [
			'mod',
			'misc'
		];

        try {
			// TODO: Implement properly.

			if (!category) {
				this.commando.registry.groups.map(group => {
					if (hiddenGroups.includes(group.id)) return false;
					helpString += `**${group.id}: ${group.name}**\n`;

					let count = 0;
					const delimiter = group.commands.size > 1 ? ', ' : '.'; 
					group.commands.map((cmd) => {
						let finalSpacer = delimiter;

						if (count === group.commands.size - 1) finalSpacer = '.';

						if (hidden.includes(cmd.memberName)) return false;
						helpString += `!${cmd.memberName}${finalSpacer}`;

						count++;
					});
					helpString += '\n\n';
				});
	
				textSplitter(helpString, 1500).map((helpSection, index) => {
					// setTimeout(() => msg.direct(`\`\`\`\n${helpSection}\n\`\`\``), 1666 * index);
					setTimeout(() => msg.direct(helpSection), 1666 * index);
				});

			} else {

			}

        } catch(err) {
            await msg.reply('Unable to send you the help DM. You probably have DMs disabled.');
        }
    }
    
};