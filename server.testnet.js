const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Load environment variables
const envPath = path.join(__dirname, 'config.testnet.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = envContent.split('\n').reduce((acc, line) => {
  const [key, value] = line.split('=');
  if (key && value) {
    acc[key.trim()] = value.trim();
  }
  return acc;
}, {});

const app = express();
const PORT = envVars.PORT || 8500;
const ENVIRONMENT = envVars.ENVIRONMENT || 'testnet';

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const pool = new Pool({
  host: envVars.DB_HOST,
  port: envVars.DB_PORT,
  database: envVars.DB_NAME,
  user: envVars.DB_USER,
  password: envVars.DB_PASSWORD,
  ssl: {
    rejectUnauthorized: false
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: ENVIRONMENT,
    port: PORT
  });
});

// Get transaction by hash endpoint
app.get('/transaction/:txnHash', async (req, res) => {
  try {
    const { txnHash } = req.params;
    
    if (!txnHash) {
      return res.status(400).json({ error: 'Transaction hash is required' });
    }

    const query = 'SELECT * FROM source_1 WHERE transaction_hash = $1';
    const result = await pool.query(query, [txnHash]);

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        error: 'Transaction not found',
        txnHash: txnHash,
        environment: ENVIRONMENT
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
      txnHash: txnHash,
      environment: ENVIRONMENT
    });

  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message,
      environment: ENVIRONMENT
    });
  }
});

// Get all transactions (with pagination)
app.get('/transactions', async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.query;
    
    // Validate and convert parameters to integers
    page = Math.max(1, parseInt(page) || 1);
    limit = Math.max(1, Math.min(100, parseInt(limit) || 10)); // Cap limit at 100
    
    const offset = (page - 1) * limit;

    // Get transactions
    const query = 'SELECT * FROM source_1 ORDER BY transaction_hash LIMIT $1 OFFSET $2';
    const result = await pool.query(query, [limit, offset]);

    // Get total count
    const countQuery = 'SELECT COUNT(*) FROM source_1';
    const countResult = await pool.query(countQuery);
    const totalCount = parseInt(countResult.rows[0].count);

    res.json({
      success: true,
      data: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      },
      environment: ENVIRONMENT
    });

  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message,
      environment: ENVIRONMENT
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something broke!',
    environment: ENVIRONMENT
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Endpoint not found',
    environment: ENVIRONMENT
  });
});

// Start server only if this file is run directly (not during testing)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Testnet Server running on port ${PORT}`);
    console.log(`🌐 Environment: ${ENVIRONMENT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`🔍 Transaction endpoint: http://localhost:${PORT}/transaction/:txnHash`);
    console.log(`📋 All transactions: http://localhost:${PORT}/transactions`);
  });
}

// Export both app and pool for testing
module.exports = { app, pool };
