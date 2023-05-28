const dbconnect = require('../config/dbconnect')

module.exports = class Address {
    /**
     * Create a new address.
     * @param {number} userId 
     * @param {string} recipient
     * @param {string} street 
     * @param {string} postalCode 
     * @param {string} municipality 
     * @param {string} country 
     */
    static createAddress(userId, recipient, street, postalCode, municipality, country) {
        dbconnect.then(db => db.query('INSERT INTO addresses(user_id, recipient, street, postal_code, municipality, country) VALUES(?, ?, ?, ?, ?, ?)'), [userId, recipient, street, postalCode, municipality, country])
            .then(data => console.log(data[0]))
            .catch(console.error)
    }
}