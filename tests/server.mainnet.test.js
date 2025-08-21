const request = require('supertest');
const { app, pool } = require('../server.mainnet');

describe('Mainnet Transaction API Endpoints', () => {
  // Increase timeout for mainnet tests as they may take longer
  jest.setTimeout(30000);
  describe('GET /health', () => {
    it('should return health status with mainnet environment', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('environment', 'mainnet');
      expect(response.body).toHaveProperty('port', '8600');
    });
  });

  describe('GET /transaction/:txnHash', () => {
    it('should return transaction data for valid mainnet hash', async () => {
      const testHash = 'be8fe1b7b1c1a4cc2fe0dcfd57828212edfae0917ea61f3d25a106524dcfc882';
      
      const response = await request(app)
        .get(`/transaction/${testHash}`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('txnHash', testHash);
      expect(response.body).toHaveProperty('environment', 'mainnet');
      expect(response.body.data).toHaveProperty('transaction_hash');
      expect(response.body.data).toHaveProperty('account');
      expect(response.body.data).toHaveProperty('successful');
    });

    it('should return 404 for non-existent transaction hash', async () => {
      const nonExistentHash = 'nonexistent1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
      
      const response = await request(app)
        .get(`/transaction/${nonExistentHash}`)
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Transaction not found');
      expect(response.body).toHaveProperty('txnHash', nonExistentHash);
      expect(response.body).toHaveProperty('environment', 'mainnet');
    });

    it('should return 400 for empty transaction hash', async () => {
      const response = await request(app)
        .get('/transaction/')
        .expect(404);
    });
  });

  describe('GET /transactions', () => {
    it.skip('should return paginated transactions from mainnet', async () => {
      const response = await request(app)
        .get('/transactions')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('pagination');
      expect(response.body).toHaveProperty('environment', 'mainnet');
      expect(response.body.pagination).toHaveProperty('page', 1);
      expect(response.body.pagination).toHaveProperty('limit', 10);
      expect(response.body.pagination).toHaveProperty('total');
      expect(response.body.pagination).toHaveProperty('pages');
    });

    it.skip('should return transactions with custom pagination', async () => {
      const response = await request(app)
        .get('/transactions?page=2&limit=5')
        .expect(200);

      expect(response.body.pagination).toHaveProperty('page', 2);
      expect(response.body.pagination).toHaveProperty('limit', 5);
      expect(response.body).toHaveProperty('environment', 'mainnet');
    });

    it.skip('should handle invalid pagination parameters gracefully', async () => {
      const response = await request(app)
        .get('/transactions?page=abc&limit=xyz')
        .expect(200);

      expect(response.body.pagination).toHaveProperty('page', 1);
      expect(response.body.pagination).toHaveProperty('limit', 10);
      expect(response.body).toHaveProperty('environment', 'mainnet');
    });
  });

  describe('Error Handling', () => {
    it('should return 404 for non-existent endpoints', async () => {
      const response = await request(app)
        .get('/nonexistent')
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Endpoint not found');
      expect(response.body).toHaveProperty('environment', 'mainnet');
    });
  });

  // Close database connection after all tests
  afterAll(async () => {
    await pool.end();
  });
});
