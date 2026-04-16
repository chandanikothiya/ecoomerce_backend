const express = require('express');
const { wishlistController } = require('../../../controller');
const router = express.Router();

//http://localhost:8080/api/v1/wishlist/addwishlist
router.post('/addwishlist',wishlistController.addWishlist);

module.exports = router;