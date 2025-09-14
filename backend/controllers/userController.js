const User = require('../models/userModel.js');
const generateToken = require('../utils/generateToken.js'); 

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
  // 1. Get the data from the request body
  const { email, password, companyName } = req.body;

  try {
    // 2. Check if the user already exists in the database
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    // 3. If user doesn't exist, create a new user in memory
    const user = await User.create({
      email,
      password,
      companyName,
    });

    // 4. If the user was created successfully, save them to the DB and send back a response
    if (user) {
      res.status(201).json({
        _id: user._id,
        email: user.email,
        companyName: user.companyName,
        // We will generate and send a JWT token here in the next step
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// @desc    Auth user & get token (Login)
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Find the user by their email
    const user = await User.findOne({ email });

    // 2. If user exists and the password matches, send back user data and a token
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        email: user.email,
        companyName: user.companyName,
        token: generateToken(user._id),
      });
    } else {
      // 3. If not, send an error message
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      email: user.email,
      companyName: user.companyName,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.email = req.body.email || user.email;
    user.companyName = req.body.companyName || user.companyName;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      email: updatedUser.email,
      companyName: updatedUser.companyName,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

module.exports = {
  // Make sure to export the old functions as well
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
};
