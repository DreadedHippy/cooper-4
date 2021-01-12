import ChannelsHelper from "../../../../core/entities/channels/channelsHelper";
import STATE from "../../../../state";
import Chicken from "../../../chicken";
import PointsHelper from "../../points/pointsHelper";


export default class CooperMorality {
    
    static async load() {
        return await Chicken.getConfigVal('morality');
    }

    static async calculate() {
        let morality = 'NEUTRAL';
        const points = await PointsHelper.getPointsByID(STATE.CLIENT.user.id);

        if (points < 0) morality = 'EVIL';
        if (points > 0) morality = 'GOOD';
        return morality;
    }

    static async evaluate() {
        const morality = await this.calculate();        

        await Chicken.setConfig('morality', morality);

        await ChannelsHelper._postToFeed(`I am feeling... ${morality.toLowerCase()}!`);
    }

}