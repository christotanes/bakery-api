import express from 'express';
import { getFeedback, addFeedback, editFeedback, showFeedback, getAllFeedback } from '../controllers/feedback.js';
import { verify, verifyAdmin } from '../auth.js';

const router = express.Router();

router.route("/")
    .get(verify, getFeedback)
    .post(verify, addFeedback)
    .put(verify, editFeedback)
    .patch(verify, verifyAdmin, showFeedback);

router.get("/all", verify, verifyAdmin, getAllFeedback);

export default router;