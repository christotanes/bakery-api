console.log("Hello world from models/Product.js");
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
    enum: ['Cake', 'Bread', 'Snack'],
    required: [true, 'Type of Product is Required']
  },
  size: {
    type: String,
    enum: ['Regular', 'Medium', 'Large'],
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
    type: Number,
    default: 5
  },
  vegetarian: {
    type: Boolean,
    default: false
  },
  featured: {
    type: Boolean,
    default: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  img:{
    type: String,
    required: [true, 'Product Image URL is Required' ]
  },
  imgLqip:{
    type: String,
    required: [true, 'Product Image LQIP URL is Required' ]
  },
  imgBanner:{
    type: String,
    required: [true, 'Product Image Banner URL is Required' ]
  },
  imgBannerLqip:{
    type: String,
    required: [true, 'Product Image Banner LQIP URL is Required' ]
  },
  createdOn: {
    type: Date,
    default: new Date()
  },
});
  
export default mongoose.model('Product', productSchema);