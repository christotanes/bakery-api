console.log("Hello world from routes/user.js");
import express from 'express';
import getAllUsers from '../controllers/user.js';
import { registerUser, login, getProfile, userCheckout, setAdmin, getOrders } from '../controllers/user.js';
import {verify, verifyAdmin} from '../auth.js'

const router = express.Router();

router.get("/", verify, verifyAdmin, getAllUsers)
router.post("/register", registerUser);
router.post("/login", login);
router.get("/profile", verify, getProfile);
router.patch("/checkout", verify, userCheckout);
router.put("/updateProfile");
router.patch("/setAdmin", verify, verifyAdmin, setAdmin);
router.get("/orders", verify, getOrders)

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