import STATE from "../../../state";

export default class DropTable {

    static TIERS = {
        // TOXIC: []
        AVERAGE: [
            'BOMB',
            'LAXATIVE',
            'TOXIC_EGG',
            'PICK_AXE',
            'FRYING_PAN',
            'EMPTY_GIFTBOX',
            'WOOD',
            'AXE',
            'IRON_BAR'
        ],
        RARE: [
            'ROPE',
            'SHIELD',
            'MINE',
            'DEFUSE_KIT',
            'FLARE',
            'STEEL_BAR'
        ],
        LEGENDARY: [
            'IED',
            'RPG',
            'GOLD_BAR',
            'GOLD_COIN',
            'SILVER_BAR',
            'DIAMOND'
        ]
    }

    static TIER_QTYS = {
        AVERAGE: { min: 2, max: 10 },
        RARE: { min: 2, max: 5 },
        LEGENDARY: { min: 1, max: 2 }
    }

    static getRandomTierQty(level) {
        return STATE.CHANCE.natural(this.TIER_QTYS[level]);
    }

    static getRandom() {
        const tier = STATE.CHANCE.pickone(Object.keys(this.TIERS));
        const item = this.getRandomTiered(tier);
        return item;
    }

    static getRandomQty() {
        const tier = STATE.CHANCE.pickone(Object.keys(this.TIER_QTYS));
        const tierQty = this.getRandomTierQty(tier);
        return tierQty;
    }

    static getRandomWithQty() {
        return {
            item: this.getRandom(),
            qty: this.getRandomQty()
        }
    }

    static getRandomTieredWithQty(level) {
        return {
            item: this.getRandomTiered(level),
            qty: this.getRandomTierQty(level)
        }
    }

    static getRandomTiered(level) {
        return STATE.CHANCE.pickone(this.TIERS[level]);
    }

}
