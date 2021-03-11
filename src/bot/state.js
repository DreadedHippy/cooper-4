import { Chance } from "chance";

const STATE = {
    CLIENT: null,

    // Last redemption update time.
    // TODO: Bring into activity feed notifications
    LAST_ENTRY_VOTE_TIME: null,
    LAST_ACHIEVEMENT_NOTIFICATION: null,

    // Chance/random instance
    CHANCE: new Chance,

    // The economy reserve wallet
    WALLET: null,

    // Message ephemeral state for tracking message updates/notifications
    MESSAGE_HISTORY: {},
    EVENTS_HISTORY: {}
};
export default STATE;