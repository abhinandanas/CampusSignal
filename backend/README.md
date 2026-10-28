# CampusSignal — Backend API Reference & Setup Guide

This directory contains the Express REST API backend for **CampusSignal – Wi-Fi Dead-Zone Mapper**, developed by Team SignalX.

---

## 1. Technology Stack

- **Runtime:** Node.js (>= v20.0.0)
- **Framework:** Express.js (v4.x)
- **Database:** PostgreSQL with `pg` (node-postgres connection pool)
- **Environment Management:** `dotenv`
- **Security & CORS:** `cors`
- **Testing:** Node.js Built-In Test Runner (`node:test`, `node:assert`)

---

## 2. Directory Layout

```text
backend/
├── src/
│   ├── config/
│   │   ├── database.js          # PostgreSQL connection pool, query helper, and health checks
│   │   └── env.js               # Validated environment configuration loaded via dotenv
│   ├── controllers/
│   │   ├── dashboard.controller.js  # Dashboard aggregations (placeholder)
│   │   ├── health.controller.js     # Health check & database probe handler
│   │   ├── locations.controller.js  # Campus location retrieval (placeholder)
│   │   └── tests.controller.js      # Network test submission & history (placeholder)
│   ├── middleware/
│   │   ├── errorHandler.js      # Centralized error handler (JSON envelopes, safety sanitization)
│   │   └── notFound.js          # Standard 404 Route-Not-Found handler
│   ├── repositories/            # Data access queries for PostgreSQL (placeholders)
│   ├── routes/
│   │   ├── dashboard.routes.js  # /api/dashboard router
│   │   ├── health.routes.js     # /api/health router
│   │   ├── locations.routes.js  # /api/locations router
│   │   └── tests.routes.js      # /api/tests router
│   ├── services/                # Business logic layer (placeholders)
│   ├── validators/              # Request payload validation (placeholders)
│   ├── app.js                   # Express application setup, middleware pipeline, route registration
│   └── server.js                # Server listener, database connection probe, and graceful shutdown
├── tests/
│   ├── errors.test.js           # 404, malformed JSON, and centralized error handling tests
│   └── health.test.js           # Health-check endpoint and database status tests
├── .env.example                 # Template for environment variables
├── .gitignore                   # Excludes node_modules and .env
├── package.json                 # Backend scripts and dependencies
└── README.md                    # This backend documentation
```

---

## 3. Middleware Pipeline Order

In `src/app.js`, Express middlewares are loaded in a strict, secure sequence:
1. **CORS:** Restricts incoming requests to `FRONTEND_ORIGIN` (default: `http://localhost:3000`).
2. **Body Parsers:** `express.json({ limit: '1mb' })` and `express.urlencoded({ extended: true })`.
3. **API Routers:** Mounted under `/api/health`, `/api/locations`, `/api/tests`, `/api/dashboard`.
4. **404 Catch-All:** `notFound` middleware catches any unmatched routes and returns a standard HTTP 404.
5. **Centralized Error Handler:** `errorHandler` middleware catches any thrown/forwarded error, formats consistent JSON, handles database disconnections, and suppresses stack traces in production.

---

## 4. Environment Variables Configuration

Create a `.env` file in the `backend/` folder by copying `.env.example`:

```bash
cp .env.example .env
```

| Variable | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `NODE_ENV` | String | `development` | Set to `production` in deployment to hide stack traces and internal errors |
| `PORT` | Integer | `5000` | Port for the Express server to listen on |
| `FRONTEND_ORIGIN` | String | `http://localhost:3000` | Allowed origin for CORS (Next.js frontend URL) |
| `DB_HOST` | String | `localhost` | PostgreSQL host |
| `DB_PORT` | Integer | `5432` | PostgreSQL port |
| `DB_NAME` | String | `campussignal_db` | PostgreSQL database name |
| `DB_USER` | String | `your_database_user` | PostgreSQL database username |
| `DB_PASSWORD` | String | `your_database_password`| PostgreSQL database password |
| `DATABASE_URL` | String | *None* | Optional full PostgreSQL connection URI (e.g., `postgresql://user:pass@host:5432/db`) |
| `DB_POOL_MAX` | Integer | `10` | Maximum number of concurrent database connections in the pool |
| `DB_POOL_IDLE_TIMEOUT_MS` | Integer | `30000` | Milliseconds a client must sit idle before being closed |
| `DB_POOL_CONNECTION_TIMEOUT_MS` | Integer | `2000` | Milliseconds to wait before timing out when acquiring a connection |

> [!CAUTION]
> Never commit `.env` or database credentials to Git. `backend/.gitignore` excludes `.env` automatically.

---

## 5. Installation & Execution

### 5.1 Install Dependencies
From the `backend/` directory:
```bash
npm install
```

Or from the repository root:
```bash
npm run install:backend
```

### 5.2 Start Development Server (with Auto-Reload)
Using Node's native file watcher (`node --watch`):
```bash
npm run dev
```

### 5.3 Start Production Server
```bash
npm start
```

---

## 6. Running Backend Tests

Tests use Node.js's built-in test runner (`node:test`) and assert library (`node:assert/strict`). **No external testing framework or live database is required to run the test suite.**

```bash
# Run tests from the backend directory
npm test

# Run tests from the project root
npm run test:backend
```

Test coverage includes:
- `GET /api/health` 200 OK responses with required keys (`name`, `service`, `uptime`, `timestamp`, `database`).
- Sensitive credential leakage prevention.
- Safe handling of database disconnections (HTTP 503).
- Unknown routes returning HTTP 404 with standard error envelopes.
- Malformed JSON request bodies returning HTTP 400.
- Centralized error handler capturing unhandled errors with HTTP 500.
- Production mode hiding internal details and stack traces.

---

## 7. Health Endpoint Specification

### `GET /api/health`

Verifies that the API service is online and tests PostgreSQL connectivity if database credentials are provided.

#### Response 1: Healthy (Database Connected) — `HTTP 200 OK`
```json
{
  "status": "success",
  "data": {
    "service": "CampusSignal API",
    "name": "CampusSignal",
    "api": "healthy",
    "uptime": 45.2,
    "timestamp": "2026-10-28T10:30:00.000Z",
    "database": "connected"
  }
}
```

#### Response 2: Healthy (Database Not Configured / Development Stage) — `HTTP 200 OK`
```json
{
  "status": "success",
  "data": {
    "service": "CampusSignal API",
    "name": "CampusSignal",
    "api": "healthy",
    "uptime": 12.4,
    "timestamp": "2026-10-28T10:30:00.000Z",
    "database": "not_configured"
  }
}
```

#### Response 3: Degraded (Database Configured but Unreachable) — `HTTP 503 Service Unavailable`
```json
{
  "status": "error",
  "message": "Database service unavailable",
  "data": {
    "service": "CampusSignal API",
    "name": "CampusSignal",
    "api": "healthy",
    "uptime": 18.9,
    "timestamp": "2026-10-28T10:30:00.000Z",
    "database": "disconnected"
  }
}
```

---

## 8. Standard Error Responses

### Route Not Found (`HTTP 404`)
```json
{
  "status": "error",
  "error": {
    "status": 404,
    "message": "Resource not found: GET /api/unknown-route"
  },
  "message": "Resource not found: GET /api/unknown-route",
  "details": null
}
```

### Invalid JSON Body (`HTTP 400`)
```json
{
  "status": "error",
  "error": {
    "status": 400,
    "message": "Invalid JSON payload received in request body"
  },
  "message": "Invalid JSON payload received in request body",
  "details": null
}
```

### Database Service Unavailable (`HTTP 503`)
```json
{
  "status": "error",
  "error": {
    "status": 503,
    "message": "Database service is temporarily unavailable"
  },
  "message": "Database service is temporarily unavailable",
  "details": null
}
```

### Internal Server Error (`HTTP 500`)
In production (`NODE_ENV=production`):
```json
{
  "status": "error",
  "error": {
    "status": 500,
    "message": "Internal server error"
  },
  "message": "Internal server error",
  "details": null
}
```
In development (`NODE_ENV=development`), the actual error message and diagnostics are included in `message` and `console.error` for easy debugging.

---

## 9. Security & Best Practices

- **Zero Secret Leaks:** `.env` is never committed; health-checks never expose database hostnames, usernames, or connection URLs.
- **Parameterized Queries:** Use `database.query(sql, [params])` to eliminate SQL injection vulnerabilities.
- **Graceful Shutdown:** `server.js` listens for `SIGTERM` and `SIGINT`, closes the HTTP server, and safely drains the PostgreSQL connection pool.
