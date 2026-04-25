const express = require('express');
const { addressController } = require('../../../controller');
const router = express.Router();

//http://localhost:8080/api/v1/adress/addaddress
router.post('/addaddress',addressController.addaddress)

router.put('/updateaddress/:id',addressController.updateaddress)

module.exports = router;