import express from 'express';
import mongoose from 'mongoose';
// import axios from 'axios';
import cors from 'cors';
import productRoute from './routes/product.js';
import userRoute from './routes/user.js';

const app = express();
const port = 4000;

mongoose.connect("mongodb+srv://admin:admin@zuitt-bootcamp.3qeebta.mongodb.net/bakerycapstone?retryWrites=true&w=majority");

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

// Listen to the port

app.listen(port, () => console.log(`Server running at port ${port}`))

export {app, mongoose};