const { default: mongoose } = require("mongoose");


const userScehem = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        emailphone: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        otp:{
            type:Number,
            required:true
        },
        isverify: {
            type: Boolean,
            default: false
        },
          refreshtoken: {
            type: String
        }

    },
    {
        timestamp: true,
        versionKey: false
    }
)

const userauth = mongoose.model('user', userScehem);
module.exports = userauth;