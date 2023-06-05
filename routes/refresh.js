const express = require('express')
const router = express.Router()
const User = require('../models/User')
const jwt = require('jsonwebtoken')

router.get('/', async (req, res) => {
    try {
        const cookiesEntries = req.headers.cookie.split('; ').map(cookie => cookie.split('='));
        const cookies = Object.fromEntries(cookiesEntries)
        if(!cookies?.jwt) return res.status(401).json({message: "Not authenticated"})
        const refreshToken = cookies.jwt
    
        const foundUser = await User.findOneUserWithRefreshToken(refreshToken)
        if(!foundUser) return res.status(403).json({message: "Unauthorized"})
    
        jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_TOKEN_SECRET,
            async (error, decodedToken) => {
                if (error || foundUser.email !== decodedToken.email) return res.status(403).json({ error })
                const roles = await User.getRoles(foundUser)
                const accessToken = jwt.sign(
                    {userInfo: {
                        userId: foundUser.id,
                        roles: roles
                    }},
                    process.env.JWT_ACCESS_TOKEN_SECRET,
                    { expiresIn: '1h' }
                )
                res.status(200).json({userId: foundUser.id, roles, accessToken })
            }
        )
    } catch (error) {
        return res.status(500).json({ name: error.name, message: error.message, ...error})
    }
})

module.exports = router