import DatabaseHelper from "../../../core/entities/databaseHelper";
import Database from "../../../core/setup/database";

export default class TradeHelper {

    static async all() {
        const query = {
            name: "get-all-trades",
            text: `SELECT * FROM open_trades`
        };

        const result = await Database.query(query);
        return DatabaseHelper.many(result);
    }

    static async create(userID, username, offerItem, receiveItem, offerQty, receiveQty) {
        const query = {
            name: "create-trade",
            text: `INSERT INTO open_trades(trader_id, trader_username, offer_item, receive_item, offer_qty, receive_qty) 
                VALUES ($1, $2, $3, $4, $5, $6)`,
            values: [userID, username, offerItem, receiveItem, offerQty, receiveQty]
        };
        return await Database.query(query);
    }

    // Reverse the search order (inversion of give versus take).
    static async find(offerItem, receiveItem, offerQty, receiveQty) {
        // Find the cheapest match
        // const match = DatabaseHelper.single()
    }

    static async findOfferMatches(offerItem) {
        const query = {
            name: "get-trades-by-offer",
            text: `SELECT * FROM open_trades WHERE offer_item = $1`,
            values: [offerItem]
        };

        const result = await Database.query(query);
        return DatabaseHelper.many(result);
    }

    static async findOfferReceiveMatches(offerItem, receiveItem) {
        const query = {
            name: "get-trades-by-offer-receive",
            text: `SELECT * FROM open_trades WHERE offer_item = $1 AND receive_item = $2`,
            values: [offerItem, receiveItem]
        };

        const result = await Database.query(query);
        return DatabaseHelper.many(result);
    }

    static async findOfferReceiveMatchesQty(offerItem, receiveItem, offerQty, receiveQty) {
        const query = {
            name: "get-trades-by-offer-receive-qty",
            text: `SELECT * FROM open_trades 
                WHERE offer_item = $1 AND receive_item = $2 AND offer_qty = $3 AND receive_qty <= $4`,
            values: [offerItem, receiveItem, offerQty, receiveQty]
        };

        const result = await Database.query(query);
        return DatabaseHelper.many(result);
    }

    static async listMatch(offerItem, receiveItem) {
        const query = {
            name: "get-matches-of-type",
            text: `SELECT * FROM open_trades WHERE offer_item = $1 and receive_item = $2`,
            values: [offerItem, receiveItem]
        };
        
        const result = await Database.query(query);
        return DatabaseHelper.many(result);
    }

    static async fulfil() {

    }

}