"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Radio,
  Wifi,
  MapPin,
  History,
  Info,
  Layers,
  Activity,
  Server,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import CampusMap from "@/components/dashboard/CampusMap";
import PerformancePanel from "@/components/dashboard/PerformancePanel";
import LocationComparison from "@/components/dashboard/LocationComparison";
import PerformanceChart from "@/components/dashboard/PerformanceChart";
import RecentTestsTable from "@/components/dashboard/RecentTestsTable";

/**
 * Main CampusSignal Dashboard Page
 * Implements the Signal Atlas theme split-view architecture:
 * - 40% Left Panel: Performance telemetry, selected building/floor details & Run Test CTA
 * - 60% Right Panel: Interactive GIS-style Schematic Campus Map with multi-floor controls
 */
export default function DashboardPage() {
  // Campus Buildings Registry
  const campusBuildings = [
    {
      id: "bldg_block_a",
      name: "Academic Block A",
      floors: [0, 1, 2, 3, 4],
      defaultRoomId: "loc_01",
    },
    {
      id: "bldg_library",
      name: "Central Library",
      floors: [0, 1, 2, 3],
      defaultRoomId: "loc_05",
    },
    {
      id: "bldg_tech_tower",
      name: "Technology Tower",
      floors: [0, 1, 2, 3, 4, 5],
      defaultRoomId: "loc_09",
    },
    {
      id: "bldg_student_hub",
      name: "Student Hub & Cafeteria",
      floors: [0, 1],
      defaultRoomId: "loc_13",
    },
  ];

  // Active state management
  const [selectedBuildingId, setSelectedBuildingId] = useState("bldg_block_a");
  const [selectedFloor, setSelectedFloor] = useState(2);
  const [filterMode, setFilterMode] = useState("all");
  const [backendHealth, setBackendHealth] = useState({
    status: "checking",
    database: "checking",
  });

  const selectedBuilding =
    campusBuildings.find((b) => b.id === selectedBuildingId) ||
    campusBuildings[0];

  const [selectedLocation, setSelectedLocation] = useState({
    id: "loc_01",
    name: "ISE Lab 3",
    building: "Academic Block A",
    floor: 2,
    targetAp: "AP-ISE-2F-01",
    downloadSpeed: 18.45,
    uploadSpeed: 8.2,
    latency: 38.5,
    jitter: 4.2,
    lastTest: "3 mins ago",
    status: "healthy",
  });

  // Check backend health asynchronously
  useEffect(() => {
    async function checkApiHealth() {
      try {
        const res = await fetch("http://localhost:5000/api/health");
        if (res.ok) {
          const data = await res.json();
          setBackendHealth({
            status: data?.data?.api || "healthy",
            database: data?.data?.database || "connected",
          });
        } else {
          setBackendHealth({ status: "offline", database: "disconnected" });
        }
      } catch (err) {
        setBackendHealth({ status: "offline", database: "not_configured" });
      }
    }
    checkApiHealth();
  }, []);

  // Handler for selecting a building on the map or dropdown
  const handleSelectBuilding = (bldgId) => {
    setSelectedBuildingId(bldgId);
    const bldg = campusBuildings.find((b) => b.id === bldgId);
    if (bldg && !bldg.floors.includes(selectedFloor)) {
      setSelectedFloor(bldg.floors[0] || 0);
    }
  };

  // Handler for clicking a specific room on the GIS map
  const handleSelectLocation = (room, buildingId) => {
    if (buildingId) {
      setSelectedBuildingId(buildingId);
    }
    setSelectedFloor(room.fl);

    let speedVal = 18.45;
    if (room.speed) {
      speedVal = parseFloat(room.speed.replace(" Mbps", "")) || 18.45;
    }

    setSelectedLocation({
      id: room.id,
      name: room.name,
      building:
        campusBuildings.find((b) => b.id === (buildingId || selectedBuildingId))
          ?.name || "Academic Block A",
      floor: room.fl,
      targetAp: `AP-${room.id.toUpperCase()}`,
      downloadSpeed: speedVal,
      uploadSpeed: Number((speedVal * 0.42).toFixed(1)),
      latency: room.status === "poor" ? 280 : room.status === "weak" ? 95 : 32,
      jitter: room.status === "poor" ? 18.5 : 3.8,
      lastTest: "Just now",
      status: room.status,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--atlas-bg)] text-[var(--atlas-text-primary)]">
      {/* ── Global Signal Atlas Navigation Bar ── */}
      <nav className="sticky top-0 z-30 bg-[var(--atlas-card)] border-b border-[var(--atlas-border)] px-4 py-2.5 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center gap-2.5 group">
              <div className="flex items-center justify-center w-8 h-8 rounded bg-[var(--atlas-terracotta)] text-white shadow-2xs group-hover:bg-[var(--atlas-terracotta-hover)] transition-colors">
                <Radio className="w-4 h-4" strokeWidth={2.4} />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm tracking-tight text-[var(--atlas-text-primary)]">
                  CampusSignal
                </span>
                <span className="text-[10px] font-mono tracking-wider text-[var(--atlas-terracotta)] font-semibold uppercase">
                  Signal Atlas
                </span>
              </div>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-1 text-xs font-medium">
              <Link
                href="/dashboard"
                className="px-3 py-1.5 rounded-md bg-[var(--atlas-terracotta-subtle)] text-[var(--atlas-terracotta)] font-semibold border border-[var(--atlas-terracotta)]/20"
              >
                Dashboard
              </Link>
              <Link
                href="/network-test"
                className="px-3 py-1.5 rounded-md text-[var(--atlas-text-secondary)] hover:text-[var(--atlas-text-primary)] hover:bg-[var(--atlas-map-bg)] transition-colors"
              >
                Speed Test
              </Link>
              <Link
                href="/locations"
                className="px-3 py-1.5 rounded-md text-[var(--atlas-text-secondary)] hover:text-[var(--atlas-text-primary)] hover:bg-[var(--atlas-map-bg)] transition-colors"
              >
                Locations
              </Link>
              <Link
                href="/history"
                className="px-3 py-1.5 rounded-md text-[var(--atlas-text-secondary)] hover:text-[var(--atlas-text-primary)] hover:bg-[var(--atlas-map-bg)] transition-colors"
              >
                Test History
              </Link>
              <Link
                href="/about"
                className="px-3 py-1.5 rounded-md text-[var(--atlas-text-secondary)] hover:text-[var(--atlas-text-primary)] hover:bg-[var(--atlas-map-bg)] transition-colors"
              >
                About
              </Link>
            </div>
          </div>

          {/* Right: Backend & DB Status Pills */}
          <div className="flex items-center gap-2 text-xs">
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded bg-[var(--atlas-map-bg)] border border-[var(--atlas-border)] text-[var(--atlas-text-secondary)] font-mono text-[11px]">
              <Server className="w-3.5 h-3.5 text-[var(--atlas-text-secondary)]" />
              <span>API:</span>
              <span
                className={`font-semibold ${
                  backendHealth.status === "healthy"
                    ? "text-[var(--atlas-healthy)]"
                    : "text-[var(--atlas-weak)]"
                }`}
              >
                {backendHealth.status}
              </span>
            </div>

            <Link
              href="/network-test"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[var(--atlas-terracotta)] hover:bg-[var(--atlas-terracotta-hover)] text-white text-xs font-semibold shadow-2xs transition-all"
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Run Test</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Contextual Filter & Campus Header ── */}
      <DashboardHeader
        activeFilter={filterMode}
        onFilterChange={setFilterMode}
        buildingCount={campusBuildings.length}
        totalLocations={18}
        deadZoneCount={3}
        onRefresh={() => {}}
      />

      {/* ── MAIN DASHBOARD VIEWPORT ── */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 flex flex-col gap-6">
        {/* ── SPLIT VIEW SECTION: Left 40% Telemetry | Right 60% Interactive GIS Map ── */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Left Side: ~40% width on desktop (5 of 12 columns) */}
          <div className="lg:col-span-5 flex flex-col h-full">
            <PerformancePanel
              selectedBuilding={selectedBuilding}
              selectedFloor={selectedFloor}
              selectedLocation={selectedLocation}
            />
          </div>

          {/* Right Side: ~60% width on desktop (7 of 12 columns) */}
          <div className="lg:col-span-7 flex flex-col h-full">
            <CampusMap
              buildings={campusBuildings}
              selectedBuilding={selectedBuilding}
              selectedFloor={selectedFloor}
              selectedLocation={selectedLocation}
              onSelectBuilding={handleSelectBuilding}
              onSelectFloor={setSelectedFloor}
              onSelectLocation={handleSelectLocation}
              filterMode={filterMode}
            />
          </div>
        </section>

        {/* ── ANALYTICS & COMPARISONS ROW ── */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <LocationComparison />
          <PerformanceChart />
        </section>

        {/* ── RECENT TELEMETRY TABLE ── */}
        <section>
          <RecentTestsTable />
        </section>
      </main>

      {/* ── Academic Footer ── */}
      <footer className="mt-auto border-t border-[var(--atlas-border)] bg-[var(--atlas-card)] py-4 px-6 text-center text-xs text-[var(--atlas-text-secondary)]">
        <p>
          CampusSignal — Wi-Fi Dead-Zone Mapper • 3rd Year ISE DCN Mini-Project •
          Team SignalX
        </p>
      </footer>
    </div>
  );
}
