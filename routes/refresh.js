const express = require('express')
const router = express.Router()
const User = require('../models/User')
const jwt = require('jsonwebtoken')

router.get('/', async (req, res) => {
    try {
        const cookies = req.body.cookies;
        if(!cookies?.jwt) return res.status(401).json({message: "Not authenticated"})
        const refreshToken = cookies.jwt
    
        const foundUser = await User.findOneUserWithRefreshToken(refreshToken)
        if(!foundUser) return res.status(403).json({message: "Unauthorized"})
    
        jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_TOKEN_SECRET,
            (error, decodedToken) => {
                if (err || foundUser.username !== decodedToken.username) return res.status(403).json({ error })
                const roles = User.getRoles(foundUser)
                const accessToken = jwt.sign(
                    {userInfo: {
                        userId: foundUser.id,   // Pas convaincu par la manière don l'id est obtenu. Peut être que je devrais utiliser les "email" ? (champ email indiqué comme clé unique dans la base de données)
                        roles: roles
                    }},
                    process.env.JWT_REFRESH_TOKEN_SECRET,
                    { expiresIn: '10s' }
                )
                res.status(200).json({ roles, accessToken })
            }
        )
    } catch (error) {
        return res.status(500).json({ name: error.name, message: error.message, ...error})
    }
})

module.exports = router