const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

router.post('/signup', async (req, res) => {
    if(req.body.email?.length === 0 || req.body.password?.length === 0) return res.status(400).json({message: "Une addresse email et un mot de passe sont requient pour cette opération !"})

    const user = await User.findOneUser(req.body.email)
    if(user) return res.status(400).json({message: "L'addresse email est déjà utilisé."})

    bcrypt.hash(req.body.password, 10)
        .then(async hash => {
            try {
                const { insertId } = await User.createUser(hash, req.body.email, {userName: req.body?.username})
                const newUser = {id: insertId}
                const userRole = {id: 2} //id corresponding to the "user" role defined in the "roles" table (database).

                User.addRole(newUser, userRole)
                    .then(() => res.status(201).json({message: "Nouvel utilisateur ajouté !"}))
                    .catch(error => Promise.reject(error))
            } catch (error) {
                return res.status(500).json({ name: error.name, message: error.message, ...error})
            }
        })
        .catch(error => res.status(500).json({ error }))
})

router.post('/login', async (req, res) => {
    const emailOrUsername = req.body?.email || req.body?.username
    if(!emailOrUsername || !req.body?.password) return res.status(400).json({message: "Identifiant(s) manquant(s)"})
    User.findOneUser(req.body.email)
        .then(user => {
            if(!user) return res.status(401).json({message: "Identifiants invalides"})
            bcrypt.compare(req.body.password, user.password)
                .then(async valid => {
                    if(!valid) return res.status(401).json({message: "Identifiants invalides"})
                    try {
                        const roleList = await User.getRoles(user)
                        const accessToken = jwt.sign(
                            {userInfo: {
                                userId: user.id,
                                roles: roleList
                            }},
                            process.env.JWT_ACCESS_TOKEN_SECRET,
                            {expiresIn: '24h'}
                        )
                        const refreshToken = jwt.sign(
                            {email: user.email},
                            process.env.JWT_REFRESH_TOKEN_SECRET,
                            {expiresIn: '30s'}
                        )
                        User.setRefreshToken(user, refreshToken)
                        res.cookie('jwt', refreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 })
                        res.status(200).json({
                            userId: user.id,
                            roles: roleList,
                            accessToken
                        })
                    } catch (error) {
                        return res.status(500).json({ name: error.name, message: error.message, ...error})
                    }
                })
                .catch(error => res.status(401).json({ error }))
        })
        .catch(error => res.status(500).json({ error }))
})

module.exports = router