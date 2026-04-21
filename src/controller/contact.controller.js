
const contact = require('../model/contact.model')

const getconatct = async (req, res) => {
    try {
       
        const contacts = await contact.find()

        if (!contacts) {
            return res.status(400).json({
                success: false,
                data: null,
                message: 'contact,message not fetch'
            })
        }

        return res.status(200).json({
            success: true,
            data: contacts,
            message:  'contact,message fetch'
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            data: null,
            message: ' internal server error at contact,message fetch ' + error.message 
        })
    }
}

const addconatct = async (req, res) => {
    try {
        console.log(req.body)
        const contactdata = await contact.findOne({ email: req.body.email });
        console.log(contactdata)

        if (contactdata) {
            return res.status(400).json({
                success: false,
                data: null,
                message: 'email alerdy exists'
            })
        }

        const contacts = await contact.create(req.body)

        if (!contacts) {
            return res.status(400).json({
                success: false,
                data: null,
                message: 'contact,message not save'
            })
        }

        return res.status(200).json({
            success: true,
            data: contacts,
            message:  'contact,message save'
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            data: null,
            message: ' internal server error at contact,message save ' + error.message 
        })
    }
}

module.exports = {
    getconatct,
    addconatct
}