const { default: mongoose } = require("mongoose");


const wishlistschema = mongoose.Schema({
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
            variant_id: {
                type: mongoose.Types.ObjectId,
            }
        }
    ],
},
    {
        timestamps: true,
        versionKey: false
    }
)


const wishlist = mongoose.model('wishlist', wishlistschema);
module.exports = wishlist;