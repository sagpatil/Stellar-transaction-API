# 🚀 Dual Server Setup Summary

## Overview
Your project now runs **two separate servers** for different blockchain environments:

- **Testnet Server** (Port 8500) - Connects to `HOSTED_POSTGRES_TESTNET_TXN` database
- **Mainnet Server** (Port 8600) - Connects to `SDF_GSHOSTED_SANDBOX` database

## 🏗️ Architecture

### File Structure
```
transactionBE/
├── server.testnet.js      # Testnet server (port 8500)
├── server.mainnet.js      # Mainnet server (port 8600)
├── config.testnet.env     # Testnet database config
├── config.mainnet.env     # Mainnet database config
├── package.json           # Scripts for both servers
└── tests/                 # Test suite
    ├── server.testnet.test.js
    └── server.mainnet.test.js
```

### Database Connections
- **Testnet**: `HOSTED_POSTGRES_TESTNET_TXN` (Port 8500)
- **Mainnet**: `SDF_GSHOSTED_SANDBOX` (Port 8600)

## 🚀 Running the Servers

### Start Both Servers
```bash
# Terminal 1 - Testnet Server
npm run start:testnet

# Terminal 2 - Mainnet Server  
npm run start:mainnet
```

### Development Mode (with auto-reload)
```bash
# Terminal 1 - Testnet Server
npm run dev:testnet

# Terminal 2 - Mainnet Server
npm run dev:mainnet
```

## 🌐 API Endpoints

### Testnet Server (Port 8500)
- Health: `http://localhost:8500/health`
- Transaction: `http://localhost:8500/transaction/:txnHash`
- Transactions: `http://localhost:8500/transactions`

### Mainnet Server (Port 8600)
- Health: `http://localhost:8600/health`
- Transaction: `http://localhost:8600/transaction/:txnHash`
- Transactions: `http://localhost:8600/transactions`

## 🔍 Testing Both Servers

### Health Check
```bash
# Testnet
curl http://localhost:8500/health

# Mainnet
curl http://localhost:8600/health
```

### Transaction Lookup
```bash
# Testnet
curl "http://localhost:8500/transaction/0419a3822c03049a3423d8986fc11516bfc1ee4c07fe8139c3c5983f622f0201"

# Mainnet
curl "http://localhost:8600/transaction/0419a3822c03049a3423d8986fc11516bfc1ee4c07fe8139c3c5983f622f0201"
```

## ✅ Key Features

### Environment Identification
- All API responses include `environment` field
- Testnet responses show `"environment": "testnet"`
- Mainnet responses show `"environment": "mainnet"`

### Separate Database Pools
- Each server maintains its own PostgreSQL connection pool
- No cross-contamination between environments
- Independent scaling and monitoring

### Unified Codebase
- Both servers share the same API logic
- Easy to maintain and update
- Consistent response formats

## 🧪 Running Tests
```bash
npm test
```
Tests run against the testnet database and automatically clean up connections.

## 🔧 Configuration

### Testnet Config (`config.testnet.env`)
```
DB_HOST=ep-morning-band-addlod6y-pooler.c-2.us-east-1.aws.neon.tech
DB_NAME=HOSTED_POSTGRES_TESTNET_TXN
PORT=8500
ENVIRONMENT=testnet
```

### Mainnet Config (`config.mainnet.env`)
```
DB_HOST=ep-morning-band-addlod6y-pooler.c-2.us-east-1.aws.neon.tech
DB_NAME=SDF_GSHOSTED_SANDBOX
PORT=8600
ENVIRONMENT=mainnet
```

## 🎯 Use Cases

### Development & Testing
- Use testnet server for development and testing
- Test with testnet transaction hashes
- Safe environment for experimentation

### Production
- Use mainnet server for production applications
- Access real mainnet transaction data
- Production-grade database performance

### Parallel Development
- Run both servers simultaneously
- Compare data between environments
- A/B testing with different data sources

## 🚨 Important Notes

1. **Port Conflicts**: Ensure ports 8500 and 8600 are available
2. **Database Access**: Both databases must be accessible from your network
3. **SSL Connections**: Both use SSL connections to PostgreSQL
4. **Environment Separation**: Each server operates independently
5. **Resource Usage**: Running both servers doubles resource consumption

## 🔄 Future Enhancements

- Load balancing between environments
- Environment-specific rate limiting
- Separate logging and monitoring
- Environment-specific caching strategies
- Health check aggregation endpoint
