const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

router.post('/signup', async (req, res) => {
    if(req.body.email.length === 0 || req.body.password.length === 0) return res.status(400).json({message: "Une addresse email et un mot de passe sont requient pour cette opération !"})

    const user = await User.findOneUser(req.body.email)
    if(user) return res.status(400).json({message: "L'addresse email est déjà utilisé."})

    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            User.createUser(hash, req.body.email, req.body?.username)
                .then(() => res.status(201).json({message: "Nouvel utilisateur ajouté !"}))
                .catch(error => res.status(500).json({ error }))
        })
        .catch(error => res.status(500).json({ error }))
})

router.get('/login', async (req, res) => {
    User.findOneUser(req.body.email)
        .then(user => {
            if(!user) return res.status(401).json({message: "Identifiants invalides"})
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if(!valid) {
                        res.status(401).json({message: "Identifiants invalides"})
                    } else {
                        res.status(200).json({
                            userId: user.id,
                            token: jwt.sign(
                                {userId: user.id},
                                process.env.JWT_SECRET_KEY,
                                {expiresIn: '24h'}
                            )
                        })
                    }
                })
                .catch(error => res.status(401).json({ error }))
        })
        .catch(error => res.status(500).json({ error }))
})

module.exports = router