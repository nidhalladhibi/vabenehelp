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

// Create Express app
const app = express();

// Connect to database
connectDB();

// Security middleware
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Rate limit exceeded. Please try again later.',
});
app.use('/api', limiter);

// Enable CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Request logging (development only)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  console.log('Request logging enabled (development mode)');
}

// API Routes
app.get('/', (req, res) => {
  res.send('Welcome to the API');
});

// Mount routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const professionalRoutes = require('./routes/pros');
const serviceRoutes = require('./routes/services');
const orderRoutes = require('./routes/orders');
const ratingRoutes = require('./routes/ratings');

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/professionals', professionalRoutes);
app.use('/api/v1/services', serviceRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/ratings', ratingRoutes);

// Health check route
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API is running',
    timestamp: new Date(),
    version: '1.0.0',
  });
});

// Static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/build/index.html'));
  });
}

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: 'fail',
    message: `Cannot find ${req.originalUrl} on this server.`,
  });
});

// Global error handler
app.use(errorHandler);

module.exports = app;