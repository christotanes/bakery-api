console.log("Hello world from routes/user.js");
import express from 'express';
import { getAllUsers, registerUser, login, getProfile, userCheckout, updateProfile, addProductToCart, editProduct, setAdmin, getOrders, getAllOrders } from '../controllers/user.js';
import {verify, verifyAdmin} from '../auth.js'

const router = express.Router();

router.get("/", verify, verifyAdmin, getAllUsers)
router.post("/register", registerUser);
router.post("/login", login);
router.get("/:id", verify, getProfile);
router.put("/:id", verify, updateProfile);
router.put("/:id/cart/add", verify, addProductToCart)
router.patch("/:id/cart/edit", verify, editProduct);

router.post("/:id/checkout", verify, userCheckout);
router.get("/:id/orders", verify, getOrders);

router.patch("/setAdmin", verify, verifyAdmin, setAdmin);
router.get("/allOrders", verify, verifyAdmin, getAllOrders);

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