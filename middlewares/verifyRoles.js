const jwt = require('jsonwebtoken')

/**
 * Creates a middleware that decodes an accessToken located in the Authorization field of the headers and checks whether at least one role matches the list passed in parameter.
 * @param  {...string} allowedRoles 
 * @returns {void}
 */
function verifyRoles(...allowedRoles) {
    return (req, res, next) => {
        const authHeader = req.headers?.authorization || req.headers?.Authorization;
        if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);
        const accessToken = authHeader.split(' ')[1];
        jwt.verify(
            accessToken,
            process.env.JWT_ACCESS_TOKEN_SECRET,
            (error, decodedToken) => {
                if(error) return res.sendStatus(403)
                req.userId = decodedToken.userInfo.userId
                req.roles = decodedToken.userInfo.roles
                const roleList = [...allowedRoles]
                const result = req.roles.map(role => roleList.includes(role)).find(value => value === true)
                if(!result) return res.sendStatus(401)
                next()
            }
        )
    }
}

module.exports = verifyRoles