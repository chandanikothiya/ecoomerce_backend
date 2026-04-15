const { default: mongoose } = require("mongoose");


const cartSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Types.ObjectId,
        ref: 'users'
    },
    products: [
        {
              _id: false,
            product_id: {
              
                type: mongoose.Types.ObjectId,
                ref: 'products'
            },
        }
    ]
},
    {
        timestamps: true,
        versionKey: false
    }
)

const cart = mongoose.model('cart', cartSchema);
module.exports = cart