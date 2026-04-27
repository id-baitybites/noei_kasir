# Noei Kasir (POS + MCP)

Noei Kasir is a production-ready Point of Sale system integrated with the Model Context Protocol (MCP), allowing AI agents to interact with sales data, inventory, and transactions through a controlled interface.

## Tech Stack
- **Backend:** Node.js (Express)
- **Frontend:** React (Vite)
- **Database:** PostgreSQL (NeonDB)
- **MCP:** JSON-RPC / REST interface
- **Deployment:** Render (Backend), Netlify (Frontend)

## Architecture
- `backend/`: Express API with MCP tool definitions.
- `frontend/`: React SPA with Tailwind-style clean UI.
- `mcp/`: Controlled layer preventing direct DB access for AI.

## Setup Instructions

### 1. Prerequisites
- Node.js 18+
- PostgreSQL (or NeonDB account)

### 2. Backend Setup
1. `cd backend`
2. `npm install`
3. Create `.env` from `.env.example` and add your `DATABASE_URL`.
4. Run migrations: `psql -d YOUR_DB_URL -f src/db/schema.sql`
5. `npm run dev`

### 3. Frontend Setup
1. `cd frontend`
2. `npm install`
3. Create `.env` and set `VITE_API_URL=http://localhost:5000/api`.
4. `npm run dev`

## MCP Integration
The backend exposes an MCP-compatible endpoint at `/mcp`.

### Example Request (JSON-RPC)
```json
{
  "jsonrpc": "2.0",
  "method": "getProductStock",
  "params": { "productId": 1 },
  "id": 1
}
```

### Available Tools
- `getDailySales`: Returns sales summary for a date.
- `getProductStock`: Returns current stock level.
- `createTransaction`: Processes a sale.
- `getLowStock`: Lists products below threshold.

## Deployment

### Render (API & DB) - Recommended
1. Use the **Blueprint** feature on Render.
2. It will detect the `render.yaml` in the root and automatically setup the API service and environment variables.

### Netlify (Frontend)
1. Connect your GitHub repo.
2. Base directory: `frontend`
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Environment Variables: Set `VITE_API_URL` to your backend URL.
6. **Note**: The included `netlify.toml` handles SPA routing (200 redirects to index.html).

### Vercel (Backend Alternative)
1. Import the repository as a new project.
2. Set the root directory to `backend`.
3. The `vercel.json` configuration will automatically handle the Express app as a serverless function.
4. Add your `DATABASE_URL` and `JWT_SECRET` in Vercel's environment variables.
