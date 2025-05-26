const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Professional = require('../models/Professional');

// 🛡️ Middleware: Vérifie le token JWT
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      // Extraire et vérifier le token
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attacher l'utilisateur au req
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        res.status(401);
        throw new Error('Utilisateur non trouvé');
      }

      req.user = user;
      next();
    } catch (error) {
      console.error('Erreur de token :', error.message);
      res.status(401);
      throw new Error('Non autorisé, token invalide');
    }
  } else {
    res.status(401);
    throw new Error('Non autorisé, pas de token');
  }
});

// 🧑‍🔧 Middleware: Vérifie si l’utilisateur est un professionnel
const professionalOnly = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    res.status(401);
    throw new Error('Non autorisé, utilisateur non authentifié');
  }

  const professional = await Professional.findOne({ user: req.user._id });
  if (!professional) {
    res.status(403);
    throw new Error('Accès réservé aux professionnels');
  }

  req.professional = professional;
  next();
});

module.exports = {
  protect,
  professionalOnly,
};
