console.log("Hello world from routes/order.js");
import express from 'express';
import { getOrderById, updateOrder, getAllOrders } from '../controllers/order.js';
import { verify, verifyAdmin } from '../auth.js';

const router = express.Router();

// STRECTH GOALS /orders/ route
router.get("/all", verify, verifyAdmin, getAllOrders);

router.route('/:orderId')
        .get(verify, verifyAdmin, getOrderById)
        .patch(verify, verifyAdmin, updateOrder)

export default router