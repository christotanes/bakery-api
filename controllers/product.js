console.log("Hello world from controllers/product.js");
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Review from '../models/Review.js';

// import bcrypt from 'bcrypt';
// import cheerio from 'cheerio';
// import axios from 'axios';
// import auth from '../auth.js';

// [SECTION] Get All Products
export async function getAllProducts(req, res) {
  console.log('This is getAllProducts function');
  try {
      const allProducts = await Product.find({});

      if (!allProducts.length) {
        return res.status(404).json({
          error: 'Not Found',
          message: 'No products found'
        });
      }

    return res.render('index.ejs', {
      message: 'These are all the products',
      allProducts: allProducts
    });
  } catch (error) {
    console.log(`Error: ${error}`);
    return res.status(500).send('Internal Server Error');
  }
}

// [SECTION - ADMIN] Create Product
export async function createProduct (req, res){
    console.log('This is createProduct function');
    console.log(req.body)
    try {
        const productExists = await Product.findOne({ name: req.body.name });
        if (productExists) {
            return res.status(409).json({
              error: 'Conflict',
              message: 'Product Name has already been used or registered.'
            });
          } else {
            const newProduct = new Product({
                name: req.body.name,
                description: req.body.description,
                type: req.body.type,
                size: req.body.size,
                quantity: req.body.quantity,
                price: req.body.price,
                allergens: req.body.allergens,
                weight: req.body.weight,
                deliveryAvailable: req.body.deliveryAvailable,
                flavors: req.body.flavors,
                bestBefore: req.body.bestBefore,
                vegetarian: req.body.vegetarian,
                img: req.body.img
            });
    
            const savedProduct = await newProduct.save();

            return res.status(201).json({
                message: 'Product is successfully created!',
                product: savedProduct
            });
        }
      } catch (error) {
        console.log(`Error: ${error}`);
        return res.status(500).send('Internal Server Error');
      }
    }

// [SECTION] Retrieve all ACTIVE products
export async function activeProducts(req, res){
  console.log('This is activeProducts function');
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
  console.log('This is getProductById function');
  console.log(req.params);
  try{
    const singleProduct = await Product.findById(req.params.productId)
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
export async function updateProduct(req, res) {
  console.log('This is updateProduct function');
  const { productId, isActive, ...updates } = req.body;

  try {
    const productToUpdate = await Product.findByIdAndUpdate(req.params.productId, updates, { new: true });

    if (!productToUpdate) {
      return res.status(404).json({
        error: 'Not found',
        message: 'There is no product with that information'
      });
    };

    return res.status(200).json({
      message: 'Product is successfully updated!',
      product: productToUpdate
    });
  } catch (error) {
    console.log(`Error: ${error}`);
    return res.status(500).send('Internal Server Error');
  };
}

// [SECTION - ADMIN] Archive Product
export async function archiveProduct(req, res) {
  console.log('This is archiveProduct function');
  try {
    const productToArchive = await Product.findById(req.params.productId);

    if (!productToArchive) {
      return res.status(404).json({
        error: 'Not found',
        message: 'There is no product with that information'
      });
    }

    if (productToArchive.isActive === false) {
      return res.status(200).json({
        message: 'Product is already archived',
        product: productToArchive
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.productId,
      { isActive: false },
      { new: true }
    );

    return res.status(200).json({
      message: 'Product is successfully archived!',
      product: updatedProduct
    });
  } catch (error) {
    console.log(`Error: ${error}`);
    return res.status(500).send('Internal Server Error');
  }
}

// [SECTION - ADMIN] Activate Product
export async function activateProduct(req, res) {
  console.log('This is activateProduct function');
  try {
    const productToActivate = await Product.findById(req.params.productId);

    if (!productToActivate) {
      return res.status(404).json({
        error: 'Not found',
        message: 'There is no product with that information'
      });
    }

    if (productToActivate.isActive === true) {
      return res.status(200).json({
        message: 'Product is already activated',
        product: productToActivate
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.productId,
      { isActive: true },
      { new: true }
    );

    return res.status(200).json({
      message: 'Product is successfully activated!',
      product: updatedProduct
    });
  } catch (error) {
    console.error(`Error: ${error}`);
    return res.status(500).send('Internal Server Error');
  }
}

// [SECTION - STRECTH - Ratings] Admin gets ProductId's Specific Reviews
export async function getAllProductReviews(req,res) {
  console.log('This is getAllProductReviews function');
  try {
    const allReviews = await Review.findById(req.params.productId)
    if (!allReviews) {
      return res.status(404).json({
        error: 'Review not found',
        message: 'There are no reviews for that productId'
      });
    };
    
    if (allReviews.reviews.length === 0) {
      return res.status(204).json({ message: "Product has not been reviewed yet" });
    };

    return res.status(200).json({
      message: "These are this product's reviews",
      reviews: allReviews.reviews
    });
  } catch (error) {
    console.error(`Error: ${error}`);
    return res.status(500).send('Internal Server Error');
  };
};

// [SECTION - STRECTH - Ratings] User add's review
export async function userAddReview(req,res) {
  console.log('This is userAddReview function');
  try {
    const userBoughtProduct = await Order.find({ userId: req.user.id });
    if (userBoughtProduct.length === 0) { //Need to refactor condition as it only checks UserId in Order.js needs to check if the products bought was same productId
      console.log(`Status 404 user has not bought product`)
      return res.status(404).json({
        error: 'User not found in orders',
        message: "User has not bought this product"
      });
    };

    const product = await Product.findById(req.params.productId)
    if (!product) {
      return res.status(404).json({
        error: 'Product not found',
        message: 'There is no product registered with that id'
      });
    };

    // Check if the user has already posted a review for this product
    const existingReview = await Review.findById(req.params.productId);
    existingReview.reviews.forEach(review => {
      if (req.user.id !== userId){
        return res.status(400).json({
          error: 'Review already exists',
          message: 'User has already posted a review for this product'
        });
      }
    });

    let userReview = {
      userId: req.user.id,
      rating: req.body.rating,
      message: req.body.message
    };

    existingReview.productId = product.productId;
    existingReview.review.push(userReview);
    await existingReview.save();

    return res.status(200).json({
      message: "Review has been successfully added, moderators will verify the message first",
      userReview: product.reviews
    });
  } catch (error) {
    console.error(`Error: ${error}`);
    return res.status(500).send('Internal Server Error');
  };
};

// [SECTION - STRECTH - Ratings] User edit's review
export async function userEditReview(req,res) {
  console.log('This is userEditReview function');
  const { userId, showReview, rating, message } = req.body;
  try {
    const review = await Review.findById(req.params.productId)
    if (!review) {
      return res.status(404).json({
        error: 'review not found',
        message: 'There is no review registered with that id'
      });
    };

    const userIdReviewIndex = Review.reviews.findIndex(review => review.userId === req.user.id);
    console.log('User review found at index:', userIdReviewIndex);

    if (userIdReviewIndex === -1) {
      console.log('No user review found');
      return res.status(204).json({ message: "Product has not been reviewed by the user yet" });
    };

    // Changes the rating and message of the specific review without letting the user change the userId and showReview
    review.reviews[userIdReviewIndex].rating = rating;
    review.reviews[userIdReviewIndex].message = message;

    await review.save();

    return res.status(200).json({
      message: "Review has been successfully edited, moderators will verify the edited message first",
      userReview: review.reviews[userIdReviewIndex]
    });
  } catch (error) {
    console.error(`Error: ${error}`);
    return res.status(500).send('Internal Server Error');
  };
};

// [SECTION - STRECTH - Ratings] Admin reviews rating and sets showReview to true
export async function reviewRating(req,res) {
  console.log('This is reviewRating function');
  const { userId, showReview } = req.body
  try {
    const review = await Review.findById(req.params.productId)
    if (!review) {
      return res.status(404).json({
        error: 'review not found',
        message: 'There is no review registered with that id'
      });
    };

    const userIdReviewIndex = review.reviews.findIndex(review => review.userId === userId);
    console.log('User review found at index:', userIdReviewIndex);

    if (userIdReviewIndex === -1) {
      console.log('No user review found');
      return res.status(204).json({ message: "Product has not been reviewed by the user yet" });
    };

    // Extra validation if the user input is boolean
    if (typeof showReview !== 'boolean') {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Invalid value for showReview. Please provide a boolean.',
      });
    };

    // Admin updates the specific review if it will Show the review or not by setting showReview as true or false
    review.reviews[userIdReviewIndex].showReview = showReview;

    await review.save();

    return res.status(200).json({
      message: "You have successfully reviewed the message and the review will now show",
      userReview: review.reviews[userIdReviewIndex]
    });
  } catch (error) {
    console.error(`Error: ${error}`);
    return res.status(500).send('Internal Server Error');
  };
};

// [SECTION - STRECTH - Ratings] Admin GETS ALL PRODUCTS REVIEWS
export async function getAllReviews(req,res) {
  console.log('This is getAllReviews function');
  try {
    const allReviews = await Review.find({})

    return res.status(200).json({
      message: "These are all the reviews for all the products",
      allReviews: allReviews
    })
  } catch (error) {
    console.error(`Error: ${error}`);
    return res.status(500).send('Internal Server Error');
  };
};

// [SECTION - Reviews for specific productId]

export default getAllProducts;

// // [SECTION] Dependencies & Modules
// const TaskName = require('../models/model');
// const bcrypt = require('bcrypt');
// const auth = require('../auth');