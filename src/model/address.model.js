const { default: mongoose } = require("mongoose");

const addressschema = mongoose.Schema({
    user_id: {
        type: mongoose.Types.ObjectId,
        ref: 'users',
        required: true
    },

    companyname: {
        type: String
    },
    streetaddress: {
        type: String,
        required: true
    },
    aptfloor: {
        type: String
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        require: true
    },
    pincode: {
        type: String
    }

}, {
    timestamps: true,
    versionKey: false
})

const address = mongoose.model('address', addressschema);
module.exports = address;