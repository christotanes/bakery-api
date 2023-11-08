console.log("Hello world from model.js");
import { mongoose } from "mongoose";

// JSON schema for (placeholder = TaskSchema)
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name of Product is Required']
  },
  description: {
    type: String,
    required: [true, 'Description of product is Required']
  },
  type: {
    type: String,
    enum: ['cake', 'bread'],
    required: [true, 'Type of Product is Required']
  },
  size: {
    type: String,
    enum: ['regular', 'medium', 'large'],
    required: [true, 'Size of Product is Reguired']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity of Product is Required']
  },
  price: {
    type: Number,
    required: [true, 'Price of Product is Required']
  },
  allergens: {
    type: [String],
    default: []
  },
  weight: {
    type: String
  },
  deliveryAvailable: {
    type: Boolean,
    default: false,
  },
  flavors: {
    type: [String],
    default: []
  },
  bestBefore: {
    type: String
  },
  vegetarian: {
    type: Boolean,
    default: false
  },
  featured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  userOrders: [
    {
      userId: {
        type: String,
        required: [true, 'userId is Required']
      },
      orderId: {
        type: String,
        required: [true, 'orderId is Required']
      }
    }
  ],
  createdOn: {
    type: Date,
    default: new Date()
  },
});
  
export default mongoose.model('Product', productSchema);