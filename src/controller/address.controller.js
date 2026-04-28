const address = require('../model/address.model');

const getalladdress = async (req, res) => {
    try {

        console.log(req.body)

        const addressdata = await address.find();

        if (!addressdata) {
            return res.status(400).json({
                success: false,
                data: [],
                message: 'address not found'
            })
        }

        return res.status(200).json({
            success: true,
            data: addressdata,
            message: 'address found'
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            data: [],
            message: 'internal server error at get address' + error.message
        })
    }
}
const getaddress = async (req, res) => {
    try {

    console.log("getaddress",req.params.id)

        const addressdata = await address.findOne({user_id:req.params.id});
        console.log(addressdata)

        if (!addressdata) {
            return res.status(400).json({
                success: false,
                data: [],
                message: 'address not found'
            })
        }

        return res.status(200).json({
            success: true,
            data: addressdata,
            message: 'address found'
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            data: [],
            message: 'internal server error at get address' + error.message
        })
    }
}

const addaddress = async (req, res) => {
    try {

        console.log(req.body)

        const addressdata = await address.create(req.body);

        if (!addressdata) {
            return res.status(400).json({
                success: false,
                data: [],
                message: 'address not add'
            })
        }

        return res.status(200).json({
            success: true,
            data: addressdata,
            message: 'address add'
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            data: [],
            message: 'internal server error at add address' + error.message
        })
    }
}

const updateaddress = async (req, res) => {
    try {

        console.log("updateaddress",req.body)

        const checkaddress = await address.findById(req.params.id);

        if (!checkaddress) {
            return res.status(400).json({
                success: false,
                data: [],
                message: 'address not exists'
            })
        }


        const addressdata = await address.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

         if (!addressdata) {
            return res.status(400).json({
                success: false,
                data: [],
                message: 'address not update'
            })
        }

        return res.status(200).json({
            success: true,
            data: addressdata,
            message: 'address update'
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            data: [],
            message: 'internal server error at update address' + error.message
        })
    }
}

module.exports = {
    getalladdress,
    getaddress,
    addaddress,
    updateaddress
}

//  "product_id":"69ddbecbfdcedc9c300fda20",
//  "variant_id":"69e9e3427678a08376a43f09",