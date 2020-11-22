import Chance from 'chance';
import _ from 'lodash';

import EMOJIS from '../../../../bot/core/config/emojis.json';

import ChannelsHelper from '../../../../bot/core/entities/channels/channelsHelper';
import ServerHelper from '../../../../bot/core/entities/server/serverHelper';
import PointsHelper from '../../points/pointsHelper';
import ItemsHelper from '../../items/itemsHelper';

import STATE from '../../../../bot/state';
import MessagesHelper from '../../../../bot/core/entities/messages/messagesHelper';


const likelihood = 20;

const EGG_DATA = {
    TOXIC_EGG: {
        points: -5,
        emoji: EMOJIS.TOXIC_EGG
    },
    AVERAGE_EGG: {
        points: 1,
        emoji: EMOJIS.AVERAGE_EGG
    },
    RARE_EGG: {
        points: 3,
        emoji: EMOJIS.RARE_EGG
    },
    LEGENDARY_EGG: {
        points: 20,
        emoji: EMOJIS.LEGENDARY_EGG
    },
};


export default class EggHuntMinigame {
    
    static onReaction(reaction, user) {
        try {
            const isCooperMessage = reaction.message.author.id === STATE.CLIENT.user.id;
            const eggEmojiNames = _.map(_.values(EGG_DATA), "emoji");
            const emojiIdentifier = MessagesHelper.getEmojiIdentifier(reaction.message);
            const isEgghuntDrop = eggEmojiNames.includes(emojiIdentifier);
            const hasEggRarity = this.calculateRarityFromMessage(reaction.message);
            const isEggCollectible = isCooperMessage && isEgghuntDrop && hasEggRarity;
            
            const isBombEmoji = reaction.emoji.name === '💣';
            const isBasketEmoji = reaction.emoji.name === '🧺';

            // TODO: Implement frying.
            // const isFryingPanEmoji


            if (isEggCollectible && isBasketEmoji) this.collect(reaction, user);
            if (isEggCollectible && isBombEmoji) this.explode(reaction, user);

        } catch(e) {
            console.error(e);
        }
    }

    static calculateRarityFromMessage(msg) {
        let eggRarity = null;

        if (msg.content.indexOf('average_egg') > -1) eggRarity = 'AVERAGE_EGG';
        if (msg.content.indexOf('rare_egg') > -1) eggRarity = 'RARE_EGG';
        if (msg.content.indexOf('legendary_egg') > -1) eggRarity = 'LEGENDARY_EGG';
        if (msg.content.indexOf('toxic_egg') > -1) eggRarity = 'TOXIC_EGG';

        return eggRarity;
    }

    // TODO: Add a small chance of bomb exploding on you.
    static async explode(reaction, user) {

        // Check if user has a bomb to use
        try {
            const userBombs = await ItemsHelper.getUserItem(user.id, 'BOMB');
            const bombQuantity = userBombs.quantity || 0;

            const rarity = this.calculateRarityFromMessage(reaction.message);
            const reward = EGG_DATA[rarity].points;
            const emoji = EGG_DATA[rarity].emoji;
            const channelName = reaction.message.channel.name;

            // Remove reaction by user without a bomb and prevent usage.
            if (bombQuantity <= 0) return await reaction.users.remove(user.id);

            // Remove bomb from user.
            await ItemsHelper.subtract(user.id, 'BOMB', 1);

            // User has enough eggs, blow egg up.
            const blownupEggMsg = await reaction.message.edit('💥');
            setTimeout(() => { blownupEggMsg.delete(); }, 3333);

            // Share points with nearest 5 message authors.
            const channelMessages = reaction.message.channel.messages;
            const surroundingMsgs = await channelMessages.fetch({ around: reaction.message.id, limit: 5 });
            const aroundUsers = surroundingMsgs.reduce((acc, msg) => {
                const notIncluded = typeof acc[msg.author.id] === 'undefined';
                const notCooper = msg.author.id !== STATE.CLIENT.user.id;
                if (notIncluded && notCooper) acc[msg.author.id] = msg.author;
                return acc;
            }, {});

            // Store points and egg collection data in database.
            const awardedUserIDs = Object.keys(aroundUsers);
            await Promise.all(awardedUserIDs.map(userID => {
                return PointsHelper.addPointsByID(userID, reward);
            }));

            // Add/update egg item to user
            await ItemsHelper.add(user.id, rarity, 1);

            // Create feedback text from list of users.
            const usersRewardedText = awardedUserIDs.map(userID => aroundUsers[userID].username).join(', ');
            const feedbackMsg = `
                ${usersRewardedText} gained ${reward} points by being splashed by exploding egg ${emoji}
            `.trim();

            // Add self-destructing message in channel.
            const instantFeedbackMsg = await reaction.message.say(feedbackMsg);
            setTimeout(() => { instantFeedbackMsg.delete(); }, 30000);

            // Add server notification in feed.
            await ChannelsHelper._postToFeed(feedbackMsg + ' in ' + channelName);

        } catch(e) {
            console.error(e);
        }
    }

    static async collect(reaction, user) {
        try {
            if (user.id !== STATE.CLIENT.user.id) {     
                const rand = new Chance;
                
                const rarity = this.calculateRarityFromMessage(reaction.message);
                const reward = EGG_DATA[rarity].points;
                const emoji = EGG_DATA[rarity].emoji;
                const channelName = reaction.message.channel.name;

                let acknowledgementMsgText = '';
                let activityFeedMsgText = '';

                if (rand.bool({ likelihood: 85 })) {
                    // Store points and egg collection data in database.
                    const updated = await PointsHelper.addPointsByID(user.id, reward);

                    const rewardPolarity = reward > 0 ? '+' : '-';

                    // Add/update egg item to user
                    await ItemsHelper.add(user.id, rarity, 1);

                    acknowledgementMsgText = `
                        <${emoji}>🧺 Egg Hunt! ${user.username} ${rewardPolarity}${reward} points! (${updated})
                    `.trim();

                    activityFeedMsgText = `
                        ${user.username} collected an egg in "${channelName}" channel! <${emoji}>
                    `.trim();
                } else {
                    acknowledgementMsgText = `
                        <${emoji}>🧺 Egg Hunt! ${user.username} clumsily broke the egg, 0 points!
                    `.trim();

                    activityFeedMsgText = `
                        ${user.username} broke an egg in "${channelName}" channel! :( <${emoji}>
                    `.trim();
                }


                const acknowledgementMsg = await reaction.message.say(acknowledgementMsgText);
                
                // Remove acknowledgement message after 30 seconds.
                setTimeout(async () => { await acknowledgementMsg.delete(); }, 30000)
                
                ChannelsHelper._postToFeed(activityFeedMsgText)

                // Delete the egg.
                await reaction.message.delete();
            }
        } catch(e) {
            console.error(e);
        }
    }

    static async drop(rarity, dropText = null) {
        const server = ServerHelper.getByCode(STATE.CLIENT, 'PROD');
        const dropChannel = ChannelsHelper.fetchRandomTextChannel(server);
        const rand = new Chance;

        if (dropChannel) {
            const randomDelayBaseMs = 30000;
            setTimeout(async () => {
                try {
                    const eggMsg = await dropChannel.send(`<${EGG_DATA[rarity].emoji}>`);
                    await eggMsg.react('🧺');

                    // Remove toxic egg after 5 minutes so people aren't forced to take it.
                    if (rarity === 'TOXIC_EGG') {
                        setTimeout(async () => { await eggMsg.delete(); }, 60 * 5 * 1000);
                    }

                    if (dropText) ChannelsHelper._postToFeed(dropText);
                } catch(e) {
                    console.error(e);
                }
            }, rand.natural({ min: randomDelayBaseMs, max: randomDelayBaseMs * 4 }));
        }
    }

    static run() {
        const rand = new Chance;
        if (rand.bool({ likelihood })) {
            this.drop('AVERAGE_EGG', 'Whoops! I dropped an egg, but where...?');

            if (rand.bool({ likelihood: likelihood / 1.75 })) {
                this.drop('TOXIC_EGG', 'I dropped an egg, but where...? Tsk.');

                if (rand.bool({ likelihood: likelihood / 1.5 })) {
                    this.drop('RARE_EGG', 'Funknes! Rare egg on the loose!');
    
                    if (rand.bool({ likelihood: likelihood / 2.25 })) {
                        ChannelsHelper._postToFeed('@here, a legendary egg was dropped! Find and grab it before others can!');
                        this.drop('LEGENDARY_EGG');
                    }
                }
            }


            // Bonus eggs            
            if (rand.bool({ likelihood: likelihood / 2 })) {
                ChannelsHelper._postToFeed('Bonus eggs rolling!');
                
                const bonusEggsNum = rand.natural({ min: 2, max: 8 });
                for (let i = 0; i < bonusEggsNum; i++) this.drop('AVERAGE_EGG', null);

                const toxicEggsMixupNum = rand.natural({ min: 1, max: Math.ceil(bonusEggsNum / 3) });
                for (let i = 0; i < toxicEggsMixupNum; i++) this.drop('TOXIC_EGG', null)
            }
        }
    }
}