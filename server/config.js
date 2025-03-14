/**
 * @file config.js
 * @description Centralized configuration constants for the server.
 */

require('dotenv').config();
const path = require('path');

module.exports = {
  PORT: process.env.PORT || 3001,
  DATA_FILE: process.env.DATA_FILE || './data/laptops.json',
  DEFAULT_PAGE_SIZE: parseInt(process.env.DEFAULT_PAGE_SIZE) || 5,
};