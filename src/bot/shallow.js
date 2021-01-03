import { Client } from 'discord.js-commando';
import Database from './core/setup/database';
import STATE from './state';
import dotenv from 'dotenv';
import ItemsHelper from './community/features/items/itemsHelper';
import ServerHelper from './core/entities/server/serverHelper';

dotenv.config();

const shallowBot = async () => {

    STATE.CLIENT = new Client({ owner: '786671654721683517' });

    await Database.connect();
    await STATE.CLIENT.login(process.env.DISCORD_TOKEN);

    STATE.CLIENT.on('ready', async () => {
        console.log('Shallow bot is ready');

        // DEV WORK AND TESTING ON THE LINES BELOW.
        const channel = ServerHelper._coop().channels.cache.get('723710770591957075');
        const messages = await channel.messages.fetch({ 
            limit: 100 
        });

        const junk = messages.filter(msg => {
            let noDisc = true;
            msg.reactions.cache.map(react => {
                if (react.emoji.name === '💽') noDisc = false;
            });
            return noDisc;
        });

        const junkArray = Array.from(junk);
        console.log('Junk messages: ' + junkArray.length);
        junkArray.map((collectionItem, index) => {
            setTimeout(() => {
                console.log(collectionItem[1].content);
                collectionItem[1].delete();
                console.log('Deleted message: ' + index + '/' + junkArray.length);
            }, 1333 * index);
        });
        // DEV WORK AND TESTING ON THE LINES ABOVE.
    });


};

shallowBot();