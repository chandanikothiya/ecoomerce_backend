
const wishlist = require('../model/wishlist.model')

const getallWishlist = async (req, res) => {
    try {

        const wishlistdata = await wishlist.find();

        if (!wishlistdata) {
            return res.status(400).json({
                success: false,
                body: null,
                message: 'user wishlistdata not found'
            })
        }

        return res.status(200).json({
            success: true,
            body: wishlistdata,
            message: 'wishlistdata fetch'
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            body: null,
            message: 'internal server error at wishlistdata fetch ' + error.message
        })
    }
}

const getWishlist = async (req, res) => {
    try {
        console.log(req.params.id)
        const wishlistdata = await wishlist.findOne({user_id:req.params.id});

        if (!wishlistdata) {
            return res.status(400).json({
                success: false,
                body: null,
                message: 'user wishlistdata not found'
            })
        }

        return res.status(200).json({
            success: true,
            body: wishlistdata,
            message: 'wishlistdata fetch'
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            body: null,
            message: 'internal server error at wishlistdata fetch ' + error.message
        })
    }
}

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
       // console.log(req.body,req.params.id)
        const { variant_id } = req.body;

        //console.log(req.body)

        // const w = await wishlist.find();
        // console.log(w)

        const checkwishlist = await wishlist.findOne({ user_id: req.params.id })
        console.log(checkwishlist)

        const checkproduct = checkwishlist.products.filter((v) => (
            v.variant_id.toString() !== variant_id
        ))

        console.log(checkproduct)

        checkwishlist.products = checkproduct;
        await checkwishlist.save();

        if (!checkwishlist) {
            return res.status(400).json({
                success: false,
                body: null,
                message: 'product not remove from  wishlist'
            })
        }

        return res.status(200).json({
            success: true,
            body: checkwishlist,
            message: 'product remove from  wishlist'
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            body: null,
            message: 'internal server error at product  product remove from  wishlist' + error.message
        })
    }
}

module.exports = {
    getallWishlist,
    addWishlist,
    deleteWishlist,
    getWishlist
}