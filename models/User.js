const dbconnect = require('../config/dbconnect')

module.exports = class User {
        
        /**
         * Create a new user objet in the database.
         * @param {string} password 
         * @param {string} email 
         * @param {string} userName 
         * @param {{admin: boolean, newsletter: boolean}} options 
         * @returns {Promise<ResultSetHeader>}
         */
        static createUser(password, email, userName = null, options = {admin: false, newsletter: false}) {
                return dbconnect.then(db => db.query(
                        'INSERT INTO users(password, email, username, admin, newsletter) VALUES(?, ?, ?, ?, ?)', 
                        [password, email, userName, options.admin, options.newsletter]
                ))
                        .then(results => results[0])
                        .catch(error => {
                                // If an error occurs, then send a new promise which is rejected with the error as reason.
                                return Promise.reject(error)
                        })
        }

        /**
         * Get one user in the database.
         * @param {string} emailOrUsername Username or the email of the user.
         * @returns {Promise}
         */
        static findOneUser(emailOrUsername) {
                return dbconnect.then(db => db.query(
                        'SELECT * FROM users WHERE email = ? OR username = ? LIMIT 1', 
                        [emailOrUsername, emailOrUsername]
                ))
                        .then(results => results[0][0])
                        .catch(error => Promise.reject(error))
        }
}