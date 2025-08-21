const request = require('supertest');
const { app, pool } = require('../server.testnet');

describe('Transaction API Endpoints', () => {
  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('GET /transaction/:txnHash', () => {
    it('should return transaction data for valid hash', async () => {
      const testHash = 'e87d1f0d31bc3d6270c945ba81339af913a680947524932d042ca1f3f771aec4';
      
      const response = await request(app)
        .get(`/transaction/${testHash}`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('txnHash', testHash);
      expect(response.body.data).toHaveProperty('transaction_hash');
    });

    it('should return 404 for non-existent transaction hash', async () => {
      const nonExistentHash = 'nonexistent1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
      
      const response = await request(app)
        .get(`/transaction/${nonExistentHash}`)
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Transaction not found');
      expect(response.body).toHaveProperty('txnHash', nonExistentHash);
    });

    it('should return 400 for empty transaction hash', async () => {
      const response = await request(app)
        .get('/transaction/')
        .expect(404);
    });
  });

  describe('GET /transactions', () => {
    it('should return paginated transactions', async () => {
      const response = await request(app)
        .get('/transactions')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('pagination');
      expect(response.body.pagination).toHaveProperty('page', 1);
      expect(response.body.pagination).toHaveProperty('limit', 10);
      expect(response.body.pagination).toHaveProperty('total');
      expect(response.body.pagination).toHaveProperty('pages');
    });

    it('should return transactions with custom pagination', async () => {
      const response = await request(app)
        .get('/transactions?page=2&limit=5')
        .expect(200);

      expect(response.body.pagination).toHaveProperty('page', 2);
      expect(response.body.pagination).toHaveProperty('limit', 5);
    });

    it('should handle invalid pagination parameters gracefully', async () => {
      const response = await request(app)
        .get('/transactions?page=abc&limit=xyz')
        .expect(200);

      expect(response.body.pagination).toHaveProperty('page', 1);
      expect(response.body.pagination).toHaveProperty('limit', 10);
      expect(response.body.pagination.page).toBe(1);
      expect(response.body.pagination.limit).toBe(10);
    });
  });

  describe('Error Handling', () => {
    it('should return 404 for non-existent endpoints', async () => {
      const response = await request(app)
        .get('/nonexistent')
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Endpoint not found');
    });
  });

  // Close database connection after all tests
  afterAll(async () => {
    await pool.end();
  });
});
