const dbconnect = require('../config/dbconnect')

module.exports = class Product {
    /**
     * Add a new product in the database.
     * @param {string} cld_public_id 
     * @param {number} price 
     * @param {string} title 
     * @param {string} description 
     * @param {number} quantity 
     * @param {boolean} available 
     * @returns {Promise<ResultSetHeader>}
     */
    static addProduct(cld_public_id, price, title = null, description = null, quantity = null, available = true) {
        return dbconnect.then(db => db.query(
            'INSERT INTO products(cld_public_id, price, title, description, quantity, avalible) VALUES(?, ?, ?, ?, ?, ?)', 
            [cld_public_id, price, title, description, quantity, available]
        ))
            .then(data => data[0])
            .catch(error => Promise.reject(error))
    }
}