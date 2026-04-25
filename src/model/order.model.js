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
    paymentmethod: {
        type: String,
        enum: ["COD", "ONLINE"],
        default: "COD",
    },
    paymentstatus: {
        type: String,
        enum: ["PENDING", "PAID", "FAILED"],
        default: "PENDING",
    },
    orderstatus: {
        type: String,
        enum: ["PLACED", "SHIPPED", "DELIVERED", "CANCELLED"],
        default: "PLACED",
    }
}, {
    timestamps: true,
    versionKey: false
})

const order = mongoose.model('order',orderschema);
module.exports = order;