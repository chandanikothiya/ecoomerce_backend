const subscribe = require('../model/subscribeemail.model')

const getemail = async (req, res) => {
    try {
       
        const emaildata = await subscribe.find();

        if (!emaildata) {
             return res.status(400).json({
                success: false,
                data: [],
                message: "email not get"
            })
        }

         return res.status(200).json({
                success: true,
                data: emaildata,
                message: "email get"
            })

    } catch (error) {
         return res.status(500).json({
                success: false,
                data: [],
                message: "internal sever error at email  get" + error.message
            })
    }
}

const addemail = async (req, res) => {
    try {
        const checkemail = await subscribe.findOne({ email: req.body.email })

        if (checkemail) {
            return res.status(400).json({
                success: false,
                data: [],
                message: "email exists"
            })
        }

        const emaildata = await subscribe.create(req.body);

        if (!emaildata) {
             return res.status(400).json({
                success: false,
                data: [],
                message: "email not add"
            })
        }

         return res.status(200).json({
                success: true,
                data: emaildata,
                message: "email add"
            })

    } catch (error) {
         return res.status(500).json({
                success: false,
                data: [],
                message: "internal sever error at email  add" + error.message
            })
    }
}

module.exports = {
    getemail,
    addemail
}
