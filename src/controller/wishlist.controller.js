
const wishlist = require('../model/wishlist.model')

const addWishlist = async (req, res) => {
    try {

        console.log(req.body)
        const { user_id, product_id, variant_id } = req.body;
        // console.log(req.body)

        const checkuser = await wishlist.findOne({ user_id: user_id })

        let wishlistdata = ''

        if (!checkuser) {
            wishlistdata = await wishlist.create({ user_id: user_id, products: [{ product_id: product_id, variant_id: variant_id }] })

            return res.status(200).json({
                success: true,
                body: checkuser,
                message: 'product add into wishlist'
            })
        }

        // cartdata = await checkuser.products

        const index = checkuser.products.findIndex((p) => p.variant_id.toString() === variant_id);

        if (index === -1) {
            checkuser.products.push({ product_id: product_id, variant_id: variant_id })
        } else {
            return res.status(400).json({
                success: false,
                body: null,
                message: 'product alerdy add into wishlist'
            })

        }

        await checkuser.save();

        return res.status(200).json({
            success: true,
            body: checkuser,
            message: 'product add into wishlist'
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
            message: 'internal server error at product  add to wishlist' + error.message
        })
    }
}

const deleteWishlist = async (req, res) => {
    try {

        const { variant_id } = req.body;

        console.log(req.body)

        const checkuser = await cart.findOne({ user_id: req.params.id })

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
    addWishlist,
    deleteWishlist
}