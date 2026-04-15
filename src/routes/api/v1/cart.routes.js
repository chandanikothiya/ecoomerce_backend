const express = require('express');
const { cartController } = require('../../../controller');
const router = express.Router()
//http://localhost:8080/api/v1/cart
router.get('/getCart/:id',cartController.getCart)

router.post('/addCart',cartController.addCart)

router.delete('/deleteCart/:id',cartController.deleteCart)

module.exports = router