const order = require('../model/order.model');

const addorder = async (req, res) => {
    try {

        console.log(req.body)

        const orderdata = await order.create(req.body);

        if (!orderdata) {
            return res.status(400).json({
                success: false,
                data: [],
                message: 'order not add'
            })
        }

        return res.status(200).json({
            success: true,
            data: orderdata,
            message: 'order add'
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            data: [],
            message: 'internal server error at add order' + error.message
        })
    }
}

const updateshippingaddress = async (req, res) => {
    try {

        console.log(req.body)

        const checkorder = await order.findById(req.params.id);

        if (!checkorder) {
            return res.status(400).json({
                success: false,
                data: [],
                message: 'order not exists'
            })
        }


        // const addressdata = await order.findByIdAndUpdate(
        //     req.params.id,
        //     {address:req.body},
        //     { new: true}
        // );
        console.log(checkorder)
        checkorder.address = {
            ...checkorder.address.toObject(),  // old data
            ...req.body                        // new updates
        };
        await checkorder.save();

        if (!checkorder) {
            return res.status(400).json({
                success: false,
                data: [],
                message: 'address not update at order'
            })
        }

        return res.status(200).json({
            success: true,
            data: checkorder,
            message: 'address update at order'
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            data: [],
            message: 'internal server error at update address at order' + error.message
        })
    }
}

module.exports = {
    addorder,
    updateshippingaddress
}

//  "product_id":"69ddbecbfdcedc9c300fda20",
//  "variant_id":"69e9e3427678a08376a43f09",