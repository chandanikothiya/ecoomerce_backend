const products = require('../model/products.model')
const fs = require('fs')

const getproducts = async (req, res) => {
    try {
        const product = await products.find();

        if (!product) {
            return res.status(400).json({
                success: false,
                data: null,
                message: 'product not fetch'
            })
        }

        return res.status(200).json({
            success: true,
            data: product,
            message: 'products fetch successfully'
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            data: null,
            message: 'internal server error at product fetch ' + error.message
        })
    }
}

const addproducts = async (req, res) => {
    console.log(req.files)
    try {

        const checkproduct = await products.findOne({ name: req.body.name })

        if (checkproduct) {
            return res.status(400).json({
                success: false,
                data: checkproduct,
                message: 'product alerady exists'
            })
        }

        let pro_img = [];

        req.files.map((v) => {
            pro_img.push(v.path)
        })

        const product = await products.create({ ...req.body, product_img: pro_img });

        if (!product) {
            return res.status(400).json({
                success: false,
                data: null,
                message: 'product not add'
            })
        }

        return res.status(200).json({
            success: true,
            data: product,
            message: 'product add successfully'
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            data: null,
            message: 'internal server error at product add ' + error.message
        })
    }
}

const updateproducts = async (req, res) => {
    try {
        console.log(req.file)

        const checkproduct = await products.findById(req.params.id);
        console.log(checkproduct)

        let updatdata = { ...req.body }
        console.log(updatdata)

        if (req.files) {

            checkproduct.product_img.map((v) => {
                fs.unlink(v, (error) => {
                    console.log("image not delte at update", error)
                })
            })

            let pro_img = [];

            req.files.map((v) => {
                pro_img.push(v.path)
            })

            updatdata.product_img = pro_img

        }

        if (!checkproduct) {
            return res.status(400).json({
                success: false,
                data: null,
                message: 'product not exists'
            })
        }

        const updatepro = await products.findByIdAndUpdate(
            req.params.id,
            updatdata,
            { new: true, runValidators: true }
        )

        if (!updatepro) {
            return res.status(400).json({
                success: false,
                data: null,
                message: 'product not update'
            })
        }

        return res.status(200).json({
            success: true,
            data: updatepro,
            message: 'product update successfully'
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            data: null,
            message: 'internal server error at update product ' + error.message
        })
    }
}

const deleteproducts = async (req, res) => {
    try {

        const checkproduct = await products.findById(req.params.id);

        if (!checkproduct) {
            return res.status(400).json({
                success: false,
                data: null,
                message: 'product not exists'
            })
        }


        const delpro = await products.findByIdAndDelete(req.params.id);

        delpro.product_img.map((v) => {
            fs.unlink(v, (error) => {
                console.log("image not delte at update", error)
            })
        })

        if (!delpro) {
            return res.status(400).json({
                success: false,
                data: null,
                message: 'product not delete'
            })
        }

        return res.status(200).json({
            success: true,
            data: delpro,
            message: 'product delete successfully'
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            data: null,
            message: 'internal server error at product delete ' + error.message
        })
    }
}

module.exports = {
    addproducts,
    getproducts,
    updateproducts,
    deleteproducts
}