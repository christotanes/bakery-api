console.log("Hello world from models/Cart.js");
import { mongoose } from "mongoose";

// JSON schema for (placeholder = TaskSchema)
const cartSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: [true, 'User ID is required']
    },
    products: [
        {
            productId: {
                type: String,
                required: [true, 'Product ID is required']
            },
            name: {
                type: String,
                required: [true, 'Product Name is required']
            },
            img: {
                type: String,
                required: [true, 'Product Image Link is required']
            },
            imgLqip: {
                type: String,
                required: [true, 'Product Image LQIP is required']
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
            productAddedOn: {
                type: Date,
                default: new Date()
            }
        }
    ],
    totalAmount: {
        type: Number,
        default: 0
    },
    createdOn: {
        type: Date,
        default: new Date()
    }
});

export default mongoose.model('Cart', cartSchema);