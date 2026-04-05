const express = require('express')
const router = express.Router()

const categoryRouter = require('./category.routes')
const userauthRouter = require('./userauth.routes')

//http://localhost:8080/api/v1/category
router.use('/category',categoryRouter);

//http://localhost:8080/api/v1/user
router.use('/user',userauthRouter)

module.exports = router;