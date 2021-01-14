import { Client } from 'discord.js-commando';
import Database from './core/setup/database';
import STATE from './state';
import dotenv from 'dotenv';
import UsersHelper from './core/entities/users/usersHelper';
import Chicken from './community/chicken';
import ChannelsHelper from './core/entities/channels/channelsHelper';
import MessagesHelper from './core/entities/messages/messagesHelper';
import ItemsHelper from './community/features/items/itemsHelper';
import DropTable from './community/features/items/droptable';
import EggHuntMinigame from './community/features/minigame/small/egghunt';
import ElectionHelper from './community/features/hierarchy/election/electionHelper';
import StatisticsHelper from './community/features/server/statisticsHelper';
import AboutHelper from './community/features/server/aboutHelper';

// v DEV IMPORT AREA v

// ^ DEV IMPORT AREA ^

dotenv.config();

const shallowBot = async () => {

    STATE.CLIENT = new Client({ owner: '786671654721683517' });

    await Database.connect();
    await STATE.CLIENT.login(process.env.DISCORD_TOKEN);

    STATE.CLIENT.on('ready', async () => {
        console.log('Shallow bot is ready');

        // DEV WORK AND TESTING ON THE LINES BELOW.

        await AboutHelper.preloadMesssages();
        // Can't fix leaderboard until opt in roles allows ID checks.

        STATE.CLIENT.on('messageReactionAdd', (reaction, user) =>{
                // console.log(reaction, user);
                AboutHelper.onReaction(reaction, user);
        });

        // Testing.


        // https://discord.com/channels/723660447508725802/762472730980515870/799056216549752882

        // Object.keys(AboutHelper.sectionEmojis).map(section => {

        // })

        // AboutHelper.handleByEmoji('☠️');

        // console.log(AboutHelper.getEmojiHandler('❗'));
        // console.log(AboutHelper.getEmojiHandler('📰'));
        // console.log(AboutHelper.getEmojiHandler('📢'));
        // console.log(AboutHelper.getEmojiHandler('☠️'));

        // Chicken.setConfig('about_leaderboard_msg',
        // 'https://discord.com/channels/723660447508725802/796156573771759676/799111356334080002');
        // about_leaderboard_msg // for fixing the leaderboard location

// Previous latest member msg link
// https://discord.com/channels/723660447508725802/762472730980515870/798573016736596068

// newest message.
// https://discord.com/channels/723660447508725802/762472730980515870/799056216549752882

        // Chicken.setConfig('about_lastjoin_msg', 
        //         'https://discord.com/channels/723660447508725802/762472730980515870/799056216549752882'
        // )

        // ChannelsHelper._postToChannelCode('ABOUT', 'LATEST MEMBER SECTION');

        // const msg = await MessagesHelper.getByLink(
        //         'https://discord.com/channels/723660447508725802/762472730980515870/795831725153976360'
        // );
        // // console.log(msg);

        // await msg.delete();




// Move latest member to bottom?
// https://discord.com/channels/723660447508725802/762472730980515870/798573016736596068


// Move leaderboard to economy
// https://discord.com/channels/723660447508725802/762472730980515870/795831725153976360





//     await MessagesHelper.editByLink('https://discord.com/channels/723660447508725802/762472730980515870/798717824884670475',

// ChannelsHelper._postToChannelCode('ABOUT',
// `
// **🎲 Community Games (Opt in) 🎲**

// We have a few games and features here that you may access by opt-ing in, we default to off to limit "spam" notifications.

// **🤝 Economy 🤝**
// _A place to see the ecooponomy events, action history, trade, etc... (!help economy for more info)_

// **🗡 Conquest 🗡 **
// _Work in progress category for inter-communal conflict._
// `);

        // Save message links!"!"!"!"!




// const channels = ChannelsHelper._all();
// channels.map(chan => console.log(chan.name));


        // const msg = await MessagesHelper.getByLink(
        //     'https://discord.com/channels/723660447508725802/762472730980515870/798717824884670475'
        // );
        // // await msg.reactions.removeAll();
        // // console.log(msg.content);




//     await MessagesHelper.editByLink('https://discord.com/channels/723660447508725802/762472730980515870/798717376567967804',
// `
// **🏰 ABOUT OUR COMMUNITY 🏰**

// _Description should be written and edited into this position._

// Website:   https://thecoop.group
// Facebook:  https://www.facebook.com/thecoopfb
// LinkedIn:  https://www.linkedin.com/company/thecoopgroup
// Twitter:   https://twitter.com/thecoop_tw
// Instagram: https://www.instagram.com/coopstagramthe/

// `);
        

// const msg = await MessagesHelper.getByLink(
//     'https://discord.com/channels/723660447508725802/762472730980515870/768254668450693152'
// 'https://discord.com/channels/723660447508725802/762472730980515870/798717376567967804'
// );
// msg.suppressEmbeds(true);
// msg.delete();


        // await MessagesHelper.editByLink('https://discord.com/channels/723660447508725802/762472730980515870/798717446847856681',

        // const msg = await MessagesHelper.getByLink(
        //     'https://discord.com/channels/723660447508725802/762472730980515870/798717446847856681'
        // );
        // await msg.reactions.removeAll();
        // console.log(msg.content);

        // // Remove all notifications
        // MessagesHelper.delayReact(msg, '❗', 333);
        // MessagesHelper.delayReact(msg, '📢', 777);
        // MessagesHelper.delayReact(msg, '📰', 1444);
        // MessagesHelper.delayReact(msg, '☠️', 2222);

        // NOTIFICATIONS



        // OUR FOCUS
        // https://discord.com/channels/723660447508725802/762472730980515870/798717678453784576



//         await MessagesHelper.editByLink('https://discord.com/channels/723660447508725802/762472730980515870/798717446847856681',
// `**:bell: Notifications :bell:**

// All community notifications should be minimised, simplified, categorised and reduced as much as possible. We do this from a position of collective respect for an individual's time and to be consistent with our general <#729506748171288596> principles 📜.

// **___You can set your notification preferences below with the 4 specified emoji reactions.___**

// **:exclamation: Key Info Alerts :exclamation:**
// _Opt-into (Not recommended for casual member) the "key-info-alert" to ensure you never miss a :exclamation: "key info" notice._

// **:loudspeaker: Announcement Subscriber :loudspeaker:**
// _Opt-into the "announcement-subscriber" role were you will pinged with maximum 1 weekly update._

// **:newspaper: Newsletter Subscription :newspaper:**
// _Opt-into newsletter email subscription or cancel/toggle off._

// **:skull_crossbones: Delete All Data :skull_crossbones:**
// _This will delete all of your data stored here, items, points, email (confirmation required)._`
//         );





        // const msg = await MessagesHelper.getByLink('https://discord.com/channels/723660447508725802/762472730980515870/798573016736596068');
        // Chicken.setConfig('aboutoptin_msg_link',
        //     'https://discord.com/channels/723660447508725802/762472730980515870/798717678453784576'
        // );

        // DEV WORK AND TESTING ON THE LINES ABOVE.
    });

};

shallowBot();