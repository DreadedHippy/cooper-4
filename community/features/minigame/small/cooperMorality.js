import ChannelsHelper from "../../../../core/entities/channels/channelsHelper";
import MessagesHelper from "../../../../core/entities/messages/messagesHelper";
import UsersHelper from "../../../../core/entities/users/usersHelper";
import STATE from "../../../../core/state";
import Chicken from "../../../chicken";
import DropTable from "../../items/droptable";
import ItemsHelper from "../../items/itemsHelper";
import PointsHelper from "../../points/pointsHelper";


export default class CooperMorality {
    
    static async load() {
        return await Chicken.getConfigVal('morality');
    }

    static async calculate() {
        let morality = null;

        const points = await PointsHelper.getPointsByID(STATE.CLIENT.user.id);

        if (points < 0) morality = 'EVIL';
        if (points > 0) morality = 'GOOD';
        if (points === 0) morality = 'NEUTRAL';

        return morality;
    }

    static async evaluate() {
        const prevMorality = await this.load();
        const morality = await this.calculate();        
        
        // On morality change event.
        if (prevMorality !== morality) {
            await Chicken.setConfig('morality', morality);
            await ChannelsHelper._postToFeed(`I am feeling... ${morality.toLowerCase()}!`);
        }

        // Buffs for GOOD morality:
        if (morality === 'GOOD' && STATE.CHANCE.bool({ likelihood: .5 })) this.giveaway();

        // Negations for EVIL morality:
        if (morality === 'EVIL' && STATE.CHANCE.bool({ likelihood: .5 })) this.takeway();
        // ...
        // ...

        // Quirky things for neutral, produces rarer items.
    }

    static async takeaway() {
        ChannelsHelper._postToFeed('I taketh as I giveth...');
    }

    static async giveaway() {
        const maxRewardAmount = 4;
        const maxRewardeesAmount = 6;

        // Calculate using chance/luck.
        const rewardeesAmount = STATE.CHANCE.natural({ min: 1, max: maxRewardeesAmount });

        const rewardeeReqs = [];
        for (let i = 0; i < rewardeesAmount; i++) rewardeeReqs.push(UsersHelper.random());
        const rewardees = await Promise.all(rewardeeReqs);

        // Add results to
        const dropResults = rewardees.map(({ user }) => {
            const rewardAmount = STATE.CHANCE.natural({ min: 1, max: maxRewardAmount });

            const drops = DropTable.getRandomWithQtyMany(rewardAmount);

            return { user, drops };
        });


        // Add the item to each user.
        await Promise.all(dropResults.map(dropSet =>
            Promise.all(dropSet.drops.map(drop =>
                ItemsHelper.add(dropSet.user.id, drop.item, drop.qty)
            ))
        ));
        
        // Declare feedback.
        const giveawayText = `**Cooper's good mood makes him charitable!**\n\n` +
            dropResults.map(dropSet => 
                `${dropSet.user.username}: ${dropSet.drops.map(drop => 
                    `${MessagesHelper._displayEmojiCode(drop.item)}x${drop.qty}`
                ).join(', ')
            }`).join('.\n\n');
        ChannelsHelper._codes(['FEED', 'TALK'], giveawayText)

        return dropResults;
    }
}