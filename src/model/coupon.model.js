const { default: mongoose } = require("mongoose");

const couponschema = mongoose.Schema({
    code: {
        type: String,
        require: true,
    },
    title: {
        type: String,
        require: true,
    },
    discount: {
        type: String,
        require: true,
    },
    startdate: {
        type: String,
        require: true,
    },
    enddate: {
        type: String,
        require: true,
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    versionKey: false
})

const coupon = mongoose.model('coupon', couponschema);
module.exports = coupon;