const { default: mongoose } = require("mongoose");


const contactschema = mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type:String
    },
    phone:{
        type:Number
    },
    message:{
        type:String
    },
    isActive:{
        type:Boolean,
        default:true
    }
},{
    timestamps:true,
    versionKey:false
})

const contact = mongoose.model('contact',contactschema)

module.exports = contact;