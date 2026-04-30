const { default: mongoose } = require("mongoose");

const paymentschema = mongoose.Schema({
    user_id: {
        type: mongoose.Types.ObjectId,
        ref: 'users',
        required: true
    },
    order_id: {
        type: mongoose.Types.ObjectId,
        ref: 'orders',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    paymentmethod: {
        type: String,
       //enum: ["card", "upi","cod"],
        default: "cod",
    },
    paymentstatus: {
        type: String,
        enum: ["PENDING", "SUCCESS", "fAILED"],
        default: "PENDING",
    },
    transectionid: {
        type: String
    },
    paymentgatway: {
        type: String
    }
}, {
    timestamps: true,
    versionKey: false
})

const payment = mongoose.model('payment', paymentschema);
module.exports = payment;