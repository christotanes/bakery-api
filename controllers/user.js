console.log("Hello world from controllers/user.js");
import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
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
        product: savedUser,
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
        return res.status(500).send('Server Internal Error');
    }
}

// [SECTION] User checkout 
export async function userCheckout(req, res) {
    const {...ordered} = req.body
    try {
        const userPurchased = await User.findByIdAndUpdate(req.user.id, ordered, { new: true });

        if (!userPurchased) {
            return res.status(404).json({
              error: 'Not found',
              message: 'There is no user with that information'
            });
          };
        
        return res.status(200).json({
            message: 'You have successfully purchased these products!',
            user: userPurchased
        });
    } catch (error) {
        console.error(`Error: ${error}`);
        return res.status(500).send('Server Internal Error');
    };
};


export default getAllUsers;