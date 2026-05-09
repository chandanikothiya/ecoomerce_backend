const express = require('express');
const { subscribeController } = require('../../../controller');

const router = express.Router()

//http://localhost:8080/api/v1/subscribe/addemail
router.post('/addemail',subscribeController.addemail)

router.get('/getemail',subscribeController.getemail)

module.exports = router;

//upload.array('product_img')