// import mongoose from 'mongoose';

const mongoose = require("mongoose");

const categoryschema = new mongoose.Schema({
    name:{
        type:String,
        require:true,
        trim:true
    },
    description:{
        type:String
    },
    parentcategory_id:{
        type:mongoose.Types.ObjectId,
        ref:'category',
        default:null
    },
    isActive:{
        type:Boolean,
        default:true
    }
},
{
    timestamps:true,
    versionKey:false
}
)

const category = mongoose.model('category',categoryschema)
module.exports = category;