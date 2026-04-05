const category = require('../model/category.model')


const getCategory = async (req,res) => {
    try {
        const categories = await category.find();

        if (!categories) {
            res.status(400).json({
                success: false,
                data: [],
                message: "category not fetch"
            })
        }

        res.status(200).json({
            success: true,
            data: categories,
            message: "category fetch successfully"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            data: [],
            message: "internal server error at category fetch " + error.message
        })
    }
}

module.exports = {
    getCategory
}