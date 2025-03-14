const request = require('supertest');
const app = require('../../app'); // Updated to import app.js

describe('Server Integration Tests', () => {
  describe('GET /health', () => {
    it('returns status ok and uptime', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('status', 'ok');
      expect(res.body).toHaveProperty('uptime');
      expect(typeof res.body.uptime).toBe('number');
    });
  });
});