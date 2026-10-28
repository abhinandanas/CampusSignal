"use client";

import React from "react";
import {
  Compass,
  Radio,
  Wifi,
  RefreshCw,
  Layers,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Flame,
} from "lucide-react";

/**
 * DashboardHeader — Signal Atlas Contextual Banner
 * Provides campus context, active filter pills, health status indicator,
 * and quick telemetry actions.
 */
export default function DashboardHeader({
  activeFilter = "all",
  onFilterChange,
  buildingCount = 5,
  totalLocations = 18,
  deadZoneCount = 3,
  systemStatus = "healthy",
  onRefresh,
  lastUpdated,
}) {
  const filters = [
    { id: "all", label: "All Campus Zones", count: totalLocations },
    { id: "healthy", label: "Healthy (≥15 Mbps)", color: "text-[var(--atlas-healthy)]" },
    { id: "weak", label: "Weak (5–15 Mbps)", color: "text-[var(--atlas-weak)]" },
    { id: "poor", label: "Dead Zones (<5 Mbps)", color: "text-[var(--atlas-poor)]", count: deadZoneCount },
  ];

  return (
    <header className="bg-[var(--atlas-card)] border-b border-[var(--atlas-border)] px-4 py-3 sm:px-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Brand Identity & Location Context */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded bg-[var(--atlas-terracotta)] text-white shadow-xs">
            <Radio className="w-5 h-5" strokeWidth={2.2} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold tracking-tight text-[var(--atlas-text-primary)]">
                Signal Atlas
              </h1>
              <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-[var(--atlas-map-bg)] text-[var(--atlas-text-secondary)] border border-[var(--atlas-border)]">
                GIS v1.2
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[var(--atlas-healthy)] bg-[var(--atlas-healthy-subtle)] px-2 py-0.5 rounded border border-[var(--atlas-healthy)]/20">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--atlas-healthy)] animate-pulse" />
                Live Telemetry
              </span>
            </div>
            <p className="text-xs text-[var(--atlas-text-secondary)] flex items-center gap-1.5 mt-0.5">
              <span>Main Engineering Campus</span>
              <span>•</span>
              <span>{buildingCount} Buildings Registered</span>
              <span>•</span>
              <span>{totalLocations} Test Points</span>
            </p>
          </div>
        </div>

        {/* Right: Status Pill & Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Filter Pills */}
          <div className="flex items-center p-0.5 bg-[var(--atlas-map-bg)] border border-[var(--atlas-border)] rounded-md text-xs">
            {filters.map((f) => {
              const isActive = activeFilter === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => onFilterChange && onFilterChange(f.id)}
                  className={`px-2.5 py-1 rounded font-medium transition-all ${
                    isActive
                      ? "bg-[var(--atlas-card)] text-[var(--atlas-text-primary)] shadow-2xs font-semibold"
                      : "text-[var(--atlas-text-secondary)] hover:text-[var(--atlas-text-primary)]"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {f.id === "poor" && <span className="w-1.5 h-1.5 rounded-full bg-[var(--atlas-poor)]" />}
                    {f.id === "healthy" && <span className="w-1.5 h-1.5 rounded-full bg-[var(--atlas-healthy)]" />}
                    {f.label}
                    {f.count !== undefined && (
                      <span className={`text-[10px] px-1 rounded ${isActive ? "bg-[var(--atlas-map-bg)]" : "opacity-75"}`}>
                        {f.count}
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Refresh Action */}
          <button
            onClick={onRefresh}
            title="Refresh telemetry"
            className="p-1.5 rounded border border-[var(--atlas-border)] bg-[var(--atlas-card)] text-[var(--atlas-text-secondary)] hover:text-[var(--atlas-text-primary)] hover:border-[var(--atlas-terracotta)]/40 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
