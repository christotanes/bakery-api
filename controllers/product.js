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
    console.log(`Error: ${error}`);
    return res.status(500).send('Internal Server Error');
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
        console.log(`Error: ${error}`);
        return res.status(500).send('Internal Server Error');
      }
    }

// [SECTION] Retrieve all ACTIVE products
export async function activeProducts(req, res){
  try{
    const activeProducts = await Product.find({ isActive: true});

    if(!activeProducts.length){
      return res.status(404).json({
        error: 'Not found',
        message: 'There are no products available as of this moment.'
      });
    }
    
    return res.status(200).json(activeProducts);
  } catch (error) {
      console.log(`Error: ${error}`);
      return res.status(500).send('Internal Server Error');
  }
}

// [SECTION] Retrieve a SINGLE product
export async function getProductById(req, res){
  console.log(req.params)
  try{
    const singleProduct = await Product.findById(req.params.id)
    // console.log(`singleProduct value: ${singleProduct}`)
    if(!singleProduct){
      return res.status(404).json({
        error: 'Not found',
        message: 'We do not have that product you are looking for'
      });
    } else if (singleProduct.isActive == false){
      return res.send('That product is currently unavailable right now');
    }
    
    return res.status(200).send(singleProduct);
  } catch (error) {
    console.log(`Error: ${error}`);
    return res.status(500).send('Internal Server Error')
  }
}

// [SECTION - ADMIN] Update Product
export async function updateProduct(req,res){
  const { name, description, type, size, quantity, price, allergens, weight, deliveryAvailable, flavors, bestBefore, vegetarian, featured} = req.body;
  const productId = req.body.id;

  try{
      const productToUpdate = await Product.findById(productId)

      if (!productToUpdate) {
        return res.status(404).json({
          error: 'Not found',
          message: 'There is no product of that information'
        });
      };

      productToUpdate.name = name || productToUpdate.name;
      productToUpdate.description = description || productToUpdate.description;
      productToUpdate.type = type || productToUpdate.type;
      productToUpdate.size = size || productToUpdate.size;
      productToUpdate.quantity = quantity || productToUpdate.quantity;
      productToUpdate.price = price || productToUpdate.price;
      productToUpdate.allergens = allergens || productToUpdate.allergens;
      productToUpdate.weight = weight || productToUpdate.weight;
      productToUpdate.deliveryAvailable = deliveryAvailable || productToUpdate.deliveryAvailable;
      productToUpdate.flavors = flavors || productToUpdate.flavors;
      productToUpdate.bestBefore = bestBefore || productToUpdate.bestBefore;
      productToUpdate.vegetarian = vegetarian || productToUpdate.vegetarian;
      productToUpdate.featured = featured || productToUpdate.featured;

      await productToUpdate.save()
      
      return res.status(200).json({
        message: 'Product was successfully updated!',
        product: productToUpdate,
    });
  } catch(error) {
    console.log(`Error: ${error}`);
    return res.status(500).send('Internal Server Error');
  }
}


export default getAllProducts;

// // [SECTION] Dependencies & Modules
// const TaskName = require('../models/model');
// const bcrypt = require('bcrypt');
// const auth = require('../auth');