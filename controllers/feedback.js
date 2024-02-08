import Feedback from "../models/Feedback.js";
import Order from "../models/Order.js";

// [SECTION - FEEDBACK - STRETCH] User retrieves feedback
export async function getFeedback(req, res) {
    try {
        const feedback = await Feedback.find({ userId: req.user.id });
        if (!feedback) {
            return res.status(404).json({
                error: 'Feedback not found',
                message: "User has not yet registered a feedback"
            });
        };

        return res.status(200).send(feedback);
    } catch (error) {
        console.error(`Error: ${error}`);
        return res.status(500).send('Internal Server Error');
    };
};

// [SECTION - FEEDBACK - STRETCH] User adds/posts feedback
export async function addFeedback(req, res) {
    const { message } = req.body
    try {
        const feedback = await Feedback.findOne({ userId: req.user.id });
        if (feedback) {
            return res.status(400).json({
                error: "User has a duplicate feedback",
                message: "User has already posted a feedback."
            })
        };

        const checkUserBought = await Order.find({ userId: req.user.id});
        if(!checkUserBought){
            return res.status(400).json({
                error: "User has not bought",
                message: "User has not bought any items yet"
            })
        }

        const newFeedback = new Feedback({
            userId: req.user.id,
            message: message
        });
        
        await newFeedback.save();
        return res.status(200).send(newFeedback);
    } catch (error) {
        console.error(`Error: ${error}`);
        return res.status(500).send('Internal Server Error');
    };
};

// [SECTION - FEEDBACK - STRETCH] User edits feedback
export async function editFeedback(req, res) {
    const { message, id } = req.body
    try {
        const feedback = await Feedback.findOne({ userId: req.user.id });
        if (!feedback) {
            return res.status(404).json({
                error: 'Feedback not found',
                message: "There is no feedback registered with that id"
            });
        };
        feedback.message = message
        await feedback.save();
        return res.status(200).send(feedback);
    } catch (error) {
        console.error(`Error: ${error}`);
        return res.status(500).send('Internal Server Error');
    };
};

// [SECTION - FEEDBACK - STRETCH] Admin sets feedback to be shown on testimonials
export async function showFeedback(req, res) {
    const { _id, showFeedback } = req.body
    try {
        const feedback = await Feedback.findById(_id);
        if (!feedback) {
            return res.status(404).json({
                error: 'Feedback not found',
                message: "There is no feedback registered with this id"
            });
        };
        feedback.showFeedback = showFeedback;
        await feedback.save();
        return res.status(200).send(feedback);
    } catch (error) {
        console.error(`Error: ${error}`);
        return res.status(500).send('Internal Server Error');
    };
};

// [SECTION - FEEDBACK - STRETCH] Admin gets all feedback from all users
export async function getAllFeedback(req, res) {
    try {
        const allFeedback = await Feedback.find({});
        if (allFeedback.length === 0) {
            return res.status(404).json({
                error: 'No feedback found',
                message: "There are no feedbacks by any user yet"
            });
        };
        return res.status(200).send(allFeedback);
    } catch (error) {
        console.error(`Error: ${error}`);
        return res.status(500).send('Internal Server Error');
    };
};