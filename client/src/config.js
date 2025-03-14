/**
 * @file config.js
 * @description Centralized configuration constants for the frontend.
 */

export const API_BASE_URL = 'http://localhost:3001/api/laptops';
export const DEFAULT_PAGE_SIZE = 5;
export const DEFAULT_SORT_ORDER = 'asc';
export const CSV_HEADERS = [
  'Serial Number', 'Brand', 'Model', 'Staff Name', 'Employee ID', 'Status',
  'Purchase Date', 'Warranty Expiration', 'Location', 'Hardware Specs',
  'Software Specs', 'Purchase Price', 'Notes'
];