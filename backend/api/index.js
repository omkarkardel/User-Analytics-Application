const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const { connectDB } = require('../config/db');
const eventRoutes = require('../routes/eventRoutes');

dotenv.config();

const app = express();

// Basic middleware
app.use(cors());
app.use(express.json({ limit: '1mb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({ ok: true });
});

// API routes
app.use('/api', eventRoutes);

// Global 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Server error' });
});

// MongoDB Connection
const MONGODB_URI =
  process.env.MONGODB_URI || process.env.DATABASE_URL;

if (!MONGODB_URI) {
  console.error('Missing MongoDB URI');
} else {
  connectDB(MONGODB_URI);
}

module.exports = app;