console.log("Hello world from routes/product.js");
import express from 'express';
import { getAllProducts, createProduct, activeProducts, getProductById, updateProduct, archiveProduct, activateProduct, getAllProductReviews, userAddReview, userEditReview, reviewRating, getAllReviews } from '../controllers/product.js';
import { verify, verifyAdmin } from '../auth.js';

const router = express.Router();

router.put('/:productId/archive', verify, verifyAdmin, archiveProduct);
router.put('/:productId/activate', verify, verifyAdmin, activateProduct);
router.route('/:productId/reviews')
        .get(verify, verifyAdmin, getAllProductReviews)
        .post(verify, userAddReview)
        .put(verify, userEditReview)
        .patch(verify, verifyAdmin, reviewRating)

router.route('/:productId')
        .get(getProductById)
        .put(verify, verifyAdmin, updateProduct);

router.get("/", getAllProducts)
router.post("/createProduct", verify, verifyAdmin, createProduct);
router.get('/active', verify, verifyAdmin, activeProducts);
router.get('/allReviews', verify, verifyAdmin, getAllReviews);

export default router

// [SECTION] Dependencies & Modules
// const express = require('express');
// const functionName = require('../controllers/controller');
// // [SECTION] Routing Component
// const router = express.Router();

// const auth = require("../auth");
// const { verify, verifyAdmin } = auth;
// // [SECTION] Expert Route System
// module.exports = router;