const payment = require('../model/payment.model');
const { Cashfree, CardChannelEnum, AppProviderEnum, CFEnvironment } = require("cashfree-pg");

const createpayment = async (req, res) => {
    try {
        console.log("createpayment",req.body)
        const cashfree = new Cashfree(
            CFEnvironment.SANDBOX,
            process.env.Client_ID,
            process.env.Client_Secret_Key,
        );
        const orderId = "order_" + Math.floor(Math.random() * 100000000);
        var request = {
            order_amount: req.body.orderamt,
            order_currency: "INR",
            order_id: orderId,
            customer_details: {
                customer_id: req.body.customer_id,
                customer_name: req.body.customer_name,
                customer_email:req.body.customer_email,
                customer_phone: req.body.customer_phone,
            },
            order_meta: {
                return_url:
                    "https://www.cashfree.com/devstudio/preview/pg/web/checkout?order_id={order_id}"
            },
            order_note: "",
        };

        const response = await cashfree.PGCreateOrder(request);
        //expect(response.data.payment_session_id).toBeDefined();
        return res.status(200).json({
            success: true,
            payment_session_id: response.data.payment_session_id,
            orderId: orderId,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            data: [],
            message: 'internal server error at craete payment ' + error.message
        })
    }
}

const getpayment = async (req, res) => {
    try {

        const paymentdata = await payment.find()

        if (!paymentdata) {
            return res.status(400).json({
                success: false,
                data: [],
                message: 'payment not get'
            })
        }

        return res.status(200).json({
            success: true,
            data: paymentdata,
            message: 'payment get'
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            data: [],
            message: 'internal server error at get payment by order id ' + error.message
        })
    }
}

const addpayment = async (req, res) => {
    try {

        const paymentdata = payment.create(req.body);

        if (!paymentdata) {
            return res.status(400).json({
                success: false,
                data: [],
                message: 'payment data not add'
            })
        }

        return res.status(200).json({
            success: true,
            data: paymentdata,
            message: 'payment add'
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            data: [],
            message: 'internal server error at add payment' + error.message
        })
    }
}

const updatepaymentstatus = async (req, res) => {

    try {

        const checkpayment = await payment.findById(req.params.id);

        if (!checkpayment) {
            return res.status(400).json({
                success: false,
                data: [],
                message: 'payment not exists'
            })
        }

        checkpayment.paymentstatus = req.body.paymentstatus;
        checkpayment.save();

        if (!checkpayment) {
            return res.status(400).json({
                success: false,
                data: [],
                message: 'payment status not update'
            })
        }

        return res.status(200).json({
            success: true,
            data: checkpayment,
            message: 'payment status not update '
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            data: [],
            message: 'internal server error at update payment status ' + error.message
        })
    }
}

const getpaymentonorder = async (req, res) => {
    try {

        const paymentdata = await payment.find({ order_id: req.params.id })

        if (!paymentdata) {
            return res.status(400).json({
                success: false,
                data: [],
                message: 'payment not get'
            })
        }

        return res.status(200).json({
            success: true,
            data: paymentdata,
            message: 'payment get'
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            data: [],
            message: 'internal server error at get payment by order id ' + error.message
        })
    }
}



module.exports = {
    getpayment,
    addpayment,
    updatepaymentstatus,
    getpaymentonorder,
    createpayment
}