const app = require('./app');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Noei Kasir Backend running on port ${PORT}`);
  console.log(`MCP Endpoint available at http://localhost:${PORT}/mcp`);
});
