import state from "../../../bot/state";

export default function reactAddedHandler(react, user) {
    
    // TODO: If coop emoji ever added, double down on it... just because.


    // TODO: refactor to egghunt
    try {
        const isCooperMessage = react.message.author.id === state.CLIENT.user.id;
        const isEggDrop = react.message.content === '🥚';
        console.log(isCooperMessage, isEggDrop, react.message.content);
        
        if (isCooperMessage && isEggDrop) {
    
        }
    } catch(e) {
        console.error(e);
    }

}