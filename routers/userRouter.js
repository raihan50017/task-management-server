const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const userValidation = require('../middleware/validation/userValidation');
const { userRegisterErrorHandler } = require('../middleware/errorHandler/userErrorHandler');
const authenticate = require('../middleware/authentication/authenticate');

const router = express.Router();

// User Registration
router.post(
  '/register', userValidation, userRegisterErrorHandler,
  async (req, res, next) => {
    try {
      const { firstName, lastName, email, password } = req.body;

      // Check if the user already exists
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ errors: {
          message:"User already exists"
        }});
      }

      // Create a new user
      const newUser = new User({ firstName, lastName, email, password });
      await newUser.save();

      // Generate JWT token
      const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '30d' });


     const userWithoutPassword = { ...newUser.toObject(), password: undefined, __v:undefined };

     res.status(200).json({data: userWithoutPassword, message: "Login successful", token });
     
    } catch (error) {
      next(error);
    }
  }
);


router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    // Check if user exists
    if (!user) {
      return res.status(401).json({ errors:{
        message: "Invalid email or password",
      }});
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ errors:{
        message: "Invalid email or password" ,
      } });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    const userWithoutPassword = { ...user.toObject(), password: undefined, __v:undefined };

    res.status(200).json({data: userWithoutPassword, message: "Login successful", token });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ errors:{message: "Internal server error" }});
  }
});

// Fetch Users
router.get('/fetch', authenticate, async (req, res) => {
  try {
    const users = await User.find().select('-password -__v');
    res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ errors: { message: "Internal server error" } });
  }
});

// Fetch Users
router.get('/verify-token', authenticate, async (req, res) => {
  res.status(201).json({ userId: req.userId });
});


module.exports = router;
