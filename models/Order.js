const dbconnect = require('../config/dbconnect')

module.exports = class Order {
    /**
     * Create a new order.
     * @param {number} userId 
     * @param {string} address
     * @param {string} discount 
     */
    static createOrder(userId, address, discount = null) {
        dbconnect.then(db => db.query('INSERT INTO orders(user_id, address, discount) VALUES(?, ?, ?)', [userId, address, discount]))
            .then(data => console.log(data[0]))
            .catch(console.error)
    }
}