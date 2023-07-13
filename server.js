require('dotenv').config();

const mongoose = require('mongoose');
// const MongoConnectUrl = process.env.MONGOCONNECTIONURL;
const MongoConnectUrl = 'mongodb://127.0.0.1:27017/eCommerceS?directConnection=true&serverSelectionTimeoutMS=2000'

const jwt = require('jsonwebtoken');
const express = require('express');
const cors = require('cors');
const PORT = process.env.PORT;

//Routes
const usersRouter = require('./routes/usersRouter');
const adminsRouter = require('./routes/adminsRouter');
const productsRouter = require('./routes/productsRouter');

// Adding Middleware

const app = express();

app.use(express.json());
app.use(cors())

//Routes
app.use('/user', usersRouter);
app.use('/admin', adminsRouter);
app.use('/product', productsRouter);


// Endpoints

app.get('/', (req, res) => {
    console.log('Home Page Accessed');
    return res.status(200).send({message:"eCommerceServer root endpoint"})
});

// Authorization


// Connecting to Mongoose

async function mongoConnect(){
    await mongoose.connect(MongoConnectUrl);
    console.log("connection to database established")
}


// Starting Server


mongoConnect().catch((err) => console.log(err));
app.listen(PORT, () => {
    console.log(`app is now listening on http://localhost:${PORT}`)
})



