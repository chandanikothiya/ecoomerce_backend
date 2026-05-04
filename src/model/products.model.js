const { default: mongoose } = require("mongoose");


const productsschema = mongoose.Schema({
    category_id: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'category'
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        require: true
    },

    // discount: {
    //     type: Number,
    //     default: 0
    // },
    variants: [
        {
            color: {
                type: String

            },
            images: [
                {
                    type: String
                }
            ],
            size: [{
                type: String,
            }],
            quantity:{
                type:Number
            },
            isFlashSale: {
                type: Boolean,
                default: false
            },

            flashPrice: {
                type: Number,
                default: null
            },

            flashStart: {
                type: Date,
                default: null
            },

            flashEnd: {
                type: Date,
                default: null
            }
        }
    ],
    // product_img:{
    //     type: String
    // },
    isActive: {
        type: Boolean,
        default: true
    }
},
    {
        timestamps: true,
        versionKey: false
    })

const products = mongoose.model('products', productsschema);
module.exports = products;
