# CampusSignal – Wi-Fi Dead-Zone Mapper
## Project Overview & Initiation Document

**Team Name:** SignalX  
**Academic Context:** 3rd Year Information Science and Engineering (ISE) — Data Communication & Networking (DCN) Mini-Project  
**Status:** Core Locations Module & Signal Atlas Design System Implemented

---

## 1. Team Members & Roles

| Name | USN | Core Responsibility Area |
| :--- | :--- | :--- |
| **Abhinandana S** | 4SF24IS002 | Frontend Architecture, Next.js UI Design & Layouts, Dashboard Module |
| **Ankitha GR** | 4SF24IS015 | Network-Testing Research, Measurement Engine, Database Migrations |
| **Yashwanth** | 4SF24IS124 | Campus Locations Module (Full-Stack), Signal Atlas Theme & Navigation |
| **Santosh** | 4SF24IS100 | Quality Assurance, Testing Strategy, History & About Modules |

---

## 2. Problem Statement

Across college campuses, students, faculty, and research scholars frequently encounter weak, erratic, or completely non-existent Wi-Fi connectivity in specific buildings, lecture halls, labs, and outdoor areas. These "dead zones" impede academic productivity, disrupt online lab submissions, and degrade the overall digital learning experience.

Currently, campus IT management lacks an empirical, crowd-sourced visibility tool to pinpoint exact locations of network degradation. Network assessments are either conducted infrequently using specialized handheld hardware or based solely on anecdotal complaints that lack technical telemetry (latency, packet loss, bandwidth).

**CampusSignal** bridges this gap by providing an intuitive, web-based platform allowing students and staff to measure real-time network performance from any connected device at their current campus location, compile telemetry into a centralized database, and present actionable analytical dashboards for infrastructure improvements.

---

## 3. Project Objectives

1. **Location-Centric Telemetry:** Enable students to select their current campus building, floor, and zone to attribute measurements accurately to the physical 802.11 Access Point (AP) topology.
2. **Standardized Measurement Suite:**
   - **Download Speed:** Measure sustained payload transfer rates from a known server endpoint.
   - **Upload Speed:** Measure payload transmission speeds from the client to the server endpoint.
   - **Round-Trip Time (Latency/Ping):** Measure HTTP/TCP response times over multiple samples to compute average latency and jitter.
3. **Relational Record Keeping:** Store structured test records linked to campus locations with timestamps, user agent data, and network metrics.
4. **Actionable Visual Observability:**
   - Interactive GIS-inspired Dashboard with campus building footprint.
   - Visual highlighting of identified "dead zones" (areas with consistently poor signal).
   - Location-by-location directory and comparison to prioritize access point installations.
   - Historical trend analysis over hours, days, and weeks.
5. **Academic Rigor:** Serve as a practical study of Data Communication and Networking (DCN) principles including TCP/IP stack behavior, client-server latency, throughput bottlenecks, and web performance metrics.

---

## 4. Main Features

- **Signal Atlas Campus Dashboard:** Real-time KPI summaries, campus overview metrics, and split-view GIS schematic layout.
- **Campus Locations Directory (`/locations`):** Comprehensive campus directory supporting search by zone name, building filter, floor level filter, and empirical performance badges.
- **Network Benchmark Engine (`/network-test`):** Client-side measurement suite calculating download speed, upload speed, round-trip ping latency, and jitter.
- **Historical Telemetry (`/history`):** Relational archive of recorded network tests with filtering by date, status category, and location.
- **Signal Atlas Design System:** Clean, crisp GIS-inspired cartographic theme with white surfaces, subtle borders (`#E4E8EC`), terracotta accent (`#B84C3A`), healthy indicator (`#39836A`), and weak indicator (`#D5A342`).

---

## 5. Technology Stack Summary

- **Frontend:** Next.js 16 (React 19, App Router, JavaScript / JSX), Tailwind CSS v4, Lucide React (icons), Recharts (visualization).
- **Backend:** Node.js (v20+), Express.js (REST API, ES modules), CORS, dotenv, pg (node-postgres client driver).
- **Database:** PostgreSQL (Relational database with schema for campus locations and network test metrics).
- **Tooling:** npm, Node test runner (`node:test`), Git, VS Code, ESLint.

---

## 6. Yashwanth's Assigned Responsibilities: Locations Module & Navigation

As a full-stack engineer in Team SignalX, Yashwanth was assigned end-to-end responsibility for the **Campus Locations Module**, the **Signal Atlas Navigation Shell**, and associated system documentation:

### Frontend Responsibilities
1. **Campus Locations Page (`frontend/app/locations/page.js`):** Responsive directory displaying campus buildings, floors, and physical test zones with search, dynamic filters, loading skeletons, error banners, and empty states.
2. **Location Card (`frontend/components/locations/LocationCard.jsx`):** Reusable card presenting zone name, building name, floor level, notes, empirical Wi-Fi performance status, selected state, and direct benchmark actions.
3. **Location List (`frontend/components/locations/LocationList.jsx`):** Responsive grid container managing empty search states, server error displays, and selection tracking.
4. **Location Filters (`frontend/components/locations/LocationFilters.jsx`):** Search bar, dynamic building dropdown, floor level dropdown, and instant filter reset.
5. **Sidebar Navigation (`frontend/components/layout/Sidebar.jsx`):** Desktop GIS-inspired navigation sidebar with terracotta brand accents, active route indication, and telemetry status.
6. **Mobile Navigation (`frontend/components/layout/MobileNavigation.jsx`):** Mobile thumb-friendly bottom bar and slide-out navigation drawer with accessible controls and automatic route dismissal.
7. **Locations Hook (`frontend/hooks/useLocations.js`):** Reusable data-fetching hook managing loading, error, request debouncing, and `AbortController` cancellation.
8. **Location Service (`frontend/services/locationService.js`):** Decoupled HTTP client querying Express `/api/locations` and normalizing metadata.

### Backend Responsibilities
1. **Locations Route (`backend/src/routes/locations.routes.js`):** `GET /api/locations` with optional query parameters (`building`, `floor`, `search`) and `GET /api/locations/:id`.
2. **Locations Controller (`backend/src/controllers/locations.controller.js`):** Query extraction, input validation (e.g. non-integer floor rejection), and standardized JSON envelope serialization.
3. **Locations Service (`backend/src/services/locations.service.js`):** Business logic coordination, string length sanitization, and numerical range boundaries.
4. **Locations Repository (`backend/src/repositories/locations.repository.js`):** Parameterized SQL queries preventing SQL injection, joined with lateral subqueries against `network_tests` to surface real empirical performance data.
5. **PostgreSQL Integration:** Query binding using the project's existing `pg.Pool` connection pool without altering database migrations or inventing unmapped columns.
