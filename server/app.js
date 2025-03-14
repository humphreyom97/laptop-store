/**
 * @file app.js
 * @description Express app configuration for managing laptop inventory data.
 * Defines middleware and routes, exported for use in server or tests.
 */

const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const config = require('./config');
const { createRouter } = require('./routes/laptops');

// Initialize Express app
const app = express();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? 'https://yourdomain.com' : '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
}));
app.use(express.json({ limit: '10kb' })); // Limit payload size for security

/**
 * Reads laptop data from the JSON file.
 * @returns {Promise<Object[]>} Array of laptop objects.
 * @throws {Error} If file reading or parsing fails.
 */
const readLaptops = async () => {
  try {
    const data = await fs.readFile(config.DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    throw new Error(`Failed to read laptop data: ${err.message}`);
  }
};

/**
 * Writes laptop data to the JSON file.
 * @param {Object[]} laptops - Array of laptop objects to write.
 * @throws {Error} If file writing fails.
 */
const writeLaptops = async (laptops) => {
  try {
    await fs.writeFile(config.DATA_FILE, JSON.stringify(laptops, null, 2), 'utf8');
  } catch (err) {
    throw new Error(`Failed to write laptop data: ${err.message}`);
  }
};

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

// Mount routes with /api prefix
app.use('/api/laptops', createRouter(readLaptops, writeLaptops, config.DEFAULT_PAGE_SIZE));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;