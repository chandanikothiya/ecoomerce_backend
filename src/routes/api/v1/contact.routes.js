const express = require('express');
const { contactController } = require('../../../controller');
const router = express.Router();

router.get('/getcontact',contactController.getconatct)

router.post('/addcontact',contactController.addconatct)


module.exports = router;