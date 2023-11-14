console.log("Hello world from routes/user.js");
import express from 'express';
import { getAllUsers, registerUser, showRegisterPage, showLoginPage, login, getProfile, updateProfile, changePassword, viewCart, addProductToCart, editCart, userCheckout, getUserOrders, setAdmin, getAllOrders, getFeedback, addFeedback, editFeedback, showFeedback, getAllFeedback  } from '../controllers/user.js';
import {verify, verifyAdmin} from '../auth.js'

const router = express.Router();

router.get("/:id/userDetails", verify, getProfile);
router.patch("/:id/setAdmin", verify, verifyAdmin, setAdmin);
router.get("/feedback/all", verify, verifyAdmin, getAllFeedback);

// .get(verify, getProfile)
router.route("/:id")
    .put(verify, updateProfile)
    .patch(verify, changePassword);

router.route("/cart")
    .get(verify, viewCart)
    .post(verify, addProductToCart)
    .patch(verify, editCart);

router.post("/checkout", verify, userCheckout);
router.get("/myOrders", verify, getUserOrders);
router.get("/orders", verify, verifyAdmin, getAllOrders);

router.get("/", verify, verifyAdmin, getAllUsers);

router.route("/register")
    .get(showRegisterPage) //notneeded
    .post(registerUser);

router.route('/login')
    .get(showLoginPage) //notneeded
    .post(login);

router.route("/feedback")
    .get(verify, getFeedback)
    .post(verify, addFeedback)
    .put(verify, editFeedback)
    .patch(verify, verifyAdmin, showFeedback);


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