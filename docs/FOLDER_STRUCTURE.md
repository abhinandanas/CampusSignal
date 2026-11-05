# CampusSignal – Project Directory & File Tree Reference

This document outlines the authoritative project organization, explains the purpose of each directory, and details the active implementation status of files across the CampusSignal codebase.

---

## 1. Directory Tree Overview

```text
CampusSignal/
│
├── frontend/                              # Next.js 16 Client Application
│   ├── app/                               # Next.js App Router Pages & Root Layout
│   │   ├── dashboard/page.js              # /dashboard GIS split-view overview (Abhinandana)
│   │   ├── network-test/page.js           # /network-test benchmark suite (Ankitha)
│   │   ├── locations/page.js              # /locations campus directory (Implemented by Yashwanth)
│   │   ├── history/page.js                # /history route (Pending - Santosh)
│   │   ├── about/page.js                  # /about route (Pending - Santosh)
│   │   ├── favicon.ico                    # Default favicon
│   │   ├── globals.css                    # Tailwind CSS v4 root stylesheet & Signal Atlas theme tokens
│   │   ├── layout.js                      # Root HTML shell & metadata
│   │   └── page.js                        # Home page redirect to /dashboard
│   │
│   ├── components/                        # Modular React UI Components
│   │   ├── common/                        # Reusable base atomic UI elements
│   │   │   ├── Badge.jsx                  # Status indicator badge (Healthy/Weak/Dead Zone/Unmeasured)
│   │   │   ├── Button.jsx                 # Styled accessible button with variants
│   │   │   ├── Card.jsx                   # Container card with crisp borders & GIS styling
│   │   │   ├── EmptyState.jsx             # Visual state when no records exist
│   │   │   ├── Loader.jsx                 # Accessible spinner loading state
│   │   │   └── Modal.jsx                  # Overlay dialog component
│   │   │
│   │   ├── layout/                        # Layout scaffold components
│   │   │   ├── AppLayout.jsx              # Main shell combining Sidebar, Header, MobileNav, and Footer
│   │   │   ├── Header.jsx                 # Sticky header with brand, theme toggle, and mobile menu trigger
│   │   │   ├── MobileNavigation.jsx       # Mobile drawer & fixed bottom navigation bar (Implemented by Yashwanth)
│   │   │   ├── PageContainer.jsx          # Centered content bounds with responsive padding
│   │   │   └── Sidebar.jsx                # Signal Atlas desktop navigation sidebar (Implemented by Yashwanth)
│   │   │
│   │   ├── dashboard/                     # Dashboard view widgets (Abhinandana)
│   │   │   ├── DashboardHeader.jsx        # Summary banner and timestamp
│   │   │   ├── LocationComparison.jsx     # Side-by-side location comparison
│   │   │   ├── MetricCard.jsx             # KPI stat card (Avg Ping, Download, etc.)
│   │   │   ├── PerformanceChart.jsx       # Time-series bandwidth/latency graph
│   │   │   └── RecentTestsTable.jsx       # Tabular list of most recent measurements
│   │   │
│   │   ├── network-test/                  # Speed-test runner UI widgets (Ankitha)
│   │   │   ├── LocationSelector.jsx       # Building & floor dropdown / picker
│   │   │   ├── TestControls.jsx           # Start / Cancel action triggers
│   │   │   ├── TestProgress.jsx           # Live progress meters & gauges
│   │   │   └── TestResults.jsx            # Summary view upon test completion
│   │   │
│   │   ├── locations/                     # Campus location directory widgets (Implemented by Yashwanth)
│   │   │   ├── LocationCard.jsx           # Card showing zone, building, floor, telemetry badge, and actions
│   │   │   ├── LocationFilters.jsx        # Search bar, building selector, floor selector, and reset action
│   │   │   └── LocationList.jsx           # Responsive grid container with loading, error, and empty states
│   │   │
│   │   └── history/                       # Historical telemetry logs (Pending - Santosh)
│   │       ├── HistoryChart.jsx           # Trend analyzer across date ranges
│   │       ├── HistoryFilters.jsx         # Date range and metric filter toolbar
│   │       └── HistoryTable.jsx           # Paginated data table of all tests
│   │
│   ├── hooks/                             # Custom React Hooks
│   │   ├── useLocations.js                # Locations data-fetching & filtering hook (Implemented by Yashwanth)
│   │   └── useNetworkTest.js              # State machine hook for running speed test (Ankitha)
│   │
│   ├── lib/                               # Core client utilities
│   │   ├── constants.js                   # Theme tokens, route links, campus building hierarchy
│   │   └── formatters.js                  # Bandwidth (Mbps), latency (ms), timestamp formatting
│   │
│   ├── services/                          # API Communication Clients
│   │   ├── apiClient.js                   # Shared API fetch client with error normalization (Implemented)
│   │   ├── historyService.js              # Calls /api/tests with query parameters (Pending - Santosh)
│   │   ├── locationService.js             # Calls /api/locations with query filters (Implemented by Yashwanth)
│   │   └── networkTestService.js          # Submits /api/tests payload (Ankitha)
│   │
│   ├── .gitignore                         # Client version control exclusions
│   ├── jsconfig.json                      # Path alias definitions (@/* -> ./*)
│   ├── next.config.mjs                    # Next.js engine configuration
│   └── package.json                       # Next.js package manifest & dependencies
│
├── backend/                               # Node.js / Express REST API (ES Modules)
│   ├── database/
│   │   ├── migrations/
│   │   │   ├── 001_create_tables.sql      # Schema for locations and network_tests tables
│   │   │   └── 002_add_measurement_source.sql # Check constraint for browser vs demo telemetry
│   │   └── seeds/
│   │       └── 001_seed_locations.sql     # Seed records for example campus buildings
│   │
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js                # pg.Pool database connection configuration
│   │   │   └── env.js                     # Environment variable parser & validator
│   │   │
│   │   ├── controllers/                   # HTTP Request Handlers
│   │   │   ├── dashboard.controller.js    # Aggregates KPI summaries for dashboard (Abhinandana)
│   │   │   ├── health.controller.js       # System health and ping check (Santosh)
│   │   │   ├── locations.controller.js    # Locations retrieval controller (Implemented by Yashwanth)
│   │   │   └── tests.controller.js        # Test submission and query handler (Ankitha)
│   │   │
│   │   ├── middleware/                    # Express Middleware Functions
│   │   │   ├── asyncHandler.js            # Async error forwarding wrapper
│   │   │   ├── errorHandler.js            # Global centralized error handling (Santosh)
│   │   │   └── notFound.js                # 404 Route-not-found catcher
│   │   │
│   │   ├── repositories/                  # Database Query Layer (Data Access)
│   │   │   ├── locations.repository.js    # Parameterized SQL for locations table (Implemented by Yashwanth)
│   │   │   └── tests.repository.js        # Parameterized SQL for network_tests table (Ankitha)
│   │   │
│   │   ├── routes/                        # Express Route Definitions
│   │   │   ├── dashboard.routes.js        # /api/dashboard router
│   │   │   ├── health.routes.js           # /api/health router
│   │   │   ├── locations.routes.js        # /api/locations router (Implemented by Yashwanth)
│   │   │   └── tests.routes.js            # /api/tests router
│   │   │
│   │   ├── services/                      # Business Logic Layer
│   │   │   ├── dashboard.service.js       # Computes dead zones & averages
│   │   │   ├── locations.service.js       # Location domain rules & sanitization (Implemented by Yashwanth)
│   │   │   └── networkTest.service.js     # Validates test results & writes records
│   │   │
│   │   ├── validators/                    # Request Payload Validation
│   │   │   └── test.validator.js          # Schema checker for incoming test metrics
│   │   │
│   │   ├── app.js                         # Express app instance, middleware & router mounting
│   │   └── server.js                      # HTTP server listener & graceful shutdown
│   │
│   ├── tests/                             # Unit & Integration test specifications
│   │   ├── api.test.js                    # Core API integration suite (10 tests)
│   │   └── locations.test.js              # Dedicated Locations unit suite (6 tests - Yashwanth)
│   │
│   ├── .env.example                       # Documented backend environment variables
│   ├── .gitignore                         # Backend version control exclusions
│   └── package.json                       # Backend package manifest & scripts
│
├── docs/                                  # Complete Engineering Documentation
│   ├── API_SPECIFICATION.md               # REST API endpoints, schemas, responses
│   ├── ARCHITECTURE.md                    # System architecture & 3-tier layering
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

1. **Routing:** Instead of a single client-side `react-router-dom` switch in `App.jsx`, Next.js uses file-system based routing inside `frontend/app/` (`/dashboard/page.js`, `/network-test/page.js`, `/locations/page.js`, `/history/page.js`, `/about/page.js`).
2. **Path Aliasing:** `jsconfig.json` defines `@/*` pointing to `./*`, permitting modular imports such as `@/components/common/Button`.
3. **Module Ownership:** Yashwanth's implemented modules are fully functional (`/locations`, `LocationCard`, `LocationFilters`, `LocationList`, `Sidebar`, `MobileNavigation`, `useLocations`, `locationService`, and the backend `locations` stack). Unassigned modules by peer team members remain in their respective states to prevent code collisions.
