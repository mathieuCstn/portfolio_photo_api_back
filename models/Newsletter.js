const dbconnect = require('../config/dbconnect')

module.exports = class Newsletter {

    /**
     * Enter an email in the newsletter table.
     * @param {string} email 
     * @returns {Promise<ResultSetHeader>}
     */
    static addEmail(email) {
        if(!email.length) throw new Error('Newsletter.addEmail() : No email found in the parameter.')
        const EMAIL_REGEX = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,5})+$/
        if(!EMAIL_REGEX.test(email)) throw new Error('Newsletter.addEmail() : The email parameter is not in email format')
        return dbconnect.then(db => db.query(
            'INSERT INTO newsletter(email) VALUES(?)',
            [email]
        ))
            .then(result => result[0])
            .catch(error => Promise.reject(error))
    }

    /**
     * Returns a list of emails subscribed to the newsletter.
     * @returns {Promise<[{}]>}
     */
    static getAllEmails() {
        return dbconnect.then(db => db.query(
            'SELECT * FROM newsletter'
        ))
            .then(datas => datas[0])
            .catch(error => Promise.reject(error))
    }
}