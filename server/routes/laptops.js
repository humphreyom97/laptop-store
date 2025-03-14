/**
 * @file laptops.js
 * @description Routes for managing laptop inventory data.
 * Handles CRUD operations using utility functions from laptopUtils.
 */

const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { filterLaptops, sortLaptops, paginateLaptops } = require('../utils/laptopUtils');

const router = express.Router();

/**
 * Creates laptop routes with access to file utilities and default page size.
 * @param {Function} readLaptops - Function to read laptops from file.
 * @param {Function} writeLaptops - Function to write laptops to file.
 * @param {number} defaultPageSize - Default number of items per page.
 * @returns {express.Router} Configured router instance.
 * @throws {Error} If dependencies are invalid.
 */
const createRouter = (readLaptops, writeLaptops, defaultPageSize) => {
  if (typeof readLaptops !== 'function' || typeof writeLaptops !== 'function') {
    throw new Error('readLaptops and writeLaptops must be functions');
  }
  if (!Number.isInteger(defaultPageSize) || defaultPageSize <= 0) {
    throw new Error('defaultPageSize must be a positive integer');
  }

  // GET /laptops - Retrieve laptops with optional filtering, sorting, and pagination
  router.get('/', async (req, res) => {
    try {
      const {
        page: pageStr,
        pageSize: pageSizeStr,
        getAll,
        sortField,
        sortOrder,
        ...filters
      } = req.query;
      const page = pageStr !== undefined && pageStr !== null ? parseInt(pageStr) : 1;
      const pageSize = parseInt(pageSizeStr) || defaultPageSize;
      const fetchAll = getAll === 'true' || getAll === true;

      if (!fetchAll) {
        if (page < 1) return res.status(400).json({ error: 'Page must be a positive integer' });
        if (pageSize < 0) return res.status(400).json({ error: 'PageSize must be non-negative' });
      }
      if (sortOrder && !['asc', 'desc'].includes(sortOrder)) {
        return res.status(400).json({ error: 'sortOrder must be "asc" or "desc"' });
      }

      const laptops = await readLaptops();
      const filteredLaptops = filterLaptops(laptops, filters);
      const sortedLaptops = sortLaptops(filteredLaptops, sortField, sortOrder);
      const resultLaptops = fetchAll
        ? sortedLaptops
        : paginateLaptops(sortedLaptops, page, pageSize);

      res.json({
        rows: resultLaptops,
        totalRows: filteredLaptops.length,
      });
    } catch (err) {
      console.error('GET /laptops error:', err);
      res.status(500).json({ error: err.message || 'Internal server error' });
    }
  });

  // POST /laptops - Create a new laptop entry
  router.post('/', async (req, res) => {
    try {
      const { brand, serialNumber } = req.body;
      if (!brand) return res.status(400).json({ error: 'Brand is required' });
      if (!serialNumber) return res.status(400).json({ error: 'Serial Number is required' });
      const laptops = await readLaptops();
      const newLaptop = Object.assign(
        {}, // Start with an empty object
        req.body, // Merge in req.body
        { id: uuidv4(), status: 'Active' } // Override with backend values for id and status
      );
      laptops.push(newLaptop);
      await writeLaptops(laptops);
      res.status(201).json(newLaptop);
    } catch (err) {
      console.error('POST /laptops error:', err);
      res.status(500).json({ error: 'Failed to create laptop' });
    }
  });

  // PUT /laptops/:id - Update an existing laptop (full update)
  router.put('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      if (!id || id.trim() === '' || id === 'null') {
        return res.status(400).json({ error: 'ID is required and must be valid' });
      }
      const laptops = await readLaptops();
      const index = laptops.findIndex((l) => l.id === id);
      if (index === -1) return res.status(404).json({ error: 'Laptop not found' });
      laptops[index] = { ...laptops[index], ...req.body };
      await writeLaptops(laptops);
      res.json(laptops[index]);
    } catch (err) {
      console.error('PUT /laptops/:id error:', err);
      res.status(500).json({ error: 'Failed to update laptop' });
    }
  });

  // PATCH /laptops/:id - Partially update a laptop (e.g., toggle status)
  router.patch('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      if (!id || id.trim() === '' || id === 'null') {
        return res.status(400).json({ error: 'ID is required and must be valid' });
      }
      if (!status || !['Active', 'Decommissioned'].includes(status)) {
        return res.status(400).json({
          error: 'PATCH request must include status: "Active" or "Decommissioned"',
        });
      }
      const laptops = await readLaptops();
      const index = laptops.findIndex((l) => l.id === id);
      if (index === -1) return res.status(404).json({ error: 'Laptop not found' });
      laptops[index].status = status;
      await writeLaptops(laptops);
      res.json(laptops[index]);
    } catch (err) {
      console.error('PATCH /laptops/:id error:', err);
      res.status(500).json({ error: 'Failed to update laptop status' });
    }
  });

  // DELETE /laptops/:id - Remove a laptop entirely
  router.delete('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      if (!id || id.trim() === '' || id === 'null') {
        return res.status(400).json({ error: 'ID is required and must be valid' });
      }
      const laptops = await readLaptops();
      const index = laptops.findIndex((l) => l.id === id);
      if (index === -1) return res.status(404).json({ error: 'Laptop not found' });
      const [deletedLaptop] = laptops.splice(index, 1);
      await writeLaptops(laptops);
      res.status(200).json(deletedLaptop);
    } catch (err) {
      console.error('DELETE /laptops/:id error:', err);
      res.status(500).json({ error: 'Failed to delete laptop' });
    }
  });

  return router;
};

module.exports = { createRouter };