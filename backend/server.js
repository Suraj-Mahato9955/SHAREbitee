const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const { errorHandler } = require('./middlewares/errorMiddleware');
const notificationRoutes = require('./routes/notification');

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// CORS configuration
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://localhost:5174',
      'https://suraj-mahato9955.github.io'
    ],
    credentials: true
  })
);

// Body parser
app.use(express.json());

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/food', require('./routes/food'));
app.use('/api/request', require('./routes/request'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/notification', notificationRoutes);

// Health check
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'SHAREbite API is running...',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Error handler
app.use(errorHandler);

// Port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(
    `SHAREbite server running in ${
      process.env.NODE_ENV || 'development'
    } mode on port ${PORT}`
  );
});
