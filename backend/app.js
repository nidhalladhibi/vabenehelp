const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const path = require('path');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');
require('dotenv').config();

// 1. Création de l'application Express
const app = express();

// 2. Connexion à la base de données
connectDB();

// 3. Middleware de sécurité
app.use(helmet()); // Protection des en-têtes HTTP
app.use(mongoSanitize()); // Prévention des injections NoSQL
app.use(xss()); // Prévention des attaques XSS
app.use(hpp()); // Prévention de la pollution des paramètres HTTP

// 4. Limitation du taux de requêtes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limite de 100 requêtes par IP
  message: 'Vous avez dépassé la limite de requêtes autorisées. Veuillez réessayer plus tard.',
});
app.use('/api', limiter);

// 5. Activation de CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// 6. Gestion des données des requêtes
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// 7. Journalisation des requêtes (en mode développement uniquement)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  console.log('📝 Journalisation des requêtes activée (mode développement)');
}

// 8. Définition des routes API
app.get('/', (req, res) => {
  res.send('Bienvenue sur l’API');
});
// app.use('/api/v1', require('./routes/index')); // Routes principales
app.use('/api/v1/notifications', require('./routes/notifications'));
app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/users', require('./routes/users'));
app.use('/api/v1/professionals', require('./routes/pros'));
app.use('/api/v1/services', require('./routes/services'));
app.use('/api/v1/orders', require('./routes/orders'));
app.use('/api/v1/ratings', require('./routes/ratings'));

// 9. Route de santé publique pour vérifier l'état de l'API
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: '✅ L\'API fonctionne correctement',
    timestamp: new Date(),
    version: '1.0.0',
  });
});

// 10. Gestion des fichiers statiques en mode production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/build/index.html'));
  });

  console.log('🚀 Mode production activé');
}

// 11. Gestion des routes non trouvées
app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Impossible de trouver ${req.originalUrl} sur ce serveur.`,
  });
});

// 12. Gestionnaire d'erreurs global
app.use(errorHandler);

// 13. Exportation de l'application pour les tests ou le serveur
module.exports = app;