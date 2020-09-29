import { Command } from 'discord.js-commando';

export default class CoopCommand extends Command {

	constructor(client, config) {
		super(client, config);
	}

	async run(msg) {
		// Remove calling command.
		msg.delete();
    }
    
};