const dbconnect = require('../config/dbconnect')

module.exports = class User {
        
        /**
         * Create a new user objet in the database.
         * @param {string} password 
         * @param {string} email 
         * @param {{userName: string, newsletter: boolean}} options 
         * @returns {Promise<ResultSetHeader>}
         */
        static createUser(password, email, options) {
                const optionsDefault = {userName: null, newsletter: false}
                const params = {...optionsDefault, ...options}
                return dbconnect.then(db => db.query(
                        'INSERT INTO users(password, email, username, newsletter) VALUES(?, ?, ?, ?)', 
                        [password, email, params.userName, params.newsletter]
                ))
                        .then(results => results[0])
                        .catch(error => Promise.reject(error))
        }

        /**
         * Get one user in the database.
         * @param {string} emailOrUsername Username or the email of the user.
         * @returns {Promise<{}>}
         */
        static findOneUser(emailOrUsername) {
                return dbconnect.then(db => db.query(
                        'SELECT * FROM users WHERE email = ? OR username = ? LIMIT 1', 
                        [emailOrUsername, emailOrUsername]
                ))
                        .then(results => results[0][0])
                        .catch(error => Promise.reject(error))
        }

        /**
         * Assign a role to a user by defining a relationship in a link table (user_role).
         * @param {{id: number}} user 
         * @param {{id: number}} role 
         * @returns {Promise<ResultSetHeader>}
         */
        static addRole(user, role) {
                if(!user.id) throw new Error("User.addRole() : No 'id' property found in 'user' parameter")
                if(!role.id) throw new Error("User.addRole() : No 'id' property found in 'role' parameter")
                return dbconnect.then(db => db.query(
                        'INSERT INTO user_role(user_id, role_id) VALUES(?, ?)',
                        [user.id, role.id]
                ))
                        .then(results => results)
                        .catch(error => Promise.reject(error))
        }

        /**
         * Retrieves roles assigned to a user.
         * @param {{id: number}} user 
         * @returns {Promise<[string]>}
         */
        static getRoles(user) {
                if(!user.id) throw new Error("User.getRoles() : No 'id' property found in 'user' parameter")
                return dbconnect.then(db => db.query(
                        'SELECT role_name FROM users JOIN user_role ON users.id = user_role.user_id JOIN roles ON user_role.role_id = roles.id WHERE users.id = ?',
                        [user.id]
                ))
                        .then(results => {
                                const roleList = []
                                for(const roleObject of results[0]) {
                                        const role = roleObject.role_name
                                        roleList.push(role)
                                }
                                return roleList
                        })
                        .catch(error => Promise.reject(error))
        }

        /**
         * Set a token in the database as a session id.
         * @param {{id: number}} user 
         * @param {string} refreshToken 
         * @returns {Promise<ResultSetHeader>}
         */
        static setRefreshToken(user, refreshToken) {
                if(!user.id) throw new Error("User.setRefreshToken() : No 'id' property found in 'user' parameter")
                return dbconnect.then(db => db.query(
                        'UPDATE users SET refreshToken = ? WHERE id = ?',
                        [refreshToken, user.id]
                ))
                        .then(results => results[0])
                        .catch(error => Promise.reject(error))
        }

        /**
         * Retrieves a user using a refreshToken as a reference.
         * @param {string} refreshToken 
         * @returns {Promise<{}>}
         */
        static findOneUserWithRefreshToken(refreshToken) {
                return dbconnect.then(db => db.query(
                        'SELECT * FROM users WHERE refreshToken = ?',
                        [refreshToken]
                ))
                        .then(results => results[0][0])
                        .catch(error => Promise.reject(error))
        }
}