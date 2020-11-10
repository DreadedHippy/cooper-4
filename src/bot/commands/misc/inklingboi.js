import { Chance } from 'chance';
import CoopCommand from '../../core/classes/coopCommand';

export default class InklingboiCommand extends CoopCommand {

	constructor(client) {
		super(client, {
			name: 'inklingboi',
			group: 'misc',
			memberName: 'inklingboi',
			aliases: [],
			description: 'Information inklingboi our fine community!',
			details: `Details`,
			examples: ['inklingboi', 'inklingboi example?'],
		});
	}

	async run(msg) {
        const chanceInstance = new Chance;

        setTimeout(() => {
            super.run(msg);

            setTimeout(() => {
                const repeatNum = chanceInstance.natural({ min: 1, max: 20 });
                const first = `Inklingboiiiiii?!?!??!!?!?!?! 🌋🌋🌋`;
                const second = 'Ruuuuuu' + 'u'.repeat(repeatNum) + '!!!';
                const third = ('🦑' + '🇩🇪').repeat(repeatNum);

                const inklingMsg = await msg.say(first);

                setTimeout(async () => {
                    await inklingMsg.edit(second);
                    setTimeout(() => { inklingMsg.react('🦑'); }, 500);

                    setTimeout(async () => {
                        await inklingMsg.edit(third);
                        setTimeout(() => { inklingMsg.reactions.removeAll(); }, 250);
                        setTimeout(() => { inklingMsg.react('🇩🇪'); }, 500);
                    }, 3000);
                }, 3000);
            }, 300);
        }, 250);
    }
    
};
