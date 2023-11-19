console.log("Hello world from routes/review.js");
import express from 'express';
import { getAllReviews, getAllProductReviews, userAddReview, userEditReview, reviewRating } from '../controllers/review.js';
import { verify, verifyAdmin } from '../auth.js';

const router = express.Router();

router.get('/', verify, verifyAdmin, getAllReviews);

router.route('/:productId')
        .get(verify, verifyAdmin, getAllProductReviews)
        .post(verify, userAddReview)
        .put(verify, userEditReview)
        .patch(verify, verifyAdmin, reviewRating)

export default router;