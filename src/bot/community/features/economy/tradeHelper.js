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
                VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
            values: [userID, username, offerItem, receiveItem, offerQty, receiveQty]
        };
        const result = await Database.query(query);
        console.log('create trade result', result);

        return result;
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

    static async matches(offerItem, receiveItem, offerQty, receiveQty) {
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

    // static async fulfil() {
    //     if (await ItemsHelper.use(tradeeID, offerItemCode, offerQty)) {
    //         await ItemsHelper.add(tradeeID, itemCode, qty);
    // }

    // This method directly takes items from user to close a trade.
    static async accept(openTradeID, acceptingUserID) {
        try {
            // Get trade by ID

            // Try to use/fulfil the trade.

            // if (await ItemsHelper.use(tradeeID, offerItemCode, offerQty)) {
                // await ItemsHelper.add(tradeeID, itemCode, qty);
            
            throw new Error('Impossible to accept.');

            return true;
        } catch(e) {
            console.log('Error accepting trade offer.');
            console.error(e);
            return false;
        }        
    }

}