console.log("Hello world from routes.js");
import express from 'express';
// import functionName from '../controller/controller.js';
// import { anotherFunction } from '../controller/controller.js';

const router = express.Router();

router.get("/", functionName);

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