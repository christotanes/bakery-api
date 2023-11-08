console.log("Hello world from routes/product.js");
import express from 'express';
import { getAllProducts, createProduct, activeProducts, getProductById, updateProduct, archiveProduct, activateProduct } from '../controllers/product.js';
import { verify, verifyAdmin } from '../auth.js';

const router = express.Router();

router.get("/", getAllProducts)
router.post("/createProduct", verify, verifyAdmin, createProduct);
router.get('/active', activeProducts);
router.get('/:id', getProductById);
router.put('/update', verify, verifyAdmin, updateProduct);
router.patch('/archive', verify, verifyAdmin, archiveProduct);
router.patch('/activate', verify, verifyAdmin, activateProduct);

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