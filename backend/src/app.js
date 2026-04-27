const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { handleMcpRequest, getToolDefinitions } = require('./mcp/mcpHandler');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

// MCP Endpoints
app.post('/mcp', handleMcpRequest);
app.get('/mcp/tools', getToolDefinitions);

const { authenticate, authorize } = require('./middleware/authMiddleware');

// API Routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);

const productRoutes = require('./routes/productRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

// Products: super-admin, stock-admin can manage. store-admin, cashier can view.
app.use('/api/products', authenticate, productRoutes);
app.use('/products', authenticate, productRoutes);

// Transactions: all authenticated users can create, but maybe only super-admin/store-admin can view history.
app.use('/api/transactions', authenticate, transactionRoutes);
app.use('/transactions', authenticate, transactionRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      status: err.status || 500
    }
  });
});

module.exports = app;
