export default class DatabaseHelper {

	static async single(queryResult) {
		let singleResult = null;
		if (queryResult.rowCount > 0) singleResult = queryResult.rows[0];
		return singleResult;
	}

};