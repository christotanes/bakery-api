console.log("Hello world from routes/user.js");
import express from 'express';
import { getAllUsers, registerUser, login, getProfile, userCheckout, updateProfile, setAdmin, getOrders, getAllOrders } from '../controllers/user.js';
import {verify, verifyAdmin} from '../auth.js'

const router = express.Router();

router.get("/", verify, verifyAdmin, getAllUsers)
router.post("/register", registerUser);
router.post("/login", login);
router.get("/profile", verify, getProfile);
router.patch("/checkout", verify, userCheckout);
router.put("/updateProfile", verify, updateProfile);
router.patch("/setAdmin", verify, verifyAdmin, setAdmin);
router.get("/orders", verify, getOrders);
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