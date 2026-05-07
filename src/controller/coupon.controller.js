const coupon = require('../model/coupon.model')

const getAllcoupon = async (req, res) => {
    try {

        const coupondata = await coupon.find();

        if (!coupondata) {
            return res.status(400).json({
                success: false,
                data: [],
                message: 'coupon not get'
            })
        }

        return res.status(200).json({
            success: false,
            data: coupondata,
            message: 'coupon get'
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            data: [],
            message: 'internal server error at get coupon' + error.message
        })
    }
}

const getcoupon = async (req, res) => {
    try {
        console.log(req.params.id)
        const coupondata = await coupon.findById(req.params.id);

        if (!coupondata) {
            return res.status(400).json({
                success: false,
                data: [],
                message: 'coupon not get'
            })
        }

        return res.status(200).json({
            success: false,
            data: coupondata,
            message: 'coupon get'
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            data: [],
            message: 'internal server error at get coupon' + error.message
        })
    }
}

const addcoupon = async (req, res) => {
    try {
        console.log(req.body)
        const check = await coupon.findOne({ code: req.body.code })

        if (check) {
            return res.status(400).json({
                success: false,
                data: [],
                message: 'coupon alerdy exists'
            })
        }

        const coupondata = await coupon.create(req.body);

        if (!coupondata) {
            return res.status(400).json({
                success: false,
                data: [],
                message: 'coupon not add'
            })
        }

        return res.status(200).json({
            success: false,
            data: coupondata,
            message: 'coupon add'
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            data: [],
            message: 'internal server error at coupon add' + error.message
        })
    }
}

const updatecoupon = async (req, res) => {
    try {
        console.log(req.body)
        const check = await coupon.findById(req.params.id)

        if (!check) {
            return res.status(400).json({
                success: false,
                data: [],
                message: 'coupon not exists'
            })
        }

        const coupondata = await coupon.findByIdAndUpdate(req.params.id,
            req.body,
            { new: true }
        );

        if (!coupondata) {
            return res.status(400).json({
                success: false,
                data: [],
                message: 'coupon not update'
            })
        }

        return res.status(200).json({
            success: false,
            data: coupondata,
            message: 'coupon update'
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            data: [],
            message: 'internal server error at coupon update' + error.message
        })
    }
}

const deletecoupon = async (req, res) => {
    try {
        console.log(req.body)
        const check = await coupon.findById(req.params.id)

        if (!check) {
            return res.status(400).json({
                success: false,
                data: [],
                message: 'coupon not exists'
            })
        }

        const coupondata = await coupon.findByIdAndDelete(req.params.id);

        if (!coupondata) {
            return res.status(400).json({
                success: false,
                data: [],
                message: 'coupon not delete'
            })
        }

        return res.status(200).json({
            success: false,
            data: coupondata,
            message: 'coupon delete'
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            data: [],
            message: 'internal server error at coupon delete' + error.message
        })
    }
}

const changeactive = async (req, res) => {
    try {
        console.log(req.body)
        const check = await coupon.findById(req.params.id)

        if (!check) {
            return res.status(400).json({
                success: false,
                data: [],
                message: 'coupon not exists'
            })
        }

        check.isActive = req.body.isActive;
        check.save();

        if (!check) {
            return res.status(400).json({
                success: false,
                data: [],
                message: 'coupon not delete'
            })
        }

        return res.status(200).json({
            success: false,
            data: check,
            message: 'coupon delete'
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            data: [],
            message: 'internal server error at coupon toggle active' + error.message
        })
    }
}

const checkcoupon = async (req, res) => {
    try {
        console.log(req.body)
        const check = await coupon.findOne({ code: req.body.code });

        if (!check) {
            return res.status(400).json({
                success: false,
                data: [],
                message: 'coupon not found'
            })
        }

        const date = new Date();

        if (date <= check.enddate) {
            return res.status(200).json({
                success: true,
                data:check,
                message: 'coupon  found'
            })
        } else {            
             return res.status(400).json({
                success: false,
                data: [],
                message: 'coupon is expired'
            })
        }
        console.log(date)
        // const checkdate;

    } catch (error) {
        return res.status(500).json({
            success: false,
            data: [],
            message: 'internal server error at chech coupon ' + error.message
        })
    }
}

module.exports = {
    addcoupon,
    getAllcoupon,
    getcoupon,
    deletecoupon,
    updatecoupon,
    checkcoupon,
    changeactive
}

