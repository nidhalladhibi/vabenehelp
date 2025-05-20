const express = require('express');
const router = express.Router();

// 🧠 Contrôleur
const { updateProfile } = require('../controllers/userController');

// 🔐 Middleware d'authentification
const { protect } = require('../middleware/authMiddleware');

// 📌 Route : Mise à jour du profil utilisateur connecté
router.put('/profile', protect, updateProfile);

module.exports = router;
