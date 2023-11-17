console.log("Hello world from routes/product.js");
import express from 'express';
import { getAllProducts, createProduct, activeProducts, getProductById, updateProduct, archiveProduct, activateProduct, getAllProductReviews, userAddReview, userEditReview, reviewRating, getAllReviews, searchProducts } from '../controllers/product.js';
import { verify, verifyAdmin } from '../auth.js';

const router = express.Router();

router.route('/')
        .get(verify, verifyAdmin, activeProducts)
        .post(verify, verifyAdmin, createProduct)

router.get("/all", getAllProducts)
router.get('/allReviews', verify, verifyAdmin, getAllReviews);

router.get("/search", searchProducts);

router.route('/:productId')
        .get(getProductById)
        .put(verify, verifyAdmin, updateProduct);

router.put('/:productId/archive', verify, verifyAdmin, archiveProduct);
router.put('/:productId/activate', verify, verifyAdmin, activateProduct);

router.route('/:productId/reviews')
        .get(verify, verifyAdmin, getAllProductReviews)
        .post(verify, userAddReview)
        .put(verify, userEditReview)
        .patch(verify, verifyAdmin, reviewRating)




export default router