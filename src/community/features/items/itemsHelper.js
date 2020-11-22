import MessagesHelper from "../../../bot/core/entities/messages/messagesHelper";
import Database from "../../../bot/core/setup/database";

import EMOJIS from '../../../bot/core/config/emojis.json';
import DatabaseHelper from "../../../bot/core/classes/databaseHelper";
import ChannelsHelper from "../../../bot/core/entities/channels/channelsHelper";
import PointsHelper from "../points/pointsHelper";

export default class ItemsHelper {

    static async onReaction(reaction, user) {
        // TODO: Pass the bomb needs to be implemented somehow from here.
        // TODO: Let bombs stack and amplify the damage.
        if (reaction.emoji.name === '💣') {
            try {
                const didUse = await this.use(user.id, 'BOMB', 1);
                if (!didUse) return await reaction.users.remove(user.id);
                else {
                    const messageAuthor = reaction.message.author;
                    console.log('Someone attempted to bomb someone.');
    
                    const updatedPoints = await PointsHelper.addPointsByID(messageAuthor.id, -5);
    
                    await ChannelsHelper._postToFeed(
                        `${user.username} bombed ${messageAuthor.username}: -5 points (${updatedPoints}).`
                    );
                }
            } catch(e) {
                console.error(e);
            }
        }   
    }

    static async add(userID, item_code, quantity) {
        const query = {
            name: "add-item",
            text: `INSERT INTO items(owner_id, item_code, quantity)
                VALUES($1, $2, $3) 
                ON CONFLICT (owner_id, item_code)
                DO 
                UPDATE SET quantity = items.quantity + EXCLUDED.quantity`,
            values: [userID, item_code, quantity]
        };
        return await Database.query(query);
    }

    static async subtract(userID, itemCode, subQuantity) {
        // If item count goes to zero, remove it
        const query = {
            name: "subtract-item",
            text: `UPDATE items 
                SET quantity = quantity - $3 WHERE owner_id = $1 AND item_code = $2
                RETURNING quantity`,
            values: [userID, itemCode, subQuantity]
        };
        const updateResult = await Database.query(query);

        // Remove if zero
        if (updateResult.rowCount > 0) {
            const updatedQty = updateResult.rows[0].quantity || 0;
            if (updatedQty <= 0) await this.delete(userID, itemCode);
        }

        console.log(updateResult);

        return updateResult;
    }

    static async getUserItem(userID, itemCode) {
        const query = {
            name: "get-user-item",
            text: `SELECT * FROM "items" WHERE owner_id = $1 AND item_code = $2`,
            values: [userID, itemCode]
        };
        return await DatabaseHelper.single(await Database.query(query));
    }
    
    static async getUserItems(userID) {
        const query = {
            name: "get-all-user-items",
            text: `SELECT * FROM "items" WHERE owner_id = $1`,
            values: [userID]
        };
        return await Database.query(query);
    }

    static async read(userID, itemCode) {
        const query = {
            name: "read-item",
            text: "SELECT * FROM items WHERE owner_id = $1 AND item_code = $2",
            values: [userID, itemCode]
        };
        return await Database.query(query);
    }

    static async update(userID, itemCode, quantity) {
        const query = {
            name: "update-item",
            text: `UPDATE items SET quantity = $3 
                WHERE owner_id = $1 AND item_code = $2`,
            values: [userID, itemCode, quantity]
        };
        return await Database.query(query);
    }

    static async delete(userID, itemCode) {
        const query = {
            name: "delete-item",
            text: "DELETE FROM items WHERE owner_id = $1 AND item_code = $2",
            values: [userID, itemCode]
        };
        return await Database.query(query);
    }
    
    static formItemDropText(user, items) {
        let itemDisplayMsg = `${user.username}'s items:`;
        items.forEach(item => {
            const emojiIcon = MessagesHelper.emojifyID(EMOJIS[item.item_code]);
            const itemText = `\n${emojiIcon} (${item.item_code}) x ${item.quantity}`;
            itemDisplayMsg += itemText;
        })
        return itemDisplayMsg
    }

    static async use(userID, itemCode, useQty) {
        const userItem = await this.getUserItem(userID, itemCode);
        const ownedQty = userItem.quantity || 0;
        if (ownedQty - useQty <= 0) return false;
        else {
            await this.subtract(userID, itemCode, useQty);
            return false;
        }
    }

    static dropItem() {}
    
    static dropItems() {}
   
}