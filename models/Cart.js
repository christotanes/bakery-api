console.log("Hello world from models/Cart.js");
import { mongoose } from "mongoose";

// JSON schema for (placeholder = TaskSchema)
const cartSchema = new mongoose.Schema({
    cart: {
        products: [
        {
            productId: {
            type: String,
            required: [true, 'Product ID is required']
            },
            quantity: {
            type: Number,
            required: [true, 'Quantity is Required']
            },
            price: {
            type: Number,
            required: [true, 'Price is Required']
            },
            subTotal: {
            type: Number,
            required: [true, 'Subtotal is Required']
            },
        },
        ],
        totalAmount: {
        type: Number,
        default: 0
        },
    },
    createdOn: {
        type: Date,
        default: new Date()
    }
});

export default mongoose.model('Cart', cartSchema);