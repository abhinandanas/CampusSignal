# CampusSignal – REST API Specification

> [!IMPORTANT]
> **Status: PLANNED, NOT IMPLEMENTED.**  
> The endpoints described below represent the agreed-upon interface contract for the Express backend. No backend routes, controllers, or database handlers have been implemented at this initialization stage.

---

## 1. Overview & Base URL

- **Protocol:** HTTP / HTTPS
- **Data Format:** JSON (`application/json`)
- **Default Base URL (Local Development):** `http://localhost:5000/api`
- **Error Response Standard:**
  All error responses follow this standard envelope:
  ```json
  {
    "status": "error",
    "message": "Human-readable explanation of error",
    "details": null
  }
  ```

---

## 2. Planned Endpoints Specification

### 2.1 System Health Check
- **Endpoint:** `GET /api/health`
- **Purpose:** Verifies that the Express API is online and the PostgreSQL database pool is reachable.
- **Headers:** None required.
- **Request Parameters / Body:** None.
- **Expected Success Response (`200 OK`):**
  ```json
  {
    "status": "success",
    "data": {
      "service": "CampusSignal API",
      "uptime": 124.5,
      "timestamp": "2026-10-28T10:30:00.000Z",
      "database": "connected"
    }
  }
  ```

---

### 2.2 Retrieve Campus Locations
- **Endpoint:** `GET /api/locations`
- **Purpose:** Fetches all registered campus buildings, floors, and specific test zones to populate location selectors in the UI.
- **Query Parameters (Optional):**
  - `building` (string): Filter by building name (e.g., `Library`, `Admin Block`).
  - `is_active` (boolean): Filter active or inactive locations (default: `true`).
- **Expected Success Response (`200 OK`):**
  ```json
  {
    "status": "success",
    "count": 2,
    "data": [
      {
        "id": "loc_01",
        "buildingName": "Academic Block A",
        "floor": 2,
        "zoneName": "ISE Computer Lab 3",
        "description": "Northeast corner near lab server rack",
        "targetAP": "AP-ISE-2F-01",
        "createdAt": "2026-10-20T08:00:00.000Z"
      },
      {
        "id": "loc_02",
        "buildingName": "Central Library",
        "floor": 1,
        "zoneName": "Reading Room B",
        "description": "Quiet study area adjacent to window",
        "targetAP": "AP-LIB-1F-02",
        "createdAt": "2026-10-20T08:00:00.000Z"
      }
    ]
  }
  ```

---

### 2.3 Submit Network Test Measurement
- **Endpoint:** `POST /api/tests`
- **Purpose:** Receives client-measured network telemetry from a student device, validates numerical boundaries, classifies dead-zone status, and saves to PostgreSQL.
- **Headers:** `Content-Type: application/json`
- **Expected Request Body:**
  ```json
  {
    "locationId": "loc_01",
    "downloadSpeedMbps": 14.85,
    "uploadSpeedMbps": 5.40,
    "latencyMs": 42.10,
    "jitterMs": 6.30,
    "packetLossPercent": 0.0,
    "clientDevice": "Chrome 130 / Windows 11",
    "networkSsid": "Campus-Student-5G"
  }
  ```
- **Validation Rules (via `test.validator.js`):**
  - `locationId`: Required, must correspond to a valid location record.
  - `downloadSpeedMbps`: Required, float $\ge 0.0$ and $\le 10000.0$.
  - `uploadSpeedMbps`: Required, float $\ge 0.0$ and $\le 10000.0$.
  - `latencyMs`: Required, float $\ge 0.0$ and $\le 10000.0$.
  - `packetLossPercent`: Optional float between $0.0$ and $100.0$.
- **Expected Success Response (`201 Created`):**
  ```json
  {
    "status": "success",
    "message": "Network test record created successfully",
    "data": {
      "id": "test_987",
      "locationId": "loc_01",
      "downloadSpeedMbps": 14.85,
      "uploadSpeedMbps": 5.40,
      "latencyMs": 42.10,
      "jitterMs": 6.30,
      "qualityCategory": "Good",
      "recordedAt": "2026-10-28T10:35:12.000Z"
    }
  }
  ```
- **Validation Error (`400 Bad Request`):**
  ```json
  {
    "status": "error",
    "message": "Validation failed",
    "details": [
      { "field": "downloadSpeedMbps", "issue": "Value must be a positive number" }
    ]
  }
  ```

---

### 2.4 Query Historical Test Records
- **Endpoint:** `GET /api/tests`
- **Purpose:** Retrieves a paginated and filterable list of historical test records for the Test History page.
- **Query Parameters (Optional):**
  - `locationId` (string): Filter by specific location ID.
  - `quality` (string): Filter by category (`Good`, `Moderate`, `Poor`).
  - `startDate` (ISO 8601 string): Beginning of date range.
  - `endDate` (ISO 8601 string): End of date range.
  - `limit` (integer, default `25`, max `100`): Pagination page size.
  - `page` (integer, default `1`): Pagination offset page.
- **Expected Success Response (`200 OK`):**
  ```json
  {
    "status": "success",
    "pagination": {
      "page": 1,
      "limit": 25,
      "totalRecords": 84,
      "totalPages": 4
    },
    "data": [
      {
        "id": "test_987",
        "locationName": "Academic Block A - ISE Computer Lab 3",
        "downloadSpeedMbps": 14.85,
        "uploadSpeedMbps": 5.40,
        "latencyMs": 42.10,
        "qualityCategory": "Good",
        "recordedAt": "2026-10-28T10:35:12.000Z"
      }
    ]
  }
  ```

---

### 2.5 Dashboard Aggregation Summary
- **Endpoint:** `GET /api/dashboard/summary`
- **Purpose:** Supplies pre-aggregated KPI cards, distribution summaries, and dead-zone counts to populate the Next.js Dashboard widgets in a single round-trip.
- **Request Parameters / Body:** None.
- **Expected Success Response (`200 OK`):**
  ```json
  {
    "status": "success",
    "data": {
      "kpi": {
        "totalTestsRecorded": 1420,
        "avgDownloadSpeedMbps": 21.4,
        "avgUploadSpeedMbps": 8.9,
        "avgLatencyMs": 38.2,
        "identifiedDeadZones": 3
      },
      "qualityDistribution": {
        "goodPercent": 68.5,
        "moderatePercent": 24.2,
        "poorPercent": 7.3
      },
      "criticalDeadZones": [
        {
          "locationId": "loc_09",
          "name": "Hostel 3 Ground Floor Common Room",
          "avgDownloadSpeedMbps": 0.85,
          "avgLatencyMs": 412.0,
          "testCount": 42
        }
      ],
      "recentTests": []
    }
  }
  ```

---

## 3. Dedicated Test-Server Strategy (Throughput Measurement)

> [!NOTE]
> **DCN Engineering Requirement:**  
> Accurate bandwidth calculation requires transferring non-compressible binary data over a sustained time window ($\ge 5 \text{ seconds}$) without application-layer overhead.
>
> 1. **Local Node.js Development:** A dedicated route `/api/tests/ping-chunk` or static binary file inside `public/` can serve as the download payload target.
> 2. **Campus-Wide Deployment:** In a full campus deployment, a standalone, high-speed HTTP static server (e.g., Nginx running on a high-bandwidth LAN switch port) should host standard payload sizes (1MB, 5MB, 10MB) to isolate speed-test traffic from the main application API.
