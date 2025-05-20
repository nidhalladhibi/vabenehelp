const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User'); // Assurez-vous que le modèle User est correctement défini
const Professional = require('../models/Professional'); // Assurez-vous que le modèle Professional est correctement défini

// Middleware protect : Vérifie le token JWT
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extraire le token de l'en-tête Authorization
      token = req.headers.authorization.split(' ')[1];

      // Vérifier et décoder le token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Récupérer l'utilisateur correspondant au token
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        res.status(401);
        throw new Error('Utilisateur non trouvé');
      }

      next();
    } catch (error) {
      res.status(401);
      throw new Error('Non autorisé, token invalide');
    }
  } else {
    res.status(401);
    throw new Error('Non autorisé, pas de token');
  }
});

// Middleware professionalOnly : Vérifie si l'utilisateur est un professionnel
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

  req.professional = professional; // Attacher le profil professionnel à la requête si nécessaire
  next();
});

module.exports = {
  protect,
  professionalOnly,
};