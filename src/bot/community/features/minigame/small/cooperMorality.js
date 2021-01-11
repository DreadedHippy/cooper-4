import ChannelsHelper from "../../../../core/entities/channels/channelsHelper";
import Chicken from "../../../chicken";
import PointsHelper from "../../points/pointsHelper";


export default class CooperMorality {
    
    static async evaluate() {
        let morality = 'NEUTRAL';
        const points = await PointsHelper.getPointsByID(STATE.CLIENT.user.id);
        
        if (points < 0) morality = 'EVIL';
        if (points > 0) morality = 'GOOD';
        
        await Chicken.setConfig('morality', morality);

        await ChannelsHelper._postToFeed(`I am feeling... ${morality.toLowerCase()}!`);
    }

}