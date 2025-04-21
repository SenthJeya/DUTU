const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const UserTasks = require('../models/task');
const protectRoute = require('../middleware/auth');
const  verifyToken  = require('../middleware/auth');
const mongoose = require('mongoose');

const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  // Check if the user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Hash the password before saving
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create a new user
  const user = new User({
    name,
    email,
    password: hashedPassword,
  });

  try {
    await user.save();

    // Create a JWT token for the new user
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET, // Use your secret key from the environment variable
      { expiresIn: '24h' } // Set the expiration time for the token
    );

    res.status(201).json({
      message: 'User registered successfully!',
      token,  // Send the token back to the frontend
    });
  } catch (err) {
    res.status(500).json({ message: 'Error registering user', error: err });
  }
});


//user Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ 
      success: false,
      message: 'Email and password are required' 
    });
  }

  try {
    // Check if the user exists
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' // Generic message for security
      });
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    // Generate a JWT token (consistent with your verifyToken middleware)
    const token = jwt.sign(
      { 
        id: user._id.toString() // Standardized to 'id' and converted to string
      }, 
      process.env.JWT_SECRET,
      { 
        expiresIn: '1h',
        issuer: 'DUTU' // Optional but good practice
      }
    );

    // Prepare user data without sensitive information
    const userData = {
      // id: user._id.toString(),
      id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt
    };
    
    // Send response
    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: userData,
      expiresIn: 3600 // Token expiration in seconds
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Server error during authentication',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});


// GET route to fetch logged-in user data
router.get('/me', protectRoute, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);  // Assuming req.user.userId contains the authenticated user's ID
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send user data (name, email, etc.)
    res.status(200).json({
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user data' });
  }
});
  

// Update user profile
router.put('/update/:id', verifyToken, async (req, res) => {
  try {
    const { name } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }

    res.send({
      _id: user._id,
      name: user.name,
      email: user.email
    });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});


//Delete User and Corrsponding task document
router.delete('/delete/:userId', verifyToken, async (req, res) => {
  const { userId } = req.params;

  try {
    // Delete from both collections
    await User.deleteOne({ _id: userId });
    await UserTasks.deleteOne({ userId: userId });

    res.status(200).json({ message: 'Account and tasks deleted successfully' });
  } catch (error) {
    console.error('Deletion error:', error);
    res.status(500).json({ message: 'Server error during account deletion' });
  }
});

module.exports = router;
