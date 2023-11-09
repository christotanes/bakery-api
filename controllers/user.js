console.log("Hello world from controllers/user.js");
import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import Product from '../models/Product.js';
import { createAccessToken } from '../auth.js';
// import cheerio from 'cheerio';
// import axios from 'axios';

// [SECTION] Admin GETS all users
export async function getAllUsers (req, res){
    try{
        const allUsers = await User.find();
        if(allUsers == null){
            return ('No users registered')
        }

        return res.status(200).send(allUsers);   

    } catch (error) {
        console.log(`Error: ${error}`);
        return res.status(500).send('Internal Server Error');
    }
}

// [SECTION] Register New User
// export async function registerUser(req, res){
//     console.log(req.body)
//     try {
//         const emailExists = await User.findOne({ email: req.body.email });
//         if (emailExists) {
//                 return res.status(409).json({
//                     error: 'Conflict',
//                     message: 'Email has already been used or registered.'
//                 })
//             } else {
//                 const newUser = new User({
//                     email: req.body.email,
//                     password: bcrypt.hashSync(req.body.password, 10),
//                 });
            
//                 const savedUser = await newUser.save();

//                 return res.status(201).json({
//                   message: 'User was successfully registered!',
//                   product: savedUser,
//                 });
//             }
//         } catch (error) {
//             console.error('Error:', error);
//             res.status(500).send('Internal Server Error');
//         }
//     }
export async function registerUser(req, res) {
    const newUser = new User({
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10),
    });
  
    try {
      const savedUser = await newUser.save();
  
      return res.status(201).json({
        message: 'User was successfully registered!',
        user: savedUser,
      });
    } catch (saveError) {
      if (saveError.name === 'MongoError' && saveError.code === 11000) {
        // Unique constraint violation (duplicate email)
        return res.status(409).json({
          error: 'Conflict',
          message: 'Email has already been used or registered.',
        });
      }
  
      console.error(`Error during user save: ${saveError}`);
      return res.status(500).send('Internal Server Error');
    }
  }

// [SECTION] User Logins
export async function login(req, res){
    try{
        const user = await User.findOne({ email: req.body.email});
        // console.log(user)
        if(user == null){
            return res.status(404).json({error: 'There is no account registered under this email'});
        } else {
            const isPasswordCorrect = bcrypt.compareSync(req.body.password, user.password);

            if(isPasswordCorrect){
                return res.status(201).send({ access: createAccessToken(user) });
            } else {
                return res.status(401).json({ error: 'Unauthorized - Incorrect password'});
            }
        }
    } catch (error) {
        console.log(`Error: ${error}`);
        return res.status(500).send('Internal Server Error');
    }
}

// [SECTION] User retrieves profile details
export async function getProfile(req, res){
    try {
        const userProfile = await User.findById(userId)
        if (!userProfile) {
          return res.status(404).json({
            error: 'Not found',
            message: 'There is no user with that information'
          });
        }; 
        return res.status(200).send(userProfile);
    } catch (error) {
        console.error(`Error: ${error}`);
        return res.status(500).send('Server Internal Error');
    }
}

// [SECTION] User checkout with Cart added
export async function userCheckout(req, res) {
    const userId = req.user.id;
  
    try {
      // Find user
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          error: 'Not found',
          message: 'There is no user with that information'
        });
      }
  
      // Prepare purchased items
      const purchasedItems = req.body.products.map(product => ({
        productId: product.productId,
        productName: product.productName,
        quantity: product.quantity
      }));
  
      // Update user's purchased products
      user.orderedProducts.push({
        products: purchasedItems, 
        paymentInfo: req.body.paymentInfo,
        totalAmount: req.body.totalAmount
      });
  
      // Filter out checked out items from the user's cart
      user.cart = user.cart.filter(cartItem => !purchasedItems.some(purchasedItem => purchasedItem.productId === cartItem.productId));
  
      await user.save();
  
      // Find and update the purchased products
      const productIds = purchasedItems.map(item => item.productId);
      const products = await Product.updateMany(
        { _id: { $in: productIds } },
        {
          $push: {
            userOrders: {
              userId,
              orderId: user.orderedProducts[user.orderedProducts.length - 1].id
            }
          }
        },
        { new: true }
      );
  
      if (!products || products.some(product => !product)) {
        return res.status(404).json({
          error: 'Not found',
          message: 'One or more products do not exist'
        });
      }
  
      return res.status(200).json({
        message: 'You have successfully purchased these products!',
        purchasedInfo: user.orderedProducts,
        productInfoUpdate: products.map(product => product.userOrders)
      });
    } catch (error) {
      console.error(`Error: ${error}`);
      return res.status(500).send('Server Internal Error');
    }
  };
  

// [SECTION - ADMIN - STRETCH] Set User as Admin
export async function setAdmin(req, res) {
    try {
        const userToAdmin = await User.findById(req.body.id);
        if (!userToAdmin) {
            return res.status(404).json({
                error: 'No user found',
                message: 'There is no user registered with that information'
            });
        };

        if (userToAdmin.isAdmin === true) {
            return res.status(200).json({
                message: 'User is already an admin',
                user: userToAdmin
            });
        };

        const setUserAdmin = await User.findByIdAndUpdate(
            req.body.id, 
            { isAdmin: true}, 
            {new: true});
        
        return res.status(200).json({
            message: 'User has been set as an admin',
            user: setUserAdmin
        });
    } catch (error) {
        console.error(`Error: ${error}`);
        return res.status(500).send('Server Internal Error');
    };
};

// [SECTION - STRETCH] Retrieve user's orders
export async function getOrders(req, res) {
    try {
        const userOrders = await User.findById(req.user.id);

        if (!userOrders) {
            return res.status(404).json({
                error: 'No user found',
                message: 'There is no user registered with that information'
            });
        };

        if (userOrders.orderedProducts.length === 0) {
            return res.status(204).json({
                error: 'No orders found',
                message: 'User has not ordered any products yet'
            });
        };

        return res.status(200).json({
            message: "These are the user's past orders",
            orders: userOrders.orderedProducts
        });
    } catch (error) {
        console.error(`Error: ${error}`);
        return res.status(500).send('Server Internal Error');
    };
};

// [SECTION - NOT INCLUDED] User updates profile
export async function updateProfile(req, res) {
    const {id, isAdmin, password, orderedProducts, ...updates} = req.body
    try {
        const userProfile = await User.findByIdAndUpdate(req.user.id, updates, {new: true});

        if (!userProfile) {
            return res.status(404).json({
                error: 'No user found',
                message: 'User profile update failed'
            });
        };

        return res.status(200).json({
            message: "User profile successfully updated",
            userProfile: userProfile
        });
    } catch (error) {
        console.error(`Error: ${error}`);
        return res.status(500).send('Server Internal Error');
    };
};

// [SECTION - ADMIN - STRETCH] Retrieve all orders
export async function getAllOrders(req, res) {
    try {
        
    } catch (error) {
        
    }
}
export default getAllUsers;