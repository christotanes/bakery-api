import { mongoose } from "mongoose";

// JSON schema for Review
const reviewSchema = new mongoose.Schema({
    productId: {
        type: String,
        required: [true, 'ProductId is Required']
    },
    reviews: [
        {
        userId: {
            type: String,
            required: [true, 'userId is Required']
        },
        rating: {
            type: Number,
            enum: [1, 2, 3, 4, 5],
            required: [true, 'Number Rating is Required']
        },
        message: {
            type: String
        },
        showReview: {
            type: Boolean,
            default: false
        }
    }
    ],
    createdOn: {
        type: Date,
        default: new Date()
    },
});

export default mongoose.model('Review', reviewSchema);