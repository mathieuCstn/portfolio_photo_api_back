const express = require('express')
const router = express.Router()
const multer = require('multer')
const multerCloudinaryStreamSystemeStorage = require('../utils/multerCloudinaryStreamSystemeStorage')
const Product = require('../models/Product')
const verifyRoles = require('../middlewares/verifyRoles')

const storage = multerCloudinaryStreamSystemeStorage({
    cloudinary_config: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        folder: 'upload-filesysteme'
    }
})

const upload = multer({
    storage: storage
})

router.post('/add', verifyRoles(['admin']), upload.single('image'), async (req, res) => {
    try {
        const public_id = req.file.cld_uploaded_file.public_id
        const title = req.body?.title || req.file.originalname
        const description = req.body?.description ? req.body.description : null
        const price = req.body?.price ? req.body.price : null
        const quantity = req.body?.quantity ? req.body.quantity : null
        const available = req.body?.available || true
        const options = {price, title, description, quantity, available}
        const results = await Product.addProduct(public_id, options)
        if(results) return res.status(201).json({message: 'New image saved in database'})
    } catch (error) {
        res.status(500).json({ error })
    }
})

router.get('/', (req, res) => {
    Product.getProducts()
        .then(datas => res.status(200).json({message: 'Recovery of all objects of the \'products\' table', products: datas}))
        .catch(error => res.status(500).json({ error }))
})

module.exports = router