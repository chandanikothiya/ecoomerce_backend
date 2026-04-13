const express = require('express')
const { productsController } = require('../../../controller')
const upload = require('../../../middleware/upload')
const router = express.Router()

//http://localhost:8080/api/v1/product/addproducts
router.post('/addproducts',upload.any(),productsController.addproducts)

router.get('/getproducts',productsController.getproducts)

router.put('/updateproducts/:id',upload.any(),productsController.updateproducts)

router.delete('/deleteproducts/:id',productsController.deleteproducts)

module.exports = router;

//upload.array('product_img')