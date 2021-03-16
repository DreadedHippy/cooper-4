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

		// TODO: ADD STATISTICS + SATISFACTION FEEDBACK FOR HELP
		
		
		
		// Improve hidden to filter by roles
		const hiddenCommand = [
			'nuke',

			// Added to prevent infinite loop on !help (help) text search.
			'help'
		];

		const hiddenGroups = [
			'mod',
			'misc'
		];

		
		// TODO: Critical support needed for command/command group DETAIL.

		// Store group names to detect matches and provide helpful/detailed feedback.
		const groupNames = this.commando.registry.groups
			.filteR(group => hiddenGroups.includes(group.name.toLowerCase()))
			.map(group => group.name.toLowerCase());

		// Store command names to detect matches and provide helpful/detailed feedback.
		const commandNames = this.commando.registry.groups.flatMap(
			group => group.commands
				.filter(cmd => cmd.memberName.toLowerCase())
				.map(cmd => cmd.memberName.toLowerCase())
		);


		// Check the first 15 words of the message to check for matching category.
		const categoryOpt = null;
		groupNames.map(groupName => {
			// TODO: If string matches group name, set it to desired.
		});

		// Check the first 15 words of the message to check for matching command.
		const commandOpt = null
		commandNames.map(cmdName => {
			// TODO: If string matches command name, set it to desired.
		});

		console.log(commandNames);

        try {
			// TODO: Implement properly.

			if (!categoryOpt && !commandOpt) {
				let helpString = `**Available Commands**: \nTo find out more provide a command group or command name. !help {?CMD|GROUP?}\n\n`;
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
					setTimeout(() => msg.direct(helpSection), 1666 * index);
				});

			}

			if (commandOpt) {
				msg.say('I should help you with the command...')
				
			} else if (categoryOpt) {
				msg.say('I should help you with the category of commands you specified...')
			}

        } catch(err) {
            await msg.reply('Unable to send you the help DM. You probably have DMs disabled.');
        }
    }
    
};