const express = require('express');
const { wishlistController } = require('../../../controller');
const router = express.Router();

router.get('/getallWishlist',wishlistController.getallWishlist);

router.get('/getwishlist/:id',wishlistController.getWishlist);

//http://localhost:8080/api/v1/wishlist/addwishlist
router.post('/addwishlist',wishlistController.addWishlist);

router.delete('/deletewishlist/:id',wishlistController.deleteWishlist);

module.exports = router;