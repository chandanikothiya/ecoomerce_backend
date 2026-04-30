require('dotenv').config();
const express = require('express')
const mongoDbconnection = require('./databseconnection/mongoDbconnection')
const routes = require('./routes/api/v1/index')
const cookieParser = require('cookie-parser');
const cors = require('cors');
const googleprovider = require('./services/socialprovider');
const passport = require('passport');
const session = require('express-session');
const makepdf = require('./services/invoicepdf');
const app = express()

// app.get('/',(req,res) => {
//     res.send("hello world")
// })

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
}))

app.use(cors({
    origin: 'http://localhost:5173',
    optionsSuccessStatus: 200,
    credentials: true
}))


app.use('/public', express.static('public'))
app.use(passport.initialize());
app.use(passport.session());

googleprovider();

mongoDbconnection();
app.use(cookieParser());
app.use(express.json());

app.get('/invoice/:id', async (req, res) => {
    try {
        const pdfDoc = await makepdf(req.params.id);

        res.setHeader("Content-Type", "application/pdf");

        pdfDoc.pipe(res);   // <-- now it will work
        pdfDoc.end();

    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
})

//http://localhost:8080/api/v1
app.use('/api/v1', routes)

app.listen(8080, () => {
    console.log('server is running on port 8080')
})