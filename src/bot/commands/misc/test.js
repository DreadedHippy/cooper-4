import CratedropMinigame from '../../../community/features/minigame/small/cratedrop';
import CoopCommand from '../../core/classes/coopCommand';
import ChopperCommand from './chopper';

export default class NukeCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'test',
			group: 'misc',
			memberName: 'test',
			aliases: [],
			description: 'Information test our fine community!',
			details: `Details`,
			examples: ['test', 'test example?'],

			// Stop us getting nuked
			ownerOnly: true,
		});
	}

	async run(msg) {
		super.run(msg);

		// CratedropMinigame.drop();

		ChopperCommand.startScreen(msg)
    }
    
};