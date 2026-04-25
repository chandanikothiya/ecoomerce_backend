const express = require('express')
const router = express.Router()

const categoryRouter = require('./category.routes')
const userauthRouter = require('./userauth.routes')
const productRouter = require('./products.routes')
const cartRouter = require('./cart.routes')
const wishlistRouter = require('./wishlist.routes')
const contactRouter = require('./contact.routes')
const orderRouter = require('./order.routes')
const addressRouter = require('./address.routes')

//http://localhost:8080/api/v1/category
router.use('/category',categoryRouter);

//http://localhost:8080/api/v1/user
router.use('/user',userauthRouter);

//http://localhost:8080/api/v1/product
router.use('/product',productRouter);

//http://localhost:8080/api/v1/cart
router.use('/cart',cartRouter);

//http://localhost:8080/api/v1/wishlist
router.use('/wishlist',wishlistRouter)

//http://localhost:8080/api/v1/contact
router.use('/contact',contactRouter)

//http://localhost:8080/api/v1/order
router.use('/order',orderRouter)

//http://localhost:8080/api/v1/adress
router.use('/adress',addressRouter)

module.exports = router;