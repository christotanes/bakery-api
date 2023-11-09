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
  orderedProducts: [
    {
      products:[
          {
            productId: {
              type: String,
              required: [true, 'Product ID is required']
            },
            productName: {
              type: String,
              required: [true, 'Product Name is Required']
            },
            quantity: {
              type: Number,
              required: [true, 'Quantity bought is Required']
            },
          }
        ],
      paymentInfo: {
        type: String,
        enum: ['Cash on Delivery', 'Visa', 'Mastercard', 'Gcash']
      },
      totalAmount: {
        type: Number,
        required: [true, 'Total Amount is Required']
      },
      purchasedOn: {
        type: Date,
        default: new Date()
      },
    },
  ],
  cart: [
    {
      products:[
        {
          productId: {
            type: String,
            required: [true, 'Product ID is required']
          },
          productName: {
            type: String,
            required: [true, 'Product Name is Required']
          },
          quantity: {
            type: Number,
            required: [true, 'Quantity bought is Required']
          },
        }
      ],
      totalAmount: {
        type: Number,
        required: [true, 'Total Amount is Required']
      },
    }
  ],
  createdOn: {
    type: Date,
    default: new Date()
  },
});
  
export default mongoose.model('User', userSchema);