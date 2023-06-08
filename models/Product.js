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
    static addProduct(cld_public_id, options) {
        if(!cld_public_id) throw new Error("Product.addProduct() : No 'cld_public_id' parameter found")
        const optionsDefault = {price: null, title: null, description: null, quantity: null, available: true}
        const params = {...optionsDefault, ...options}
        return dbconnect.then(db => db.query(
            'INSERT INTO products(cld_public_id, price, title, description, quantity, avalible) VALUES(?, ?, ?, ?, ?, ?)', 
            [cld_public_id, params.price, params.title, params.description, params.quantity, params.available]
        ))
            .then(data => data[0])
            .catch(error => Promise.reject(error))
    }

    static getProducts() {
        return dbconnect.then(db => db.query(
            'SELECT * FROM products'
        ))
            .then(datas => datas[0])
            .catch(error => Promise.reject(error))
    }
}