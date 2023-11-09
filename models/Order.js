console.log("Hello world from models/Order.js");
import { mongoose } from "mongoose";

// JSON schema for (placeholder = TaskSchema)
const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: [true, 'userId is Required']
    },
    products: [
        {
            productId: {
                type: String,
                required: [true, 'productId is Required']
            },
            quantity: {
                type: Number,
                required: [true, 'Quantity is Required']
            }
        }
    ],
    totalAmount: {
        type: Number,
        required: [true, 'TotalAmount is Required']
    },
    paymentInfo: {
        type: String,
        enum: ['Cash on Delivery', 'Visa', 'Mastercard', 'Gcash'],
        required: [true, 'PaymentInfo is Required']
    },
    deliveryAddress:{
        houseNo: {
            type: String,
            required: [true, 'House/Street No. is Required']
        },
        streetName: {
            type: String,
            required: [true, 'Street name is Required']
        },
        city: {
            type: String,
            required: [true, 'City name is Required']
        },
    },
    orderStatus: {
        type: String,
        enum: ['pending', 'completed'],
        required: [true, 'Order Status is Required'],
        default: ['pending']
    },
    purchasedOn: {
        type: Date,
        default: new Date()
    }
 });

export default mongoose.model('Order', orderSchema);