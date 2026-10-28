# CampusSignal – Project Directory & File Tree Reference

This document outlines the authoritative project organization, explains the rationale behind each directory, and details the future role of all placeholder files.

---

## 1. Directory Tree Overview

```text
CampusSignal/
│
├── frontend/                              # Next.js 15 Client Application
│   ├── app/                               # Next.js App Router Pages & Root Layout
│   │   ├── dashboard/page.js              # /dashboard route placeholder
│   │   ├── network-test/page.js           # /network-test route placeholder
│   │   ├── locations/page.js              # /locations route placeholder
│   │   ├── history/page.js                # /history route placeholder
│   │   ├── about/page.js                  # /about route placeholder
│   │   ├── favicon.ico                    # Default favicon
│   │   ├── globals.css                    # Tailwind CSS v4 root stylesheet
│   │   ├── layout.js                      # Root HTML shell & metadata
│   │   └── page.js                        # Home page entry point
│   │
│   ├── components/                        # Modular React UI Components
│   │   ├── common/                        # Reusable base atomic UI elements
│   │   │   ├── Badge.jsx                  # Status indicator badge (Good/Moderate/Poor)
│   │   │   ├── Button.jsx                 # Styled accessible button
│   │   │   ├── Card.jsx                   # Container card with borders & shadow
│   │   │   ├── EmptyState.jsx             # Visual state when no data exists
│   │   │   ├── Loader.jsx                 # Spinner / skeleton loading state
│   │   │   └── Modal.jsx                  # Overlay dialog component
│   │   │
│   │   ├── layout/                        # Layout scaffold components
│   │   │   ├── AppLayout.jsx              # Shell combining Sidebar + Header + Container
│   │   │   ├── Header.jsx                 # Top header with page title & quick actions
│   │   │   ├── MobileNavigation.jsx       # Bottom/Drawer navigation for small screens
│   │   │   ├── PageContainer.jsx          # Centered content bounds with padding
│   │   │   └── Sidebar.jsx                # Navy desktop navigation sidebar
│   │   │
│   │   ├── dashboard/                     # Dashboard view widgets
│   │   │   ├── DashboardHeader.jsx        # Summary banner and timestamp
│   │   │   ├── LocationComparison.jsx     # Side-by-side location bar/radar chart
│   │   │   ├── MetricCard.jsx             # KPI stat card (Avg Ping, Download, etc.)
│   │   │   ├── PerformanceChart.jsx       # Time-series bandwidth/latency graph
│   │   │   └── RecentTestsTable.jsx       # Tabular list of most recent measurements
│   │   │
│   │   ├── network-test/                  # Speed-test runner UI widgets
│   │   │   ├── LocationSelector.jsx       # Building & floor dropdown / picker
│   │   │   ├── TestControls.jsx           # Start / Cancel / Reset action triggers
│   │   │   ├── TestProgress.jsx           # Radial/linear progress meter & live gauges
│   │   │   └── TestResults.jsx            # Summary view upon test completion
│   │   │
│   │   ├── locations/                     # Campus location directory widgets
│   │   │   ├── LocationCard.jsx           # Grid card summarizing single zone
│   │   │   ├── LocationFilters.jsx        # Building search & dead-zone toggle
│   │   │   └── LocationList.jsx           # Responsive grid/list container
│   │   │
│   │   └── history/                       # Historical telemetry logs
│   │       ├── HistoryChart.jsx           # Trend analyzer across date ranges
│   │       ├── HistoryFilters.jsx         # Date range and metric filter toolbar
│   │       └── HistoryTable.jsx           # Paginated data table of all tests
│   │
│   ├── hooks/                             # Custom React Hooks
│   │   ├── useLocations.js                # Fetch and filter campus locations hook
│   │   └── useNetworkTest.js              # State machine hook for running speed test
│   │
│   ├── lib/                               # Core client utilities
│   │   ├── constants.js                   # Thresholds, routes, status tokens
│   │   └── formatters.js                  # Bandwidth (Mbps), latency (ms), date formatting
│   │
│   ├── public/                            # Static public web assets
│   │   ├── assets/
│   │   │   └── .gitkeep
│   │   └── favicon-placeholder.txt
│   │
│   ├── services/                          # API Communication Clients
│   │   ├── apiClient.js                   # Base fetch / Axios wrapper with base URL
│   │   ├── historyService.js              # Calls /api/tests with query parameters
│   │   ├── locationService.js             # Calls /api/locations
│   │   └── networkTestService.js          # Submits /api/tests payload
│   │
│   ├── src/assets/                        # Compatibility alias for source assets
│   │   └── .gitkeep
│   │
│   ├── .env.example                       # Documented client environment variables
│   ├── .gitignore                         # Client version control exclusions
│   ├── jsconfig.json                      # Path alias definitions (@/* -> ./*)
│   ├── next.config.mjs                    # Next.js engine configuration
│   └── package.json                       # Next.js package manifest & dependencies
│
├── backend/                               # Node.js / Express REST API
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js                # pg.Pool database connection config
│   │   │   └── env.js                     # Environment variable parser & validator
│   │   │
│   │   ├── controllers/                   # HTTP Request Handlers
│   │   │   ├── dashboard.controller.js    # Aggregates KPI summaries for dashboard
│   │   │   ├── health.controller.js       # System health and ping check
│   │   │   ├── locations.controller.js    # CRUD / retrieval of campus locations
│   │   │   └── tests.controller.js        # Test submission and query handler
│   │   │
│   │   ├── middleware/                    # Express Middleware Functions
│   │   │   ├── errorHandler.js            # Global centralized error handling
│   │   │   └── notFound.js                # 404 Route-not-found catcher
│   │   │
│   │   ├── repositories/                  # Database Query Layer (Data Access)
│   │   │   ├── locations.repository.js    # SQL queries for `locations` table
│   │   │   └── tests.repository.js        # SQL queries for `network_tests` table
│   │   │
│   │   ├── routes/                        # Express Route Definitions
│   │   │   ├── dashboard.routes.js        # /api/dashboard router
│   │   │   ├── health.routes.js           # /api/health router
│   │   │   ├── locations.routes.js        # /api/locations router
│   │   │   └── tests.routes.js            # /api/tests router
│   │   │
│   │   ├── services/                      # Business Logic Layer
│   │   │   ├── dashboard.service.js       # Computes dead zones & averages
│   │   │   ├── locations.service.js       # Location domain rules
│   │   │   └── networkTest.service.js     # Validates test results & writes records
│   │   │
│   │   ├── validators/                    # Request Payload Validation
│   │   │   └── test.validator.js          # Schema checker for incoming test metrics
│   │   │
│   │   ├── app.js                         # Express app instance, middleware & routing
│   │   └── server.js                      # HTTP server listener & graceful shutdown
│   │
│   ├── tests/                             # Unit & Integration test specifications
│   │   └── .gitkeep
│   │
│   ├── .env.example                       # Documented backend environment variables
│   ├── .gitignore                         # Backend version control exclusions
│   └── package.json                       # Backend package manifest & scripts
│
├── docs/                                  # Complete Engineering Documentation
│   ├── API_SPECIFICATION.md               # REST API endpoints, schemas, responses
│   ├── ARCHITECTURE.md                    # System architecture & network flow
│   ├── DATABASE_PLAN.md                   # PostgreSQL entity-relationship model
│   ├── FOLDER_STRUCTURE.md                # This directory reference document
│   ├── PROJECT_OVERVIEW.md                # Academic context, problem & objectives
│   ├── TEAM_RESPONSIBILITIES.md           # Role allocations for student team
│   └── UI_DESIGN_GUIDELINES.md            # Design tokens, color palette, responsive rules
│
├── .editorconfig                          # Cross-editor formatting consistency
├── .gitattributes                         # Git line-ending normalization rules
├── .gitignore                             # Workspace-level version control exclusions
├── package.json                           # Root coordinator package manifest
└── README.md                              # Main project documentation & setup guide
```

---

## 2. Adaptation Notes: Next.js App Router Architecture

In accordance with team preferences to employ **Next.js (React 19)** rather than a generic Vite bundle:
1. **Routing:** Instead of a single client-side `react-router-dom` switch in `App.jsx`, Next.js uses file-system based routing inside `frontend/app/` (`/dashboard/page.js`, `/network-test/page.js`, `/locations/page.js`, `/history/page.js`, `/about/page.js`).
2. **Path Aliasing:** `jsconfig.json` defines `@/*` pointing to `./*`, permitting modular imports such as `@/components/common/Button` without complex relative paths (`../../`).
3. **Strict Placeholder Rule:** All component files (`.jsx`) and route files (`page.js`) currently exist as empty files. No implementation code or mock data has been prematurely inserted.

---

## 3. Backend Layering Pattern (Controller-Service-Repository)

The backend follows a classic 3-tier enterprise architecture:
- **Routes:** Map incoming HTTP URLs and methods to specific controllers.
- **Middleware:** Intercept requests for validation, logging, and CORS security.
- **Controllers:** Extract request parameters, invoke service logic, and serialize HTTP responses.
- **Services:** Contain business rules (e.g., classifying a measurement as a "Dead Zone").
- **Repositories:** Abstract raw SQL statements from business logic using parameterized queries.
