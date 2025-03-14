const request = require('supertest');
const express = require('express');
const { createRouter } = require('../../routes/laptops');

// Sample data for mocking
const mockLaptops = [
  { id: '1', brand: 'Dell', serialNumber: 'SN1', model: 'XPS', status: 'Active' },
  { id: '2', brand: 'HP', serialNumber: 'SN2', model: 'Elite', status: 'Decommissioned' },
];

// Mock readLaptops and writeLaptops
const readLaptops = jest.fn(() => Promise.resolve([...mockLaptops]));
const writeLaptops = jest.fn(() => Promise.resolve());
const defaultPageSize = 10;

// Setup test app
const app = express();
app.use(express.json());
app.use('/api/laptops', createRouter(readLaptops, writeLaptops, defaultPageSize));

describe('Laptop Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    readLaptops.mockResolvedValue([...mockLaptops]);
    writeLaptops.mockResolvedValue();
  });

  describe('GET /api/laptops', () => {
    it('should return paginated laptops', async () => {
      const res = await request(app).get('/api/laptops').query({ page: 1, pageSize: 1 });
      expect(res.status).toBe(200);
      expect(res.body.rows).toHaveLength(1);
      expect(res.body.totalRows).toBe(2);
      expect(res.body.rows[0]).toMatchObject(mockLaptops[0]);
      expect(readLaptops).toHaveBeenCalledTimes(1);
    });

    it('should filter laptops by brand', async () => {
      const res = await request(app).get('/api/laptops').query({ brand: 'Dell' });
      expect(res.status).toBe(200);
      expect(res.body.rows).toHaveLength(1);
      expect(res.body.rows[0].brand).toBe('Dell');
    });

    it('should return 400 for invalid page (page=0)', async () => {
      const res = await request(app).get('/api/laptops').query({ page: 0 });
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'Page must be a positive integer' });
    });

    it('should return 400 for invalid sortOrder', async () => {
      const res = await request(app).get('/api/laptops').query({ sortOrder: 'invalid' });
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'sortOrder must be "asc" or "desc"' });
    });
  });

  describe('POST /api/laptops', () => {
    it('should create a new laptop', async () => {
      const newLaptop = { brand: 'Lenovo', serialNumber: 'SN3', model: 'ThinkPad' };
      const res = await request(app).post('/api/laptops').send(newLaptop);
      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({
        id: expect.any(String),
        status: 'Active',
        ...newLaptop,
      });
      expect(writeLaptops).toHaveBeenCalledWith(expect.arrayContaining([
        ...mockLaptops,
        expect.objectContaining(newLaptop),
      ]));
    });

    it('should return 400 if brand is missing', async () => {
      const res = await request(app).post('/api/laptops').send({ serialNumber: 'SN4' });
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'Brand is required' });
    });

    it('should return 400 if serialNumber is missing', async () => {
      const res = await request(app).post('/api/laptops').send({ brand: 'Lenovo' });
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'Serial Number is required' });
    });
  });

  describe('PUT /api/laptops/:id', () => {
    it('should update an existing laptop', async () => {
      const updatedLaptop = { brand: 'Dell Updated', serialNumber: 'SN1-updated', model: 'XPS' };
      const res = await request(app).put('/api/laptops/1').send(updatedLaptop);
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({ id: '1', ...updatedLaptop });
      expect(writeLaptops).toHaveBeenCalledWith(expect.arrayContaining([
        expect.objectContaining({ id: '1', ...updatedLaptop }),
        mockLaptops[1],
      ]));
    });

    it('should return 404 if laptop not found', async () => {
      const res = await request(app).put('/api/laptops/999').send({ brand: 'Unknown' });
      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: 'Laptop not found' });
    });

    it('should return 400 if id is missing or invalid', async () => {
      const res = await request(app).put('/api/laptops/null').send({ brand: 'Dell' });
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'ID is required and must be valid' });
    });
  });

  describe('PATCH /api/laptops/:id', () => {
    it('should update laptop status to Decommissioned', async () => {
      const res = await request(app).patch('/api/laptops/1').send({ status: 'Decommissioned' });
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({ id: '1', status: 'Decommissioned' });
      expect(writeLaptops).toHaveBeenCalledWith(expect.arrayContaining([
        expect.objectContaining({ id: '1', status: 'Decommissioned' }),
        mockLaptops[1],
      ]));
    });

    it('should return 400 for invalid status', async () => {
      const res = await request(app).patch('/api/laptops/1').send({ status: 'Invalid' });
      expect(res.status).toBe(400);
      expect(res.body).toEqual({
        error: 'PATCH request must include status: "Active" or "Decommissioned"',
      });
    });

    it('should return 404 if laptop not found', async () => {
      const res = await request(app).patch('/api/laptops/999').send({ status: 'Active' });
      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: 'Laptop not found' });
    });

    it('should return 400 if id is missing or invalid', async () => {
      const res = await request(app).patch('/api/laptops/null').send({ status: 'Active' });
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'ID is required and must be valid' });
    });
  });

  describe('DELETE /api/laptops/:id', () => {
    it('should delete an existing laptop', async () => {
      const res = await request(app).delete('/api/laptops/1');
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject(mockLaptops[0]);
      expect(writeLaptops).toHaveBeenCalledWith([mockLaptops[1]]);
    });

    it('should return 404 if laptop not found', async () => {
      const res = await request(app).delete('/api/laptops/999');
      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: 'Laptop not found' });
    });

    it('should return 400 if id is missing or invalid', async () => {
      const res = await request(app).delete('/api/laptops/null');
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'ID is required and must be valid' });
    });
  });
});