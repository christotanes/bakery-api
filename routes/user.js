console.log("Hello world from routes/user.js");
import express from 'express';
import { getAllUsers, registerUser, login, getProfile, updateProfile, changePassword, getUserOrders, setAsAdmin } from '../controllers/user.js';
import {verify, verifyAdmin} from '../auth.js'

const router = express.Router();

router.get("/", verify, verifyAdmin, getAllUsers)
router.post("/register", registerUser);
router.post("/login", login);

router.get("/myOrders", verify, getUserOrders);

router.get("/details", verify, getProfile);
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