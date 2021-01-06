import ChannelsHelper from "../../../../core/entities/channels/channelsHelper";
import Chicken from "../../../chicken";


export default class CooperMorality {
    
    static async evaluate() {
        const morality = await Chicken.getConfigVal('morality');
        await ChannelsHelper._postToFeed(`I am feeling... ${morality}!`);
    }

}