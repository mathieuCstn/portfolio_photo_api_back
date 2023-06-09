const dbconnect = require('../config/dbconnect')
const cloudinary = require('cloudinary').v2

module.exports = class Product {
    /**
     * Returns a list of all products in the database.
     * @returns {Promise<[{}]>}
     */
    static getProducts() {
        return dbconnect.then(db => db.query(
            'SELECT * FROM products'
        ))
            .then(datas => datas[0])
            .catch(error => Promise.reject(error))
    }

    /**
     * Return one product object with its id.
     * @param {{id: number}} product 
     * @returns {Promise<>}
     */
    static getOneProduct(product) {
        if(!product.id) throw new Error("Product.getOneProduct() : No 'id' property found in product parameter.")
        return dbconnect.then(db => db.query(
            'SELECT * FROM products WHERE id = ? LIMIT 1',
            [product.id]
        ))
            .then(data => data[0][0])
            .catch(error => Promise.reject(error))
    }

    /**
     * Add a new product in the database.
     * @param {string} cld_public_id 
     * @param {{price: number, title: string, description: string, quantity: number, avalible: boolean}} options
     * @returns {Promise<ResultSetHeader>}
     */
    static addProduct(cld_public_id, options) {
        if(!cld_public_id) throw new Error("Product.addProduct() : No 'cld_public_id' parameter found.")
        const optionsDefault = {price: null, title: null, description: null, quantity: null, avalible: true}
        const params = {...optionsDefault, ...options}
        return dbconnect.then(db => db.query(
            'INSERT INTO products(cld_public_id, price, title, description, quantity, avalible) VALUES(?, ?, ?, ?, ?, ?)', 
            [cld_public_id, params.price, params.title, params.description, params.quantity, params.avalible]
        ))
            .then(data => data[0])
            .catch(error => Promise.reject(error))
    }

    /**
     * Updates a product object in the database with its id.
     * @param {number} productId 
     * @param {{cld_public_id: string, title: string, description: string, price: number, quantity: number, avalible: boolean}} options 
     * @returns {Promise<ResultSetHeader>}
     */
    static async updateProduct(productId, options) {
        if(!productId) throw new Error("Product.updateProduct() : No 'ProductId' parameter found.")
        const optionsDefault = await this.getOneProduct({id: productId})
        const params = {...optionsDefault, ...options}
        return dbconnect.then(db => db.query(
            'UPDATE products SET cld_public_id = ?, price = ?, title = ?, description = ?, quantity = ?, avalible = ? WHERE id = ?',
            [params.cld_public_id, params.price, params.title, params.description, params.quantity, params.avalible, productId]
        ))
            .then(data => data[0])
            .catch(error => Promise.reject(error))
    }

    /**
     * 
     * @param {number} productId 
     * @returns {Promise<ResultSetHeader>}
     */
    static async deleteProduct(productId) {
        if(!Product) throw new Error("Product.deleteProduct() : No 'ProductId' parameter found.")
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        })
        const { cld_public_id } = await this.getOneProduct({id: productId})
        cloudinary.uploader.destroy(cld_public_id)
        return dbconnect.then(db => db.query(
            'DELETE FROM products WHERE id = ?',
            [productId]
        ))
            .then(results => results[0])
            .catch(error => Promise.reject(error))
    }
}