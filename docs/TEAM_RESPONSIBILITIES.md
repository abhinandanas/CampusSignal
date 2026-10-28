# CampusSignal – Team Responsibilities & Task Allocation
## Team SignalX | 3rd Year ISE DCN Mini-Project

This document outlines the proposed division of engineering responsibilities among team members for the development of the CampusSignal application. All assignments are subject to team consensus, and all members actively participate in architectural reviews, system integration, and final physical field testing on campus.

---

## 1. Member Task Breakdown

### Abhinandana S (4SF24IS002) — Frontend Architecture & UI Design
- **Primary Domain:** Next.js 15 Client Application, Styling & User Experience.
- **Key Responsibilities:**
  - Build out the component hierarchy (`AppLayout`, `Sidebar`, `Header`, `PageContainer`).
  - Implement reusable atomic elements (`Card`, `Badge`, `Button`, `Loader`, `EmptyState`) according to `UI_DESIGN_GUIDELINES.md`.
  - Assemble the responsive Dashboard layout, Test Runner page, Locations browser, and Test History screens.
  - Integrate Recharts visualization components with telemetry data.
  - Implement mobile navigation and accessibility standards.

---

### Ankitha GR (4SF24IS015) — Network-Testing Research & Measurement Engine
- **Primary Domain:** Client-Side Network Telemetry, Browser APIs & DCN Accuracy.
- **Key Responsibilities:**
  - Research and formulate client-side speed measurement algorithms (chunked HTTP GET/POST versus WebSocket streams).
  - Implement the `useNetworkTest.js` state hook and `networkTestService.js`.
  - Evaluate clock precision using `performance.now()` to accurately measure millisecond-level Round-Trip Time (RTT / Ping) and jitter.
  - Define network dead-zone categorization thresholds (e.g., threshold ratios between download throughput and latency).
  - Conduct calibration experiments across multiple Wi-Fi access points to account for RF interference and client device variances.

---

### Yashwanth (4SF24IS124) — Backend Architecture & Database Engineering
- **Primary Domain:** Node.js / Express REST API & PostgreSQL Data Layer.
- **Key Responsibilities:**
  - Implement the Express server lifecycle (`app.js`, `server.js`) with CORS, routing, and centralized error handling middleware.
  - Set up PostgreSQL schema migrations and database connection pooling using the `pg` client driver.
  - Implement database repositories (`locations.repository.js`, `tests.repository.js`) utilizing parameterized queries to guarantee SQL injection immunity.
  - Build validation schemas (`test.validator.js`) to sanitize and reject anomalous or out-of-bounds telemetry payloads.
  - Implement query aggregations for dashboard analytics (`AVG()`, `COUNT()`, dead-zone groupings).

---

### Santosh (4SF24IS100) — Quality Assurance, Testing Strategy & Dashboard Requirements
- **Primary Domain:** System Testing, Dashboard Requirements & Academic Documentation.
- **Key Responsibilities:**
  - Formulate end-to-end testing scenarios simulating edge cases (e.g., sudden Wi-Fi disconnection mid-test, zero-data campus zones, slow 2G fallback).
  - Define product requirements and filtering parameters for the Historical Telemetry and Campus Location directory.
  - Maintain project documentation, sync API contracts between frontend and backend, and verify conformance with DCN syllabus goals.
  - Organize integration test protocols and author the final project presentation and evaluation report.

---

## 2. Collaborative Responsibilities

While technical duties are specialized, the following milestones require full team collaboration:
1. **API Contract Verification:** Periodic review of `API_SPECIFICATION.md` to ensure frontend service signatures match backend controller responses.
2. **Campus Field Trials:** Conducting physical walk-around testing with laptops and smartphones across different campus buildings to collect real telemetry.
3. **Code Reviews:** Peer reviews of pull requests before merging new feature branches into `main`.
4. **Final Presentation:** Collective demonstration of the live dead-zone mapper to academic evaluators.
