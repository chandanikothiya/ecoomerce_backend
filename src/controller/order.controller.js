const order = require('../model/order.model');

const getallorder = async (req, res) => {
    try {

        const getorder = await order.find();

        if (!getorder) {
            return res.status(400).json({
                success: false,
                data: [],
                message: 'orders data not found'
            })
        }



        return res.status(200).json({
            success: true,
            data: getorder,
            message: 'orders data are found'
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            data: [],
            message: 'internal server error at orders data found' + error.message
        })
    }
}

const getorder = async (req, res) => {
    try {

        const getorder = await order.findById(req.params.id);

        if (!getorder) {
            return res.status(400).json({
                success: false,
                data: [],
                message: 'orders data not found'
            })
        }



        return res.status(200).json({
            success: true,
            data: getorder,
            message: 'orders data are found'
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            data: [],
            message: 'internal server error at orders data found' + error.message
        })
    }
}

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

        const obj = {
            "streetaddress": req.body.address.streetaddress || checkorder.address.streetaddress,
            "city": req.body.address.city || checkorder.address.city,
            "state": req.body.address.state || checkorder.address.state,
            "pincode": req.body.address.pincode || checkorder.address.pincode,
        }
        checkorder.address = obj;
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

const updateorderstatus = async (req, res) => {
    try {

        const checkorder = await order.findById(req.params.id);

        if (!checkorder) {
            return res.status(400).json({
                success: false,
                data: [],
                message: 'order not exists'
            })
        }

        checkorder.orderstatus = req.body.orderstatus;
        checkorder.save();

        if (!checkorder) {
            return res.status(400).json({
                success: false,
                data: [],
                message: 'order status not update'
            })
        }

        return res.status(200).json({
            success: true,
            data: checkorder,
            message: 'order status update'
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            data: [],
            message: 'internal server error at update status at order' + error.message
        })
    }
}

// const updatepaymentstatus = async (req, res) => {
//     try {

//         const checkorder = await order.findById(req.params.id);

//         if (!checkorder) {
//             return res.status(400).json({
//                 success: false,
//                 data: [],
//                 message: 'order not exists'
//             })
//         }

//         checkorder.paymentstatus = req.body.paymentstatus;
//         checkorder.save();

//         if (!checkorder) {
//             return res.status(400).json({
//                 success: false,
//                 data: [],
//                 message: 'payment status not update'
//             })
//         }

//         return res.status(200).json({
//             success: true,
//             data: checkorder,
//             message: 'payment status not update '
//         })

//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             data: [],
//             message: 'internal server error at update payment status at order' + error.message
//         })
//     }
// }

const deleteorder = async (req, res) => {
    try {

        const checkorder = await order.findById(req.params.id);

        if (!checkorder) {
            return res.status(400).json({
                success: false,
                data: [],
                message: 'order not exists'
            })
        }

        const orderdata = await order.findByIdAndDelete(req.params.id);

        if (!orderdata) {
            return res.status(400).json({
                success: false,
                data: [],
                message: 'order not delete'
            })
        }

        return res.status(200).json({
            success: true,
            data: orderdata,
            message: 'order delete'
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            data: [],
            message: 'internal server error at order not delete' + error.message
        })
    }
}

const moreselling = async (req, res) => {
    try {

        const sellingproduct = await order.aggregate([
            {
                $unwind: "$products"
            },
            {
                $group: {
                    _id: '$products.variant_id',
                    product_id: {
                        $first: '$products.product_id'
                    },
                    totalproduct: {
                        $sum: 1
                    }
                }
            },
            {
                $sort: {
                    totalproduct: -1
                }
            },
            {
                $limit: 6
            }
        ])
        console.log(sellingproduct)

        if (!sellingproduct) {
            return res.status(400).json({
                success: false,
                data: [],
                message: 'product not get'
            })
        }

        return res.status(200).json({
            success: true,
            data: sellingproduct,
            message: 'product  get'
        })


    } catch (error) {
        return res.status(500).json({
            success: false,
            data: [],
            message: 'internal server error at moreselling grt product ' + error.message
        })
    }
}

module.exports = {
    getallorder,
    getorder,
    addorder,
    updateshippingaddress,
    updateorderstatus,
    deleteorder,
    moreselling
}

//  "product_id":"69ddbecbfdcedc9c300fda20",
//  "variant_id":"69e9e3427678a08376a43f09",