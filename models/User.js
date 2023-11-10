console.log("Hello world from models/User.js");
import { mongoose } from "mongoose";

// JSON schema for (placeholder = TaskSchema)
const userSchema = new mongoose.Schema({
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  email: {
    type: String,
    required: [true, 'Email is Required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/\S+@\S+\.\S+/, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is Required'],
    minlength: [8, 'Password must be at least 8 characters']
  },
  mobileNo: {
    type: String
  },
  address: {
    houseNo: {
      type: String
    },
    streetName: {
      type: String
    },
    city: {
      type: String
    },
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
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
      required: [true, 'Total Amount is Required']
    },
  },
  feedback: [
    {
      message: {
        type: String,
        required: [true, 'Feedback Message is Required']
      },
      adminReply: {
        type: String
      }
    }
  ],
  createdOn: {
    type: Date,
    default: new Date()
  },
});
  
export default mongoose.model('User', userSchema);