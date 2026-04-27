const express = require('express');
const { paymentController } = require('../../../controller');
const router = express.Router();

// router.get('/getallorder',orderController.getallorder)

// router.get('/getorder/:id',orderController.getorder)
router.post('/',paymentController.createpayment)

router.get('/getpayment',paymentController.getpayment)

router.get('/getpaymentonorder/:id',paymentController.getpaymentonorder)

//http://localhost:8080/api/v1/payment/addpayment
router.post('/addpayment',paymentController.addpayment)

router.put('/updatepaymentstatus/:id',paymentController.updatepaymentstatus)


// router.put('/updateshippingaddress/:id',orderController.updateshippingaddress)

// router.put('/updateorderstatus/:id',orderController.updateorderstatus)

// router.put('/updatepaymentstatus/:id',orderController.updatepaymentstatus)

// router.delete('/deleteorder/:id',orderController.deleteorder)

module.exports = router;