console.log("Hello world from controllers/user.js");
import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
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
        if(!user){
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
    if (req.params.id !== req.user.id) {
        return res.status(401).json({error: 'Unauthorized - Incorrect token'});
    };
    try {
        const userProfile = await User.findById(req.user.id)
        if (!userProfile) {
          return res.status(404).json({
            error: 'Not found',
            message: 'There is no user with that information'
          });
        };
        return res.status(200).send(userProfile);
    } catch (error) {
        console.error(`Error: ${error}`);
        return res.status(500).send('Internal Server Error');
    }
}

// [SECTION - NOT INCLUDED] User updates profile
export async function updateProfile(req, res) {
    if (req.params.id !== req.user.id) {
        return res.status(401).json({error: 'Unauthorized - Incorrect token'});
    };
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
        return res.status(500).send('Internal Server Error');
    };
};

// [SECTION - ADDGOAL] Change password
export async function changePassword(req, res) {
    if (req.params.id !== req.user.id) {
        return res.status(401).json({ error: 'Unauthorized - Incorrect token' });
    };

    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                error: 'No file found',
                message: 'User password update failed'
            });
        };

        const checkNewPassword = bcrypt.compareSync(req.body.newPassword, user.password);
        if (checkNewPassword) {
            return res.status(401).json({ message: 'Please select a new password'});
        };

        if (req.body.newPassword !== req.body.confirmPassword) {
            return res.status(401).json({ message: 'Your new password and confirm password do not match'});
        };

        user.password = bcrypt.hashSync(req.body.newPassword, 10);
        await user.save();

        return res.status(200).json({ message: 'Password successfully changed' });
    } catch (error) {
        console.error(`Error: ${error}`);
        return res.status(500).send('Internal Server Error');
    };
};

// [SECTION - CART - ADDGOAL] User retrieves/views cart
export async function viewCart(req, res) {
    if (req.params.id !== req.user.id) {
        return res.status(401).json({error: 'Unauthorized - Incorrect token'});
    };
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                error: 'No file found',
                message: 'There is no user with that id'
            });
        };

        if (!user.cart || user.cart.products.length === 0) {
            return res.status(204).send('Your cart has no contents');
        };

        return res.status(200).json({
            message: "Here are the contents of your cart",
            cart: user.cart
        });
    } catch (error) {
        console.error(`Error: ${error}`);
        return res.status(500).send('Internal Server Error');
    };
};

// [SECTION - STRETCH - CART] Add to cart
export async function addProductToCart(req, res) {
    if (req.params.id !== req.user.id) {
        return res.status(401).json({error: 'Unauthorized - Incorrect token'});
    };
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
        return res.status(404).json({
            error: 'Not found',
            message: 'User not found'
            });
        };

        const { productId, price, quantity } = req.body;
        const newProduct = {
            productId,
            price,
            quantity,
            subTotal: price * quantity
        };
    
        // Check if the product already exists in the cart
        const existingProductIndex = user.cart.products.findIndex(
        (product) => product.productId === newProduct.productId
        );

        if (existingProductIndex !== -1) {
        // If the product exists, update its quantity and subTotal
            user.cart.products[existingProductIndex].quantity += newProduct.quantity;
            user.cart.products[existingProductIndex].subTotal += newProduct.subTotal;
        } else {
        // If the product is new, add it to the cart
            user.cart.products.push(newProduct);
        };

        // Recalculate total amount based on the updated cart
        const totalAmount = user.cart.products.reduce((total, product) => total + product.subTotal, 0);

        // Update totalAmount in the cart
        user.cart.totalAmount = totalAmount;

        await user.save();

        return res.status(200).json({
        message: 'Product added to the cart successfully!',
        cart: user.cart
        });
    } catch (error) {
        console.error(`Error: ${error}`);
        return res.status(500).send('Internal Server Error');
    };
};

// [SECTION - STRETCH - CART] Change product quantities and CAN REMOVE PRODUCTS just have to set input button when user clicks remove set Quantity in req.body.quantity to be 0
export async function editCart(req, res) {
    if (req.params.id !== req.user.id) {
        return res.status(401).json({error: 'Unauthorized - Incorrect token'});
    };
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({
          error: 'Not found',
          message: 'User not found',
        });
      };
  
      const { productId, quantity } = req.body;
  
      // Check if the product exists in the cart
      const existingProductIndex = user.cart.products.findIndex(
        (product) => product.productId === productId
      );
  
      if (existingProductIndex !== -1) {
        if (quantity === 0) {
          // If quantity is 0, remove the product from the cart
          user.cart.products.splice(existingProductIndex, 1);
        } else {
          // If the product exists, update its quantity and recalculate the subtotal
          user.cart.products[existingProductIndex].quantity = quantity;
          user.cart.products[existingProductIndex].subTotal = user.cart.products[existingProductIndex].price * quantity;
        }
      } else {
        return res.status(404).json({
          error: 'Not found',
          message: 'Product not found in the cart',
        });
      }
  
      // Recalculate total amount based on the updated cart
      const totalAmount = user.cart.products.reduce(
        (total, product) => total + product.subTotal,
        0
      );
  
      // Update totalAmount in the cart
      user.cart.totalAmount = totalAmount;
  
      await user.save();
  
      return res.status(200).json({
        message: 'Product quantity updated successfully!',
        cart: user.cart,
      });
    } catch (error) {
      console.error(`Error: ${error}`);
      return res.status(500).send('Internal Server Error');
    }
}

// [SECTION] User checkout with Cart added
export async function userCheckout(req, res) {
    if (req.params.id !== req.user.id) {
        return res.status(401).json({error: 'Unauthorized - Incorrect token'});
    };
    try {
    // Find user
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
            error: 'Not found',
            message: 'There is no user with that information'
            });
        };

        // Prepare purchased items
        const itemsInCart = user.cart.products.map(product => ({
            productId: product.productId,
            quantity: product.quantity
        }));

        // Create an order
        const newOrder = new Order({
            userId: req.user.id,
            products: itemsInCart,
            totalAmount: user.cart.totalAmount,
            paymentInfo: req.body.paymentInfo,
            orderStatus: 'pending'
        });

        // Save the order
        const savedOrder = await newOrder.save();

        // Update product quantities in MongoDB
        for (const item of itemsInCart) {
            const product = await Product.findById(item.productId);
            if (product) {
                // Decrease the quantity in the MongoDB
                product.quantity -= item.quantity;
                await product.save();
            };
        };

        // Clear user's cart
        user.cart = {
            products: [],
            totalAmount: 0
        };

        await user.save();

        return res.status(200).json({
            message: 'You have successfully purchased these products!',
            purchasedInfo: itemsInCart,
            orderInfo: savedOrder
    });
    } catch (error) {
        console.error(`Error: ${error}`);
        return res.status(500).send('Internal Server Error');
    };
};

// [SECTION - STRETCH] Retrieve user's orders
export async function getOrders(req, res) {
    if (req.params.id !== req.user.id) {
        return res.status(401).json({error: 'Unauthorized - Incorrect token'});
    };
    try {
        const userOrders = await Order.find({userId: req.user.id});
        if (!userOrders) {
            return res.status(204).json({
                error: 'No User id found',
                message: 'User has no past or current orders'
            });
        };

        return res.status(200).json({
            message: "These are the user's past orders",
            orders: userOrders
        });
    } catch (error) {
        console.error(`Error: ${error}`);
        return res.status(500).send('Internal Server Error');
    };
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
        return res.status(500).send('Internal Server Error');
    };
};

export default getAllUsers;