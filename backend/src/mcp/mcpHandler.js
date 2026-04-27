const productService = require('../services/productService');
const transactionService = require('../services/transactionService');

const tools = {
  getDailySales: {
    description: "Get summary of sales for a specific date",
    schema: {
      type: "object",
      properties: {
        date: { type: "string", description: "Date in YYYY-MM-DD format" }
      }
    },
    run: async (args) => {
      return await transactionService.getDailySales(args.date);
    }
  },
  getProductStock: {
    description: "Check current stock level for a product",
    schema: {
      type: "object",
      properties: {
        productId: { type: "number" }
      },
      required: ["productId"]
    },
    run: async (args) => {
      const product = await productService.getProductById(args.productId);
      return { productId: args.productId, stock: product ? product.stock : 0, name: product ? product.name : 'Unknown' };
    }
  },
  getLowStock: {
    description: "List products with stock below threshold",
    schema: {
      type: "object",
      properties: {
        threshold: { type: "number", default: 10 }
      }
    },
    run: async (args) => {
      return await productService.getLowStockProducts(args.threshold);
    }
  },
  createTransaction: {
    description: "Create a new sale transaction",
    schema: {
      type: "object",
      properties: {
        items: {
          type: "array",
          items: {
            type: "object",
            properties: {
              product_id: { type: "number" },
              quantity: { type: "number" }
            },
            required: ["product_id", "quantity"]
          }
        },
        payment_method: { type: "string", enum: ["cash", "card", "qr"] }
      },
      required: ["items"]
    },
    run: async (args) => {
      return await transactionService.createTransaction(args);
    }
  }
};

const handleMcpRequest = async (req, res) => {
  const { method, params, id } = req.body;

  if (!tools[method]) {
    return res.status(404).json({
      jsonrpc: "2.0",
      error: { code: -32601, message: "Method not found" },
      id
    });
  }

  try {
    const result = await tools[method].run(params);
    res.json({
      jsonrpc: "2.0",
      result,
      id
    });
  } catch (error) {
    res.status(500).json({
      jsonrpc: "2.0",
      error: { code: -32603, message: error.message },
      id
    });
  }
};

const getToolDefinitions = (req, res) => {
  const definitions = Object.keys(tools).map(key => ({
    name: key,
    description: tools[key].description,
    inputSchema: tools[key].schema
  }));
  res.json(definitions);
};

module.exports = {
  handleMcpRequest,
  getToolDefinitions
};
