import bcrypt from 'bcrypt';
import User from '../models/User.js';
import Order from '../models/Order.js';
import { createAccessToken } from '../auth.js';
// import cheerio from 'cheerio';
// import axios from 'axios';

// [SECTION] Admin GETS all users
export async function getAllUsers (req, res){
    try{
        const allUsers = await User.find({}, { password: 0 });
        if(allUsers == null){
            return ('No users registered')
        };
        // Will loop on allUsers hiding their passwords
        for(let user of allUsers){
            user.password = "";
        };
        return res.status(200).send(allUsers);   

    } catch (error) {
        return res.status(500).send('Internal Server Error');
    }
};

// [SECTION] Register New User
export async function registerUser(req, res) {
    const newUser = new User({
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
    });

    try {
        const savedUser = await newUser.save();

        return res.status(201).send(savedUser);
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
    };
};

// [SECTION] User Logins
export async function login(req, res){
    try{
        const user = await User.findOne({ email: req.body.email});
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
        return res.status(500).send('Internal Server Error');
    }
}

// [SECTION] User retrieves profile details
export async function getProfile(req, res){
    try {
        const userProfile = await User.findById(req.user.id, {password: 0})
        if (!userProfile) {
            return res.status(404).json({
                error: 'Not found',
                message: 'There is no user with that information'
            });
        } else {
            userProfile.password = "";
            return res.status(200).send(userProfile);
        }
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
    const {id, isAdmin, password, ...updates} = req.body
    try {
        const userProfile = await User.findByIdAndUpdate(req.user.id, updates, {new: true});

        if (!userProfile) {
            return res.status(404).json({
                error: 'No user found',
                message: 'User profile update failed'
            });
        } else {
        userProfile.password = "";
        return res.status(200).send(userProfile);
    }
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

        const checkNewPassword = bcrypt.compareSync(req.body.password, user.password);
        if (checkNewPassword) {
            return res.status(401).json({ message: 'Please select a new password'});
        };

        if (req.body.password !== req.body.confirmPassword) {
            return res.status(401).json({ message: 'Your new password and confirm password do not match'});
        };

        user.password = bcrypt.hashSync(req.body.password, 10);
        await user.save();

        return res.status(200).send(true);
    } catch (error) {
        console.error(`Error: ${error}`);
        return res.status(500).send('Internal Server Error');
    };
};

// [SECTION - STRETCH] Retrieve user's orders
export async function getUserOrders(req, res) {
    try {
        const userOrders = await Order.find({userId: req.user.id});
        if (!userOrders) {
            return res.status(204).json({
                error: 'No User id found',
                message: 'User has no past or current orders'
            });
        };

        return res.status(200).send(userOrders);
    } catch (error) {
        console.error(`Error: ${error}`);
        return res.status(500).send('Internal Server Error');
    };
};

// [SECTION - ADMIN - STRETCH] Set User as Admin
export async function setAsAdmin(req, res) {
    try {
        const userToAdmin = await User.findById(req.params.id);
        if (!userToAdmin) {
            return res.status(404).json({
                error: 'No user found',
                message: 'There is no user registered with that information'
            });
        };

        if (userToAdmin.isAdmin === true) {
            return res.status(200).send(userToAdmin);
        };

        const setUserAdmin = await User.findByIdAndUpdate(
            req.params.id, 
            { isAdmin: true}, 
            {new: true});

        return res.status(200).send(setUserAdmin);
    } catch (error) {
        console.error(`Error: ${error}`);
        return res.status(500).send('Internal Server Error');
    };
};

export default getAllUsers;