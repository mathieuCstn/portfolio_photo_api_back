const dbconnect = require('../config/dbconnect')

module.exports = class Basket {
    /**
     * Create a new basket.
     * @param {number} userId 
     */
    static createBasket(userId) {
        dbconnect.then(db => db.query('INSERT INTO baskets(user_id) VALUES(?)', [userId]))
            .then(data => data[0])
            .catch(console.error)
    }
}