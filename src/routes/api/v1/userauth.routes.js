const express = require('express');
const { userauthController } = require('../../../controller');
const router = express.Router();

//http://localhost:8080/api/v1/user/adduser
router.post('/adduser',userauthController.adduser);

router.post('/verifyuser',userauthController.verifyuser);

router.post('/loginuser',userauthController.loginuser);

router.post('/logoutuser',userauthController.logoutuser);

router.post('/genratenewtoken',userauthController.genratenewtoken);

router.get('/checkauth',userauthController.checkauth);

router.post('/forgetpassword',userauthController.forgetpassword);

router.post('/resetpassword',userauthController.resetpassword);

module.exports = router