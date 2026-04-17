const { default: mongoose } = require("mongoose");


const userScehem = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            unique: true,
            sparse: true // allow null
            //  required: true
        },
        phone: {
            type: String,
            unique: true,
            sparse: true // allow null
        },
        password: {
            type: String,
        },
        otp: {
            type: Number,

        },
        isverify: {
            type: Boolean,
            default: false
        },
        refreshtoken: {
            type: String
        },
        profileid: {
            type: Number
        },
        address:{
            type:String
        }

    },
    {
        timestamps: true,
        versionKey: false
    }
)

const userauth = mongoose.model('user', userScehem);
module.exports = userauth;