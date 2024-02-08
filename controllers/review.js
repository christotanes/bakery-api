import Review from "../models/Review.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

// [SECTION - STRECTH - Ratings] Admin gets ProductId's Specific Reviews
export async function getAllProductReviews(req,res) {
    try {
        const allReviews = await Review.findOne({productId: req.params.productId})
        if (!allReviews) {
            return res.status(404).json({
            error: 'Review not found',
            message: 'There are no reviews for that productId'
            });
        };
        
        if (allReviews.reviews.length === 0) {
            return res.status(204).send(false);
        };
        
        return res.status(200).send(allReviews.reviews);
    } catch (error) {
        console.error(`Error: ${error}`);
        return res.status(500).send('Internal Server Error');
    };
};

// [SECTION - STRECTH - Ratings] User adds review
export async function userAddReview(req,res) {
    let userReview = {
        userId: req.user.id,
        rating: req.body.rating,
        message: req.body.message
    };

    try {
        const userBoughtProduct = await Order.findOne({ userId: req.user.id });
        if (userBoughtProduct.length === 0) {
            return res.status(404).json({
            error: 'User not found in orders',
            message: "User has not bought any product"
            });
        };

        userBoughtProduct.products.forEach(product => {
            if (req.params.productId !== product.productId){
            return res.status(400).json({
                error: 'Product not found in Order',
                message: 'User has not bought a product with this Id'
            });
            }
        });

        const product = await Product.findById(req.params.productId)
        if (!product) {
            return res.status(404).json({
                error: 'Product not found',
                message: 'There is no product registered with that id'
            });
        };

        // Check if the user has already posted a review for this product
        const existingReview = await Review.findOne({productId: req.params.productId});
        if (existingReview) {const alreadyReviewed = existingReview.reviews.some(review => review.userId === req.user.id);
        if (alreadyReviewed) {
            return res.status(400).json({
            error: 'Review already exists',
            message: 'User has already posted a review for this product'
            });
        } else {
            // Add new review and save
            existingReview.reviews.push(userReview);
            await existingReview.save();
            return res.status(200).send(existingReview);
        }
        } else {
        const newReview = new Review({
            productId: req.params.productId,
            reviews: [userReview]
        })
        await newReview.save();
        return res.status(200).send(newReview);
    }
    } catch (error) {
        console.error(`Error: ${error}`);
        return res.status(500).send('Internal Server Error');
    };
};

  // [SECTION - STRECTH - Ratings] User edit's review
export async function userEditReview(req,res) {
    const { userId, showReview, rating, message } = req.body;
    try {
        const review = await Review.findOne({productId: req.params.productId})
        if (!review) {
        return res.status(404).json({
                error: 'review not found',
                message: 'There is no review registered with that id'
        });
        };

        const userIdReviewIndex = review.reviews.findIndex(review => review.userId === req.user.id);

        if (userIdReviewIndex === -1) {
            return res.status(204).send(false);
        };

        // Changes the rating and message of the specific review without letting the user change the userId and showReview
        review.reviews[userIdReviewIndex].rating = rating;
        review.reviews[userIdReviewIndex].message = message;

        await review.save();

        return res.status(200).send(review.reviews[userIdReviewIndex]);
    } catch (error) {
        console.error(`Error: ${error}`);
        return res.status(500).send('Internal Server Error');
    };
};

  // [SECTION - STRECTH - Ratings] Admin reviews rating and sets showReview to true
export async function reviewRating(req,res) {
    const { userId, showReview } = req.body
    try {
        const review = await Review.findOne({productId: req.params.productId})
        if (!review) {
        return res.status(404).json({
            error: 'review not found',
            message: 'There is no review registered with that id'
        });
        };

        const userIdReviewIndex = review.reviews.findIndex(review => review.userId === userId);

        if (userIdReviewIndex === -1) {
        return res.status(204).send(false);
        };

        // Admin updates the specific review if it will Show the review or not by setting showReview as true or false
        review.reviews[userIdReviewIndex].showReview = showReview;

        await review.save();

        return res.status(200).send(review.reviews[userIdReviewIndex]);
    } catch (error) {
        console.error(`Error: ${error}`);
        return res.status(500).send('Internal Server Error');
    };
};

// [SECTION - STRECTH - Ratings] Admin GETS ALL PRODUCTS REVIEWS
export async function getAllReviews(req,res) {
    try {
        const allReviews = await Review.find({})
    
        return res.status(200).send(allReviews)
    } catch (error) {
        console.error(`Error: ${error}`);
        return res.status(500).send('Internal Server Error');
    };
};