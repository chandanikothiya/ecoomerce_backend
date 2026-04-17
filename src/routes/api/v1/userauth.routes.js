const express = require('express');
const { userauthController } = require('../../../controller');
const passport = require('passport');
const { genratetoken } = require('../../../controller/userauth.controller');
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

router.get('/getuser/:id',userauthController.getuser);

router.put('/edituser/:id',userauthController.edituser);


//http://localhost:8080/api/v1/user/auth/google
router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile','email'] }));

//http://localhost:8080/api/v1/user/auth/google/callback
router.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),

  async function(req, res) {
    // Successful authentication, redirect home.
    const { accesstoken, refreshtoken } = await genratetoken(req.user._id);

        const accoption = {
            httpOnly: true,
            secure: true,
            samesite: null,
            expire: 60 * 60 * 1000
        }

        const refoption = {
            httpOnly: true,
            secure: true,
            samesite: null,
            expire: 60 * 60 * 24 * 7 * 1000
        }

        return res
            .cookie('accesstoken', accesstoken, accoption)
            .cookie('refreshtoken', refreshtoken, refoption)
            .status(200)
            .redirect('http://localhost:5173/?login=success')

    
  });

module.exports = router;