require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')

// Cette line de code sert essentiellement à tester le systeme d'envoi des images depuis le client(multer) au cloud(cloudinary). À SUPPRIMER AVANT DÉPLOIMENT !
app.use('/mocked-client-interface', express.static(__dirname+'/mocked_client_interface'))

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}))

const userRoutes = require('./routes/user')
const productRoutes = require('./routes/product')
const refreshRoutes = require('./routes/refresh')
app.use('/api/users', userRoutes)
app.use('/api/products', productRoutes)
app.use('/api/refresh', refreshRoutes)

const PORT = process.env.PORT || 9500
app.listen(PORT, () => {
    console.log(`Listen on port: ${PORT}. All is OK !`)
})