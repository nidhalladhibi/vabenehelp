const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Professional = require('../models/Professional');

// Middleware: Verify JWT token
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract and verify token
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to request
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        res.status(401);
        throw new Error('User not found');
      }

      req.user = user;
      next();
    } catch (error) {
      console.error('Token error:', error.message);
      res.status(401);
      throw new Error('Not authorized, invalid token');
    }
  } else {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

// Middleware: Check if user is a professional
const professionalOnly = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    res.status(401);
    throw new Error('Not authorized, user not authenticated');
  }

  const professional = await Professional.findOne({ user: req.user._id });
  if (!professional) {
    res.status(403);
    throw new Error('Access restricted to professionals');
  }

  req.professional = professional;
  next();
});

module.exports = {
  protect,
  professionalOnly,
};
