const express = require('express')
const router = express.Router()
const Newsletter = require('../models/Newsletter')
const verifyRoles = require('../middlewares/verifyRoles')

router.post('/add', (req, res) => {
    if(!req.body?.email) return res.status(400).json({message: 'email not found.'})
    Newsletter.addEmail(req.body.email)
        .then(dbResponse => res.status(201).json({message: 'New email added to the database.', dbResponse}))
        .catch(error => res.status(500).json({error}))
})

router.get('/', verifyRoles(['admin']), async (req, res) => {
    try {
        const datas = await Newsletter.getAllEmails()
        res.status(200).json({datas})
    } catch (error) {
        return res.status(500).json({ name: error.name, message: error.message, ...error})
    }
})

module.exports = router