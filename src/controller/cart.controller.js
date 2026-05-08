const cart = require('../model/cart.model')

const getallCart = async (req, res) => {
   try {
        console.log(req.params.id)
        const cartdata = await cart.find();

        if (!cartdata) {
            return res.status(400).json({
                success: false,
                body: null,
                message: 'cart not found'
            })
        }

        return res.status(200).json({
            success: true,
            body: cartdata,
            message: 'cart fetch'
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            body: null,
            message: 'internal server error at cart fetch' + error.message
        })
    }
}

const getCart = async (req, res) => {
    try {
        console.log(req.params.id)
        const cartdata = await cart.findOne({user_id:req.params.id});

        if (!cartdata) {
            return res.status(400).json({
                success: false,
                body: null,
                message: 'user cart not found'
            })
        }

        return res.status(200).json({
            success: true,
            body: cartdata,
            message: 'cart fetch'
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            body: null,
            message: 'internal server error at cart fetch' + error.message
        })
    }
}

const addCart = async (req, res) => {
    try {

        console.log(req.body)
        const { user_id, product_id ,variant_id} = req.body;
        // console.log(req.body)

        const checkuser = await cart.findOne({ user_id: user_id })

        let cartdata = ''

        if (!checkuser) {
            cartdata = await cart.create({ user_id: user_id, products: [{ product_id: product_id,variant_id:variant_id }] })

            return res.status(200).json({
                success: true,
                body: checkuser,
                message: 'product add into cart'
            })
        }

        // cartdata = await checkuser.products

        const index = checkuser.products.findIndex((p) => p.variant_id.toString() === variant_id);
        console.log(index)

        if (index === -1) {
            checkuser.products.push({ product_id: product_id,variant_id:variant_id })
        } else {
            return res.status(400).json({
                success: false,
                body: null,
                message: 'product alerdy add into cart'
            })

        }

        await checkuser.save();

        return res.status(200).json({
            success: true,
            body: checkuser,
            message: 'product add into cart'
        })

        // checkuser.products = product_id;
        // checkuser.save();

        // if (!cartdata) {
        //     return res.status(400).json({
        //         success: false,
        //         body: null,
        //         message: 'product not add to cart'
        //     })
        // }

        // return res.status(200).json({
        //     success: true,
        //     body: checkuser,
        //     message: 'product add into cart'
        // })

    } catch (error) {
        return res.status(500).json({
            success: false,
            body: null,
            message: 'internal server error at product  add to cart' + error.message
        })
    }
}

const deleteCart = async (req, res) => {
    try {

        const { variant_id } = req.body;

        console.log("deletecaertbody",req.body,req.params.id)

        const checkuser = await cart.findOne({ user_id: req.params.id})

        const checkproduct = checkuser.products.filter((v) => (
            v.variant_id.toString() !== variant_id
        ))

        console.log(checkproduct)

        checkuser.products = checkproduct;
        await checkuser.save();

        if (!checkuser) {
            return res.status(400).json({
                success: false,
                body: null,
                message: 'product not remove from  cart'
            })
        }

        return res.status(200).json({
            success: true,
            body: checkuser,
            message: 'product remove from  cart'
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            body: null,
            message: 'internal server error at product  product remove from  cart' + error.message
        })
    }
}

module.exports = {
    getallCart,
    addCart,
    deleteCart,
    getCart
}