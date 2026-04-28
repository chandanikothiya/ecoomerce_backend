const express = require('express');
const { addressController } = require('../../../controller');
const router = express.Router();

router.get('/getalladdress',addressController.getalladdress)

router.get('/getaddress/:id',addressController.getaddress)

//http://localhost:8080/api/v1/adress/addaddress
router.post('/addaddress',addressController.addaddress)

router.put('/updateaddress/:id',addressController.updateaddress)

module.exports = router;