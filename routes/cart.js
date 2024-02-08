import express from 'express';
import { viewCart, addProductToCart, editCart, userCheckout } from '../controllers/cart.js';
import { verify } from '../auth.js';

const router = express.Router();

router.route("/")
    .get(verify, viewCart)
    .post(verify, addProductToCart)
    .patch(verify, editCart);

router.post("/checkout", verify, userCheckout);

export default router;