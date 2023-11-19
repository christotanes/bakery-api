console.log("Hello world from routes/product.js");
import express from 'express';
import { getAllProducts, createProduct, activeProducts, getProductById, updateProduct, archiveProduct, activateProduct, searchProducts } from '../controllers/product.js';
import { verify, verifyAdmin } from '../auth.js';

const router = express.Router();

router.route('/')
        .get(verify, verifyAdmin, getAllProducts)
        .post(verify, verifyAdmin, createProduct)

router.get("/active", activeProducts)

router.get("/search", searchProducts);

router.route('/:productId')
        .get(getProductById)
        .put(verify, verifyAdmin, updateProduct);

router.put('/:productId/archive', verify, verifyAdmin, archiveProduct);
router.put('/:productId/activate', verify, verifyAdmin, activateProduct);

export default router