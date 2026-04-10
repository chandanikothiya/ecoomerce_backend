const multer = require("multer");
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log("file", file)
        const filepath = path.join('public', 'images', file.fieldname);

        fs.mkdir(filepath,{recursive:true},(error) => {
            console.log("at upload mkdir",error)
        })

        cb(null, filepath)
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + '-' + file.originalname)
    }
})

const upload = multer({ storage: storage })

module.exports = upload


// file {
//   fieldname: 'img',
//   originalname: '672462_ZAH9D_5626_002_100_0000_Light-The-North-Face-x-Gucci-coat 1.png',
//   encoding: '7bit',
//   mimetype: 'image/png'
// }