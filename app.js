const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');

// Route files
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

// Middleware
const errorHandler = require('./middleware/error');

const app = express();

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100
});
app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// Enable CORS
app.use(cors());

// Mount routers
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/books', bookRoutes);
app.use('/api/v1/reviews', reviewRoutes); // Add standalone reviews route
app.use('/api/v1/books/:bookId/reviews', reviewRoutes); // Keep nested route

// Error handler middleware
app.use(errorHandler);

module.exports = app;