module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        const decodedToken = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET)
        userId = decodedToken.userId
        req.auth = {
            userId: userId
        }
        next()
    } catch (error) {
        res.status(401).json({ error })
    }
}