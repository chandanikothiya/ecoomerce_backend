const express = require('express');
const {orderController } = require('../../../controller');
const router = express.Router();

router.get('/getallorder',orderController.getallorder)

router.get('/getorder/:id',orderController.getorder)

router.get('/moreselling',orderController.moreselling)


//http://localhost:8080/api/v1/order/addorder
router.post('/addorder',orderController.addorder)

router.put('/updateshippingaddress/:id',orderController.updateshippingaddress)

router.put('/updateorderstatus/:id',orderController.updateorderstatus)


router.delete('/deleteorder/:id',orderController.deleteorder)

module.exports = router;