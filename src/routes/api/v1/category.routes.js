const express = require('express');
const { categoryController } = require('../../../controller');
const router = express.Router();

//http://localhost:8080/api/v1/category/getcategory
router.get('/getcategory',categoryController.getCategory);

router.post('/addCategory',categoryController.addCategory);

router.put('/updateCategory/:id',categoryController.updateCategory);

router.delete('/deleteCatgoey/:id',categoryController.deleteCatgoey);

module.exports = router