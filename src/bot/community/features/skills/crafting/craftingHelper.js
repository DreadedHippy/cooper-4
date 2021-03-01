import ItemsHelper from "../../items/itemsHelper";

export default class CraftingHelper {

    static CRAFTABLES = {
        BOW: {
            levelReq: 0,
            expReward: 5,
            ingredients: {
                WOOD: 5
            }
        },
        PICK_AXE: {
            levelReq: 0,
            expReward: 5,
            ingredients: {
                WOOD: 5,
                IRON_BAR: 2
            }
        },
        FRYING_PAN: {
            levelReq: 0,
            expReward: 10,
            ingredients: {
                STEEL_BAR: 2,
                IRON_BAR: 1
            }
        },
        AXE: {
            levelReq: 0,
            expReward: 5,
            ingredients: {
                WOOD: 10,
                IRON_BAR: 1
            }
        },
    }

    static isItemCraftable(code) {
        return typeof this.CRAFTABLES[code] !== 'undefined';
    }

    // Check whether it is possible for someone to craft an item x qty.
    static async canCraft(memberID, itemCode, qty) {
        let craftable = false;

        const ingredients = this.CRAFTABLES[itemCode].ingredients;
        const ingredList = Object.keys(this.CRAFTABLES[itemCode].ingredients);
        const ownedIngredients = await Promise.all(
            ingredList.map(ingred => ItemsHelper.getUserItem(memberID, ingred)
        ));

        // Check ingredients are sufficient.
        let isSufficient = true;
        ownedIngredients.map(ingred => {
            // Check sufficiency
            const req = ingredients[ingred.item_code] * qty;
            const owned = ingred.quantity;

            // Declare insufficient.
            if (owned < req) isSufficient = false;
        });
        if (isSufficient) craftable = true;

        return craftable;
    }

    static async craft(memberID, itemCode, qty) {
        try {
            const ingredients = this.CRAFTABLES[itemCode].ingredients;
            const ingredList = Object.keys(this.CRAFTABLES[itemCode].ingredients);

            // Subtract all of the ingredients.
            await Promise.all(
                ingredList.map(ingred => ItemsHelper.subtract(memberID, ingred, ingredients[ingred] * qty)
            ));

            // Add the resultant item.
            await ItemsHelper.add(memberID, itemCode, qty);
            return true;

        } catch(e) {
            console.log('Error occurred crafting');
            console.error(e);
            return false;
        }
    }

}