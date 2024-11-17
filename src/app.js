const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const furnitureRoutes = require('./routes/furnitureRoutes');
const orderRoutes = require('./routes/orderRoutes');
const woodRoutes = require('./routes/woodRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(helmet());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/furniture', furnitureRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/woods', woodRoutes);
app.use('/api/categories', categoryRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

module.exports = app;