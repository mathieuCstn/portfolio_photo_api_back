const express = require('express')
const router = express.Router()
const multer = require('multer')
const multerCloudinaryStreamSystemeStorage = require('../utils/multerCloudinaryStreamSystemeStorage')
const Product = require('../models/Product')
const auth = require('../middlewares/auth')

const storage = multerCloudinaryStreamSystemeStorage({
    cloudinary_config: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    }
})

const upload = multer({
    storage: storage
})

router.post('/add', auth, upload.single('image'), (req, res) => {
    const public_id = req.file.cld_uploaded_file.public_id
    const price = req.body.price
    const title = req.body.title || req.file.originalname
    const description = req.body?.description
    const quantity = req.body?.quantity
    const available = req.body.available || true
    Product.addProduct(public_id, price, title, description, quantity, available)
        .then(() => res.status(201).json({message: 'New image saved in database'}))
        .catch(error => res.status(500).json({ error }))
})

module.exports = router