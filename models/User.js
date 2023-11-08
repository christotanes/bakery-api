console.log("Hello world from model.js");
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
    required: [true, 'Email is Required']
  },
  password: {
    type: String,
    required: [true, 'Password is Required']
  },
  mobileNo: {
    type: Number
  },
  address: {
    houseNo: {
      type: Number
    },
    streetName: {
      type: String
    },
    city: {
      type: String
    }
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  orderedProduct: [
    { products: [
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
          }
        }
      ],
        paymentInfo: {
          type: [{
            type: String,
            enum: ['Cash on Delivery', 'Visa', 'Mastercard', 'Gcash']
          }],
          default: ['Cash on Delivery']
        },
        totalAmount: {
          type: Number,
          required: [true, 'Total Amount is Required']
        },
        purchasedOn: {
          type: Date,
          default: new Date()
        }
      }
    ],
    createdOn: {
      type: Date,
      default: new Date()
    }
  });
  
  export default mongoose.model('User', userSchema);