const express = require('express');
const { contactController, couponController } = require('../../../controller');
const router = express.Router();

router.get('/getallcoupon',couponController.getAllcoupon)

router.post('/addcoupon',couponController.addcoupon)

router.get('/getcoupon/:id',couponController.getcoupon)

router.put('/updatecoupon/:id',couponController.updatecoupon)

router.put('/changeactive/:id',couponController.changeactive)

router.delete('/deletecoupon/:id',couponController.deletecoupon)

router.post('/checkcoupon',couponController.checkcoupon)

module.exports = router