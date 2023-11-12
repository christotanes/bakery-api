console.log("Hello world from models/Feedback.js");
import { mongoose } from "mongoose";

// JSON schema for (placeholder = TaskSchema)
const feedbackSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: [true, 'userId is Required']
    },
    message: {
        type: String,
        required: [true, 'Feedback message is Required']
    },
    showFeedback: {
        type: Boolean,
        default: false
    },
    createdOn: {
        type: Date,
        default: new Date()
    }
});

export default mongoose.model('Feedback', feedbackSchema);