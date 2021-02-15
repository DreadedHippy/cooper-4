import ChannelsHelper from "../../../../core/entities/channels/channelsHelper";
import UsersHelper from "../../../../core/entities/users/usersHelper";
import STATE from "../../../../state";
import Chicken from "../../../chicken";
import DropTable from "../../items/droptable";
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
        
        if (prevMorality !== morality) {
            await Chicken.setConfig('morality', morality);

            // On morality change event.
            await ChannelsHelper._postToFeed(`I am feeling... ${morality.toLowerCase()}!`);

            // TODO: Reward a random user with items.
            if (morality === 'GOOD') {
                

                this.giveaway();
            }
        }
    }


    static async giveaway() {
        const maxRewardAmount = 5;
        const maxRewardeesAmount = 10;

        // Calculate using chance/luck.
        const rewardeesAmount = STATE.CHANCE.natural({ min: 1, max: maxRewardeesAmount });

        const rewardeeReqs = [];
        for (let i = 0; i < rewardeesAmount; i++) rewardeeReqs.push(UsersHelper.random());
        const rewardees = await Promise.all(rewardeeReqs);

        // Add results to
        const dropResults = rewardees.map(rewardee => {
            const rewardAmount = STATE.CHANCE.natural({ min: 1, max: maxRewardAmount });

            const user = rewardee.user.username;
            const drops = [];

            for (let i = 0; i < rewardAmount; i++) drops.push(DropTable.getRandomWithQty());

            return { user, drops };
        });

        // Add the item to each user.

        // Declare feedback.

        console.log(dropResults);
        return dropResults;
    }

}