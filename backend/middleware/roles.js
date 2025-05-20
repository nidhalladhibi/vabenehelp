const asyncHandler = require('express-async-handler');

// Middleware pour vérifier les rôles des utilisateurs
const authorizeRoles = (...roles) => {
  return asyncHandler((req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Accès refusé : vous n’avez pas les autorisations nécessaires.',
      });
    }
    next();
  });
};

module.exports = { authorizeRoles };