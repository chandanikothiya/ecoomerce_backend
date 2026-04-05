const mongoose = require('mongoose');
 const mongoDbconnection = async () => {
    try {
       await  mongoose.connect('mongodb://localhost:27017/ecommerce1')
        .then(() => console.log('mongodb connection successfully'))
        .catch((error) => console.log('error in connection',error))
    } catch (error) {
        console.log("error at connection mongodb at internal server error",error.message)
    }
}

module.exports = mongoDbconnection;