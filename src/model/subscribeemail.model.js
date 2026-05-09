const { default: mongoose } = require("mongoose");

const subscribeschema = mongoose.Schema({
    email:{
        type:String,
        required:true
    }
}, {
    timestamps: true,
    versionKey: false
})

const subscribe = mongoose.model('subscribe', subscribeschema);
module.exports = subscribe;