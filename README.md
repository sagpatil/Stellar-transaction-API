# Transaction Backend API

A Node.js backend API for fetching transaction information from a Goldsky-hosted PostgreSQL database.

## Features

- 🔍 Get transaction details by transaction hash
- 📋 List all transactions with pagination
- 🏥 Health check endpoint
- 🚀 Fast and efficient PostgreSQL queries
- 🧪 Comprehensive test suite
- 🔒 Secure database connection handling

## API Endpoints

### Health Check
```
GET /health
```
Returns server health status and timestamp.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Get Transaction by Hash
```
GET /transaction/:txnHash
```
Fetches transaction details using the transaction hash.

**Parameters:**
- `txnHash` (string): The transaction hash to search for

**Response:**
```json
{
  "success": true,
  "data": {
    "transaction_hash": "0419a3822c03049a3423d8986fc11516bfc1ee4c07fe8139c3c5983f622f0201",
    "account": "GAHY75VX325V34TY3LCMFFRA7G7H74WOHH76NV4CU4OPYXOONGQ35ADV",
    "account_sequence": "395682452078609",
    "max_fee": "102378",
    "fee_charged": "63145",
    "successful": true,
    "operation_count": 1,
    "ledger_sequence": "121905",
    "ledger_closed_at": "2025-08-22T01:55:36.000Z"
    // ... other transaction fields
  },
  "txnHash": "0419a3822c03049a3423d8986fc11516bfc1ee4c07fe8139c3c5983f622f0201"
}
```

### Get All Transactions
```
GET /transactions?page=1&limit=10
```
Returns paginated list of all transactions.

**Query Parameters:**
- `page` (optional): Page number (default: 1, minimum: 1)
- `limit` (optional): Items per page (default: 10, minimum: 1, maximum: 100)

**Response:**
```json
{
  "success": true,
  "data": [
    // ... transaction objects
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

## Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd transactionBE
```

2. Install dependencies:
```bash
npm install
```

3. Configure database connections:
   - **Testnet**: Database connection details are configured in `config.testnet.env`
   - **Mainnet**: Database connection details are configured in `config.mainnet.env`
   - Update the files if you need to change connection parameters

4. Start the servers:

**Testnet Server (Port 8500):**
```bash
# Development mode with auto-reload
npm run dev:testnet

# Production mode
npm run start:testnet
```

**Mainnet Server (Port 8600):**
```bash
# Development mode with auto-reload
npm run dev:mainnet

# Production mode
npm run start:mainnet
```

Both servers can run simultaneously on different ports.

## Testing

Run the test suites:

**All Tests:**
```bash
npm test
```

**Testnet Tests Only:**
```bash
npm run test:testnet
```

**Mainnet Tests Only:**
```bash
npm run test:mainnet
```

The tests include:
- Health check endpoint validation
- Transaction lookup functionality
- Pagination handling
- Error handling scenarios
- Environment-specific validation (testnet vs mainnet)

## Database Schema

### Testnet Database
The testnet API expects a table named `source_1` with the following key columns:
- `transaction_hash`: Transaction hash (primary identifier)
- `account`: Account address
- `account_sequence`: Account sequence number  
- `max_fee`, `fee_charged`: Fee information
- `successful`: Transaction success status
- `operation_count`: Number of operations
- `ledger_sequence`: Ledger sequence number
- `ledger_closed_at`: Timestamp when ledger was closed
- And 20+ additional transaction detail columns

### Mainnet Database
The mainnet API expects a table named `tx_history_v2` with the following key columns:
- `transaction_hash`: Transaction hash (primary identifier)
- `account`: Account address
- `account_sequence`: Account sequence number  
- `max_fee`, `fee_charged`: Fee information
- `successful`: Transaction success status
- `operation_count`: Number of operations
- `ledger_sequence`: Ledger sequence number
- `ledger_closed_at`: Timestamp when ledger was closed
- And 20+ additional transaction detail columns

**Note**: The mainnet database uses a different table name (`tx_history_v2`) compared to testnet (`source_1`).

## Environment Variables

The following environment variables are configured in `config.env`:

- `DB_HOST`: PostgreSQL host
- `DB_PORT`: PostgreSQL port
- `DB_NAME`: Database name
- `DB_USER`: Database username
- `DB_PASSWORD`: Database password
- `DB_CONNECTION_STRING`: Full connection string
- `PORT`: Server port (default: 8500)

## Example Usage

### Using curl
```bash
# Health check
curl http://localhost:8500/health

# Get transaction by hash
curl http://localhost:8500/transaction/0419a3822c03049a3423d8986fc11516bfc1ee4c07fe8139c3c5983f622f0201

# Get all transactions (first page)
curl http://localhost:8500/transactions

# Get transactions with custom pagination
curl "http://localhost:8500/transactions?page=2&limit=5"
```

### Using JavaScript
```javascript
const response = await fetch('http://localhost:8500/transaction/0419a3822c03049a3423d8986fc11516bfc1ee4c07fe8139c3c5983f622f0201');
const transaction = await response.json();
console.log(transaction.data);
```

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- `200`: Success
- `400`: Bad request (missing parameters)
- `404`: Transaction not found or endpoint not found
- `500`: Internal server error

## Security Features

- CORS enabled for cross-origin requests
- Parameterized queries to prevent SQL injection
- SSL connection to PostgreSQL
- Environment variable configuration

## Development

### Project Structure
```
transactionBE/
├── server.testnet.js      # Testnet server file
├── server.mainnet.js      # Mainnet server file
├── config.testnet.env     # Testnet database configuration
├── config.mainnet.env     # Mainnet database configuration
├── package.json           # Dependencies and scripts
├── tests/                 # Test files
│   ├── server.testnet.test.js
│   └── server.mainnet.test.js
└── README.md              # This file
```

### Adding New Endpoints

1. Add the route in `server.js`
2. Add corresponding tests in `tests/server.test.js`
3. Update this README with endpoint documentation

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Verify database credentials in `config.env`
   - Check if the database is accessible from your network
   - Ensure SSL settings are correct

2. **Port Already in Use**
   - Change the port in `config.env`
   - Kill processes using port 8500

3. **Tests Failing**
   - Ensure the database is running and accessible
   - Check that the test transaction hash exists in your database
   - Tests automatically close database connections and should exit cleanly

4. **Tests Hanging (Not Exiting)**
   - This issue has been fixed with proper connection cleanup
   - Tests now include `afterAll()` hook to close database connections

## License

MIT License
