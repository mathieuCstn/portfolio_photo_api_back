module.exports = (req, res, next) => {
    try {
        const accessToken = req.headers.authorization.split(' ')[1]
        const decodedToken = jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN_SECRET)
        const userId = decodedToken.userId
        req.auth = {
            userId: userId
        }
        next()
    } catch (error) {
        res.status(401).json({ error })
    }
}