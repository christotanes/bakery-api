import express from 'express';
import mongoose from 'mongoose';
// import axios from 'axios';
import cors from 'cors';
import productRoute from './routes/product.js';
import userRoute from './routes/user.js';
import orderRoute from './routes/order.js';
import { getAllProducts } from './controllers/product.js';
import * as dotenv from 'dotenv'
dotenv.config();

const app = express();

const mongoUser = process.env.MONGO_USER;
const mongoPassword = process.env.MONGO_PASSWORD;
const mongoHost = process.env.MONGO_HOST;
const mongoDB = process.env.MONGO_DB;

mongoose.connect(`mongodb+srv://${mongoUser}:${mongoPassword}@${mongoHost}/${mongoDB}`);

// Will check connection
let db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error"));
db.on("open", () => console.log("Now connected to Bakery MongoDB"));

app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(express.json());

// app.use('/', productRoute);
app.use('/users', userRoute);
app.use('/products', productRoute);
app.use('/orders', orderRoute);
app.get('/', getAllProducts);

// Listen to the port
app.listen(process.env.PORT || port, () => {
        console.log(`API is now online on port ${process.env.PORT || port}`);
});

export {app, mongoose};