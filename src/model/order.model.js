const { default: mongoose } = require("mongoose");

const orderschema = mongoose.Schema({
    user_id: {
        type: mongoose.Types.ObjectId,
        ref: 'users',
        required: true
    },
    products: [
        {
            product_id: {
                type: mongoose.Types.ObjectId,
                ref: 'products'
            },
            variant_id: {
                type: mongoose.Types.ObjectId,
            },
            quantity: {
                type: Number,
                required: true
            },
            price: {
                type: Number,
                required: true
            }
        }
    ],
    totalamount: {
        type: Number,
        required: true
    },
    address: {
        companyname: {
            type: String
        },
        streetaddress: {
            type: String,
            
        },
        aptfloor: {
            type: String
        },
        city: {
            type: String,
            
        },
        state: {
            type: String,
            
        },
        pincode: {
            type: String
        }
    },
    orderstatus: {
        type: String,
        enum: ["placed", "shipped", "delivered", "cancelled"],
        default: "PLACED",
    }
}, {
    timestamps: true,
    versionKey: false
})

const order = mongoose.model('order',orderschema);
module.exports = order;