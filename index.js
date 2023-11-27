import express from 'express';
import mongoose from 'mongoose';
// import axios from 'axios';
import cors from 'cors';
import productRoute from './routes/product.js';
import userRoute from './routes/user.js';
import orderRoute from './routes/order.js';
import cartRoute from './routes/cart.js';
import feedbackRoute from './routes/feedback.js';
import reviewRoute from './routes/review.js'
import 'dotenv/config'

const app = express();
const port = `${process.env.MONGO_PORT}`;

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_DATABASE}/${process.env.MONGO_COLLECTION}`);

// Will check connection
let db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error"));
db.on("open", () => console.log("Now connected to Bakery MongoDB"));

app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(express.json());
app.use(cors());

// app.use('/', productRoute);
app.use('/users', userRoute);
app.use('/products', productRoute);
app.use('/orders', orderRoute);
app.use('/cart', cartRoute);
app.use('/feedbacks', feedbackRoute);
app.use('/reviews', reviewRoute);

// Listen to the port
app.listen(port, () => {
    console.log(`API is now online on port ${port}`);
});


// app.listen(port, () => console.log(`Server running at port ${port}`))

export {app, mongoose};