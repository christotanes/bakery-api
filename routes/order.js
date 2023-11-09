console.log("Hello world from routes/order.js");
import express from 'express';
import { getAllOrders, getOrderById, updateOrder } from '../controllers/order.js';
import { verify, verifyAdmin } from '../auth.js';

const router = express.Router();

router.get("/", verify, verifyAdmin, getAllOrders);
router.get("/:orderId", verify, verifyAdmin, getOrderById);
router.put("/:orderId", verify, verifyAdmin, updateOrder)

export default router