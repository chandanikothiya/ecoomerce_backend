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
    maxdiscount: {
        type: Number,
        require: true,
    },
    startdate: {
        type: Date,
        require: true,
    },
    enddate: {
        type: Date,
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