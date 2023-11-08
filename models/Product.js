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
    type: [{
      type: String,
      enum: ['Cake', 'Bread']
    }],
    default: ['Cake']
  },
  price: {
    type: Number,
    required: [true, 'Price of Product is Required']
  },
  size: {
    type: String,
    required: [true, 'Size of Product is Required']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity of Product is Required']
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