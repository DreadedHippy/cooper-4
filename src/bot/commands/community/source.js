import CoopCommand from '../../core/entities/coopCommand';
import MessagesHelper from '../../core/entities/messages/messagesHelper';

// Work around duie to Heroku hosting not seeming to like fs/promises import.
import { default as fsWithCallbacks } from 'fs';
const fs = fsWithCallbacks.promises

export default class SourceCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'source',
			group: 'community',
			memberName: 'source',
			aliases: ['s'],
			description: 'Get the source of a file.',
			details: ``,
			examples: ['source', 'source example']
		});
	}

	static async getFileContent(path) {
		// Figure out project root.
		try {
			// Prevent access to secure data.
			if (path === '.env' || path === './.env')
				throw new Error('Tried to access .env file.');

			// Load the file content.
			const file = await fs.readFile(path, "utf8");
			return file;

		} catch(e) {
			console.log(`'Error getting file: ${path}`);
			console.error(e);
			return null;
		}
	}

	async run(msg) {
		super.run(msg);

		try {
			// Calculate and output file source.
			const intendedPath = msg.content.replace('!source', '');
			const fileContent = await this.getFileContent(intendedPath);


			// Guard invalid path.
			if (!fileContent) 
				MessagesHelper.selfDestruct(msg, `Could not load the file for ${intendedPath}.`, 666, 15000);

			// TODO: Add github link to this to keep DreadedHippy happy.

			// Decide if it will fit in an embed or not.
			if (fileContent.length > 1000)
				MessagesHelper.selfDestruct(msg, fileContent, 666, 15000);
			else 
				MessagesHelper.selfDestruct(msg, `\`\`\`js\n${fileContent}\n\`\`\``, 666, 15000);



		} catch(e) {
			console.error(e);
		}
    }
    
};