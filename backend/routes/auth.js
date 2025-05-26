const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../models/User'); // Assure-toi que ce fichier existe
const { protect } = require('../middleware/authMiddleware');


const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};


router.post('/register', asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Vérifier si l'utilisateur existe
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('Utilisateur déjà existant');
  }

  // Créer un nouvel utilisateur
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Données invalides lors de l'enregistrement");
  }
}));

// 📌 @route   POST /api/auth/login
// 📌 @desc    Login user
// 📌 @access  Public
router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Vérifie l'utilisateur
  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Email ou mot de passe invalide');
  }
}));

// 📌 @route   GET /api/auth/me
// 📌 @desc    Get current user
// 📌 @access  Private
router.get('/me', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.status(200).json(user);
}));

module.exports = router;
