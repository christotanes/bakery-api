console.log("Hello world from routes/user.js");
import express from 'express';
import { getAllUsers, registerUser, login, getProfile, updateProfile, changePassword, viewCart, addProductToCart, editCart, userCheckout, getUserOrders, setAdmin  } from '../controllers/user.js';
import {verify, verifyAdmin} from '../auth.js'

const router = express.Router();

router.get("/:id/userDetails", verify, getProfile);
router.patch("/:id/setAdmin", verify, verifyAdmin, setAdmin);

router.route("/:id")
    .get(verify, getProfile)
    .put(verify, updateProfile)
    .patch(verify, changePassword);

router.route("/cart")
    .get(verify, viewCart)
    .post(verify, addProductToCart)
    .patch(verify, editCart);

router.post("/checkout", verify, userCheckout);
router.get("/myOrders", verify, getUserOrders);

router.get("/", verify, verifyAdmin, getAllUsers)
router.post("/register", registerUser);
router.post("/login", login);

// Keep the other routes at the end


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