# CampusSignal Backend

Node.js 20+, Express, and PostgreSQL API for CampusSignal. The backend follows **routes → controllers → services → repositories**: routes map URLs, controllers shape HTTP responses, services classify and coordinate work, and repositories contain parameterized PostgreSQL queries. Central middleware formats unknown routes and errors.

## Endpoints

All endpoints are under `http://localhost:5000/api` and use JSON. Successful data endpoints use `status: "success"` and `data`; errors use `status: "error"`, `message`, and optional `details`.

| Method and path | Purpose |
|---|---|
| `GET /health` | Server and database status. Returns HTTP 200 with `status: success` or `degraded`. |
| `GET /locations` | Lists database locations as `{ status, count, data }`. |
| `POST /tests` | Validates, classifies, and persists a measurement; returns 201 only after insert succeeds. |
| `GET /tests?locationId=1&status=weak&limit=10&offset=0` | Newest-first history with validated filters and pagination. |
| `GET /tests/:id` | Retrieves one test, or 400/404 for invalid/missing IDs. |
| `GET /dashboard/summary` | Database totals and Good/Fair/Weak counts plus average download speed. |

Example submission:

```powershell
$body = @{ locationId = 1; downloadMbps = 42.5; uploadMbps = 18.2; latencyMs = 35; measurementSource = 'browser' } | ConvertTo-Json
Invoke-RestMethod -Uri http://localhost:5000/api/tests -Method Post -ContentType 'application/json' -Body $body
```

The server determines status: `good` at 25 Mbps or above, `fair` from 10 to below 25, and `weak` below 10. Valid sources are `browser` and `demo`. Database errors return a generic JSON 500 response and never claim a measurement was saved.

## Configuration and startup (Windows PowerShell)

Set `PORT` (optional, default `5000`), `FRONTEND_ORIGIN` (default `http://localhost:3000`), and PostgreSQL credentials. Use either `DATABASE_URL` or the existing `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, and `DB_PASSWORD` settings. `DATABASE_SSL` defaults to `false`; pool size and timeout settings are optional. Copy the sample and edit credentials locally:

```powershell
Copy-Item .env.example .env
npm install
npm start
```

For auto-reload during development, use `npm run dev`. Do not commit `.env` or credentials.

## Tests

```powershell
npm test
```

Tests use Node's built-in test runner and injected services, so endpoint validation and error behavior run without PostgreSQL. Repository SQL and real database operations require a configured PostgreSQL instance.

## Database owner prerequisites

The API does not create or alter tables, seed locations, or install PostgreSQL. The separate database owner must provide PostgreSQL 14+, a reachable database named `campus_signal` (or set another database in `DATABASE_URL`), and the tables defined in `../docs/DATABASE_PLAN.md`: `locations` (`id`, `name`, `description`, `created_at`) and `network_tests` (`id`, `location_id`, `download_mbps`, `upload_mbps`, `latency_ms`, `status`, `measurement_source`, `created_at`) with the documented foreign key and constraints. At least one location must exist to submit a test. Until `DATABASE_URL` and that schema are available, health reports the database as disconnected and data endpoints return safe server errors.

The current schema has only a location `name` and `description`; it does not contain separate building, floor, and zone columns. The locations response retains those database fields. The frontend selector currently filters for `buildingName`, `floor`, and `zoneName`, so the database and frontend owners should agree on a mapping/schema extension before expecting those selectors to populate reliably.
