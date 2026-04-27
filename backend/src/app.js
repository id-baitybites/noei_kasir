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

// API Routes
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/transactions', require('./routes/transactionRoutes'));

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
