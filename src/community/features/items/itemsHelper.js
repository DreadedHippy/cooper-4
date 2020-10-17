import Database from "../../../bot/core/setup/database";

export default class ItemsHelper {

    static emojiCodeToItemCode(emojiCode) {
        return 'test';
    }

    static async add(userID, item_code, quantity) {
        const query = {
            name: "add-item",
            text: `INSERT INTO "items"(owner_id, item_code, quantity)
                VALUES($1, $2, $3) 
                ON CONFLICT (owner_id, item_code)
                DO 
                UPDATE "items" SET quantity = quantity + $3 WHERE owner_id = $1 AND item_code = $2`,
            values: [userID, item_code, quantity]
        };
        return await Database.query(query);
    }

    static async subtract(member) {
        // If item count goes to zero, remove it
        const query = {
            name: "subtract-item",
            text: "DELETE FROM items WHERE discord_id = $1",
            values: [member.item.id]
        };
        return await Database.query(query);
    }

    static async create(member) {
        const query = {
            name: "add-item",
            text: "DELETE FROM items WHERE discord_id = $1",
            values: [member.item.id]
        };
        return await Database.query(query);
    }

    static async read(member, itemCode) {
        const query = {
            name: "read-item",
            text: "DELETE FROM items WHERE discord_id = $1",
            values: [member.item.id]
        };
        return await Database.query(query);
    }

    static async update(member, itemCode, quantity) {
        const query = {
            name: "update-item",
            text: "DELETE FROM items WHERE discord_id = $1",
            values: [member.item.id]
        };
        return await Database.query(query);
    }

    static async delete(member, itemCode) {
        const query = {
            name: "delete-item",
            text: "DELETE FROM items WHERE discord_id = $1",
            values: [member.item.id]
        };
        return await Database.query(query);
    }
   
}