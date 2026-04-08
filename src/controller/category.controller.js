const category = require('../model/category.model');

const getCategory = async (req, res) => {
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

const addCategory = async (req, res) => {
    try {

        const checkcat = await category.findOne({ name: req.body.name })

        if (checkcat) {
            return res.status(400).json({
                success: false,
                data: null,
                message: 'category alerdy exists'
            })
        }

        const catgeory = await category.create(req.body);

        if (!catgeory) {
            return res.status(400).json({
                success: false,
                data: null,
                message: 'category not added'
            })
        }

        return res.status(200).json({
            success: true,
            data: catgeory,
            message: 'category added successfully'
        })

    } catch (error) {
        return res.status(500).json({
            success: true,
            data: null,
            message: 'internal server error at category added ' + error.message
        })
    }
}

const updateCategory = async (req, res) => {
    console.log(req.params.id)
    try {
        const checkcat = await category.findById(req.params.id);

        if (!checkcat) {
            return res.status(400).json({
                success: false,
                data: null,
                message: 'category not exists'
            })
        }

        const updatecategory = await category.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        )

        if (!updatecategory) {
            return res.status(400).json({
                success: false,
                data: null,
                message: 'category not update'
            })
        }

        return res.status(200).json({
            success: false,
            data: updatecategory,
            message: 'category update successfully'
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            data: null,
            message: 'internal server error at category update' + error.mesage
        })
    }
}

const deleteCatgoey = async (req, res) => {
    try {
        const checkcat = await category.findById(req.params.id);

        if (!checkcat) {
            return res.status(400).json({
                success: false,
                data: null,
                message: 'category not exists'
            })
        }

        const deletecatgoey = await category.findByIdAndDelete(req.params.id);

        if (!deletecatgoey) {
            return res.status(400).json({
                success: false,
                data: null,
                message: 'category not delete'
            })
        }

        return res.status(200).json({
            success: false,
            data: deletecatgoey,
            message: 'category delete successfully'
        })
    } catch (error) {
         return res.status(500).json({
            success: false,
            data: null,
            message: 'internal server error at category delete' + error.mesage
        })
    }
}

module.exports = {
    getCategory,
    addCategory,
    updateCategory,
    deleteCatgoey
}