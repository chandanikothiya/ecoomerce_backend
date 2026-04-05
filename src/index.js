require('dotenv').config();
const express = require('express')
const mongoDbconnection = require('./databseconnection/mongoDbconnection')
const routes = require('./routes/api/v1/index')
const cookieParser = require('cookie-parser');

const app = express()

// app.get('/',(req,res) => {
//     res.send("hello world")
// })

mongoDbconnection();
app.use(cookieParser());
app.use(express.json());

//http://localhost:8080/api/v1
app.use('/api/v1',routes)

app.listen(8080,() =>  {
    console.log('server is running on port 8080')
})