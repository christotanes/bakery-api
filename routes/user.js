console.log("Hello world from routes/user.js");
import express from 'express';
import { getAllUsers, registerUser, login, getProfile, updateProfile, changePassword, viewCart, addProductToCart, editCart, userCheckout, getUserOrders, setAsAdmin, getFeedback, addFeedback, editFeedback, showFeedback, getAllFeedback  } from '../controllers/user.js';
import {verify, verifyAdmin} from '../auth.js'

const router = express.Router();

router.get("/", verify, verifyAdmin, getAllUsers)
router.post("/register", registerUser);
router.post("/login", login);

router.route("/cart")
    .get(verify, viewCart)
    .post(verify, addProductToCart)
    .patch(verify, editCart);

router.post("/checkout", verify, userCheckout);
router.get("/myOrders", verify, getUserOrders);

router.route("/feedback")
    .get(verify, getFeedback)
    .post(verify, addFeedback)
    .put(verify, editFeedback)
    .patch(verify, verifyAdmin, showFeedback);

router.get("/feedback/all", verify, verifyAdmin, getAllFeedback);

router.get("/:id/userDetails", verify, getProfile);
router.patch("/:id/setAsAdmin", verify, verifyAdmin, setAsAdmin);

// .get(verify, getProfile)
router.route("/:id")
    .put(verify, updateProfile)
    .patch(verify, changePassword);



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