console.log("Hello world from controllers/product.js");
import express from 'express';
import Product from '../models/Product.js';
// import bcrypt from 'bcrypt';
// import cheerio from 'cheerio';
// import axios from 'axios';
// import auth from '../auth.js';

// [SECTION] Get All Products
export async function getAllProducts(req, res) {
  try {
    const allProducts = await Product.find({});

    if (!allProducts.length) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'No products found',
      });
    }

    return res.status(200).json(allProducts);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
}

// [SECTION - ADMIN] Create Product
export async function createProduct (req, res){
    console.log(req.body)
    try {
        const productExists = await Product.findOne({ name: req.body.name });
        if (productExists) {
            return res.status(409).json({
              error: 'Conflict',
              message: 'Product Name has already been used or registered.',
            });
          } else {
            const newProduct = new Product({
                name: req.body.name,
                description: req.body.description,
                type: req.body.type,
                size: req.body.size,
                quantity: req.body.quantity,
                price: req.body.price
            });
    
            const savedProduct = await newProduct.save();

            return res.status(201).json({
                message: 'Product was successfully created!',
                product: savedProduct,
            });
        }
      } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
      }
    }

// [SECTION]
export default getAllProducts;

// // [SECTION] Dependencies & Modules
// const TaskName = require('../models/model');
// const bcrypt = require('bcrypt');
// const auth = require('../auth');