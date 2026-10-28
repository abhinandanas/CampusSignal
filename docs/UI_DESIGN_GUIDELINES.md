# CampusSignal – UI Design Guidelines & Style Guide

## Visual Direction: Professional Observability & Network Telemetry

The design aesthetic of CampusSignal reflects modern cloud observability and network monitoring platforms (inspired by tools such as Datadog, Grafana Cloud, and Cloudflare Radar). The interface balances high data density with visual clarity, accessible contrast, and an authoritative aesthetic.

---

## 1. Design Tokens & Color Palette

The following tokens establish the visual foundation for future Tailwind utility application in Phase 5:

| Token Name | Hex Code | Role & Usage |
| :--- | :--- | :--- |
| **`navy-primary`** | `#101828` | Left-hand desktop navigation sidebar, brand headings, dark mode accents |
| **`blue-brand`** | `#2563EB` | Primary interaction buttons, active navigation item pill, primary chart line |
| **`cyan-accent`** | `#06B6D4` | Uplink metrics, speed test progress rings, vibrant interactive highlights |
| **`bg-canvas`** | `#F5F7FB` | Main application background (subtle light gray-blue, reducing glare) |
| **`bg-card`** | `#FFFFFF` | Surface color for metric cards, data tables, and chart containers |
| **`text-primary`** | `#172033` | Page titles, primary numerical figures, table headers |
| **`text-muted`** | `#667085` | Subtitles, measurement units (`Mbps`, `ms`), timestamps, metadata |
| **`border-subtle`**| `#E4E7EC` | Card borders, table dividers, input borders |
| **`status-good`** | `#16A34A` | Good Wi-Fi quality ($\ge 15 \text{ Mbps}$, latency $< 50 \text{ ms}$) |
| **`status-mod`** | `#D97706` | Moderate quality ($5\text{–}15 \text{ Mbps}$, latency $50\text{–}150 \text{ ms}$) |
| **`status-poor`** | `#DC2626` | Dead Zone / Poor connectivity ($< 5 \text{ Mbps}$, latency $> 150 \text{ ms}$) |

---

## 2. Typography & Hierarchical Scale

- **Primary Font Family:** Clean modern sans-serif (Inter, Roboto, or system `-apple-system, BlinkMacSystemFont, 'Segoe UI'`).
- **Hierarchy:**
  - **Display / Hero Numbers:** `32px` to `40px`, Semi-bold (`font-semibold`), Tracking tight (used for speed gauges and KPI cards).
  - **Page Titles (H1):** `24px` (`text-2xl`), Bold (`font-bold`), color `#172033`.
  - **Section / Card Headers (H2):** `16px` to `18px`, Semi-bold, color `#172033`.
  - **Body / Table Content:** `14px` (`text-sm`), Regular (`font-normal`), color `#172033`.
  - **Badges & Microcopy:** `12px` (`text-xs`), Medium (`font-medium`), uppercase tracking for statuses.

---

## 3. Planned Layout Structures

### 3.1 Global Application Shell (`AppLayout.jsx`)
- **Desktop Layout:**
  - Fixed-width dark navy sidebar (`#101828`) on the left (`260px`).
  - Branded header at top of main panel (`64px` height) containing page breadcrumbs, current campus Wi-Fi network badge, and a high-visibility `"Run Test"` primary action button.
  - Scrollable content viewport with `#F5F7FB` background and generous padding (`p-6` to `p-8`).
- **Mobile / Tablet Layout:**
  - Sidebar collapses off-canvas into a hamburger menu or transforms into a sleek bottom navigation bar (`MobileNavigation.jsx`).
  - Header displays a compact logo and condensed action button.

---

### 3.2 Dashboard Page Layout (`/dashboard`)
1. **Summary Banner:** Campus health status overview with timestamp of last updated telemetry.
2. **KPI Metric Row (4 Cards):**
   - *Average Download Speed* (with trend indicator vs campus average).
   - *Average Upload Speed*.
   - *Average Round-Trip Latency (Ping)*.
   - *Total Network Tests Logged* (and count of identified Dead Zones).
3. **Performance Chart:** Dual-axis Recharts time-series displaying throughput (Mbps) and latency (ms) over time.
4. **Campus Location Comparison:** Horizontal bar chart comparing average speeds across academic blocks.
5. **Recent Tests Table:** Clean tabular view with columns: Location, Download, Upload, Latency, Quality Badge, Time.
6. **Zero-Data State:** If no tests have been recorded, show an `EmptyState` component encouraging the user to run their first test instead of displaying misleading `0.00` statistics.

---

### 3.3 Network Test Page Layout (`/network-test`)
1. **Location Selection Card:**
   - Dropdown for Building (e.g., *Library, Academic Block A, Cafeteria*).
   - Dropdown for Floor and Specific Zone/Room.
2. **Interactive Measurement Stage:**
   - High-contrast radial gauge or linear progress meter (`TestProgress.jsx`).
   - Current stage indicators: *Connecting* $\rightarrow$ *Ping Test* $\rightarrow$ *Download Stream* $\rightarrow$ *Upload Stream* $\rightarrow$ *Finalizing*.
   - Live numerical counters updating smoothly during active payload transfer.
3. **Test Controls:**
   - Prominent `"Start Speed Test"` button.
   - Graceful cancellation (`"Cancel Test"`) handling without corrupting state.
4. **Result Summary:**
   - Color-coded classification banner (*"Good Network Coverage"* in green, or *"Campus Wi-Fi Dead-Zone Identified"* in red).
   - Direct button to save result to the database or trigger another run.

---

### 3.4 Campus Locations Page Layout (`/locations`)
1. **Filter Toolbar:** Search input for room names, building selector pills, and a checkbox filter to `"Show Only Dead-Zones"`.
2. **Location Cards Grid:**
   - Cards displaying Building name, Floor, Room, Associated Access Point.
   - Average metrics tag (e.g., `Avg Download: 18.2 Mbps | Ping: 32 ms`).
   - Pill badge: `Healthy Coverage`, `Intermittent`, or `Dead Zone`.
   - *"Insufficient Data"* warning if fewer than 3 tests have been recorded.

---

## 4. Component Naming & Architectural Standards

- **Folder Names:** Lowercase kebab-case or category name (`components/network-test`, `components/common`).
- **Component File Names:** Strict PascalCase (`Button.jsx`, `MetricCard.jsx`, `PerformanceChart.jsx`).
- **State Props:** Clean, predictable prop contracts (`isLoading`, `hasError`, `data`, `onRetry`).
- **Accessibility (a11y):**
  - Minimum contrast ratio of 4.5:1 for normal text against backgrounds.
  - Interactive elements must retain visible keyboard focus rings (`focus:ring-2 focus:ring-blue-500`).
  - Meaningful `aria-label` attributes on icon-only buttons.
  - Semantic HTML tags (`<nav>`, `<header>`, `<main>`, `<section>`, `<article>`).

---

## 5. Responsive Breakpoint Rules

| Breakpoint | Width | Behavior |
| :--- | :--- | :--- |
| **Mobile (`sm`)** | $< 768\text{px}$ | Sidebar hidden; bottom navigation bar; 1-column card stack; horizontally scrollable tables. |
| **Tablet (`md`)** | $768\text{px} - 1024\text{px}$ | 2-column metric cards; condensed table padding; sidebar collapsible via toggle. |
| **Desktop (`lg` / `xl`)** | $> 1024\text{px}$ | Full fixed sidebar; 4-column metric cards; full-width comparison charts and data tables. |
