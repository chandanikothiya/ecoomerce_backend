const express = require('express');
const {orderController } = require('../../../controller');
const router = express.Router();

//http://localhost:8080/api/v1/order/addorder
router.post('/addorder',orderController.addorder)

router.put('/updateshippingaddress/:id',orderController.updateshippingaddress)

module.exports = router;