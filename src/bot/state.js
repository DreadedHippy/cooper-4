import { Chance } from "chance";

const STATE = {
    CLIENT: null,


    // Track current nuking action.
    NUKING: null,

    // Last redemption update time.
    LAST_ENTRY_VOTE_TIME: null,
    LAST_ACHIEVEMENT_NOTIFICATION: null,

    // Chance/random instance
    CHANCE: new Chance
};
export default STATE;