const express = require('express')
const router = express.Router()

const categoryRouter = require('./category.routes')
const userauthRouter = require('./userauth.routes')
const productRouter = require('./products.routes')
const cartRouter = require('./cart.routes')

//http://localhost:8080/api/v1/category
router.use('/category',categoryRouter);

//http://localhost:8080/api/v1/user
router.use('/user',userauthRouter);

//http://localhost:8080/api/v1/product
router.use('/product',productRouter);

//http://localhost:8080/api/v1/cart
router.use('/cart',cartRouter);

module.exports = router;