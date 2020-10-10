import EggHuntMinigame from "../../features/minigame/small/egghunt";

export default function reactAddedHandler(react, user) {
    
    // TODO: If coop emoji ever added, double down on it... just because.

    EggHuntMinigame.onReaction(react, user);
}