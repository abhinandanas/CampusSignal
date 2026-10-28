"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Activity,
  Clock,
  MapPin,
  Play,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Signal,
  Wifi,
} from "lucide-react";
import MetricCard from "./MetricCard";

/**
 * PerformancePanel — Signal Atlas Left Telemetry Deck (~40% split)
 * Displays selected location details, download/upload throughput, ping/latency,
 * diagnostic classification summary, and test execution CTA.
 */
export default function PerformancePanel({
  selectedBuilding,
  selectedFloor,
  selectedLocation,
  onRunTest,
  isTesting = false,
}) {
  // Determine qualitative classification
  const downloadSpeed = selectedLocation?.downloadSpeed || 18.4;
  const uploadSpeed = selectedLocation?.uploadSpeed || 8.2;
  const latency = selectedLocation?.latency || 38.5;
  const jitter = selectedLocation?.jitter || 4.2;
  const lastUpdated = selectedLocation?.lastTest || "Just now";

  let statusType = "healthy";
  let statusTitle = "Optimal Coverage";
  let statusMessage = "Throughput exceeds 15 Mbps. Ideal for HD video streaming, cloud backups, and low-latency conferencing.";

  if (downloadSpeed < 5) {
    statusType = "poor";
    statusTitle = "Dead-Zone Detected";
    statusMessage = "Severe attenuation detected (<5 Mbps). Access point signal is obstructed by thick masonry walls or high user density.";
  } else if (downloadSpeed < 15) {
    statusType = "weak";
    statusTitle = "Sub-Optimal / Weak Coverage";
    statusMessage = "Throughput is between 5 and 15 Mbps. High latency jitter may cause buffering during real-time video calls.";
  }

  return (
    <div className="flex flex-col gap-4 w-full h-full bg-[var(--atlas-card)] border border-[var(--atlas-border)] rounded-md p-4 lg:p-5 overflow-y-auto">
      {/* 1. Location Breadcrumb & Selector Badge */}
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-[var(--atlas-divider)]">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--atlas-text-secondary)]">
            Active Focus Area
          </span>
          <h2 className="text-lg font-bold text-[var(--atlas-text-primary)] mt-0.5 flex items-center gap-1.5">
            <Building2 className="w-5 h-5 text-[var(--atlas-terracotta)]" strokeWidth={2} />
            <span>{selectedLocation?.name || "ISE Lab 3"}</span>
          </h2>
          <p className="text-xs text-[var(--atlas-text-secondary)] flex items-center gap-1 mt-0.5">
            <MapPin className="w-3.5 h-3.5" />
            <span>
              {selectedBuilding?.name || "Academic Block A"} • Floor{" "}
              {selectedFloor === 0 ? "Ground" : selectedFloor}
            </span>
          </p>
        </div>

        {/* Target AP Identifier */}
        <div className="text-right">
          <span className="text-[10px] font-mono uppercase text-[var(--atlas-text-secondary)] block">
            Target AP
          </span>
          <span className="text-xs font-mono font-medium text-[var(--atlas-text-primary)] px-2 py-0.5 bg-[var(--atlas-map-bg)] border border-[var(--atlas-border)] rounded">
            {selectedLocation?.targetAp || "AP-BLK-A-201"}
          </span>
        </div>
      </div>

      {/* 2. Primary KPI Grid */}
      <div className="grid grid-cols-2 gap-3">
        <MetricCard
          title="Download Throughput"
          value={downloadSpeed.toFixed(1)}
          unit="Mbps"
          status={statusType}
          icon={ArrowDownCircle}
          subtitle="Client to Access Point"
        />
        <MetricCard
          title="Round-Trip Ping"
          value={latency.toFixed(0)}
          unit="ms"
          status={latency < 50 ? "healthy" : latency < 150 ? "weak" : "poor"}
          icon={Activity}
          subtitle={`Jitter: ±${jitter.toFixed(1)} ms`}
        />
      </div>

      {/* 3. Secondary Metrics: Upload & Packet Loss */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-[var(--atlas-map-bg)] border border-[var(--atlas-border)] rounded-md">
          <span className="text-[11px] font-medium text-[var(--atlas-text-secondary)] flex items-center gap-1">
            <ArrowUpCircle className="w-3.5 h-3.5 text-[var(--atlas-text-secondary)]" />
            Upload Throughput
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-bold text-[var(--atlas-text-primary)] tabular-nums">
              {uploadSpeed.toFixed(1)}
            </span>
            <span className="text-xs text-[var(--atlas-text-secondary)]">Mbps</span>
          </div>
        </div>

        <div className="p-3 bg-[var(--atlas-map-bg)] border border-[var(--atlas-border)] rounded-md">
          <span className="text-[11px] font-medium text-[var(--atlas-text-secondary)] flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-[var(--atlas-text-secondary)]" />
            Last Measured
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xs font-semibold text-[var(--atlas-text-primary)] truncate">
              {lastUpdated}
            </span>
          </div>
        </div>
      </div>

      {/* 4. Telemetry Diagnosis Status Summary Banner */}
      <div
        className={`p-3.5 rounded-md border text-xs ${
          statusType === "healthy"
            ? "bg-[var(--atlas-healthy-subtle)] border-[var(--atlas-healthy)]/25 text-[var(--atlas-text-primary)]"
            : statusType === "weak"
            ? "bg-[var(--atlas-weak-subtle)] border-[var(--atlas-weak)]/25 text-[var(--atlas-text-primary)]"
            : "bg-[var(--atlas-poor-subtle)] border-[var(--atlas-poor)]/25 text-[var(--atlas-text-primary)]"
        }`}
      >
        <div className="flex items-center gap-1.5 font-bold mb-1">
          {statusType === "healthy" && (
            <CheckCircle2 className="w-4 h-4 text-[var(--atlas-healthy)]" />
          )}
          {statusType === "weak" && (
            <AlertTriangle className="w-4 h-4 text-[var(--atlas-weak)]" />
          )}
          {statusType === "poor" && (
            <AlertCircle className="w-4 h-4 text-[var(--atlas-poor)]" />
          )}
          <span>{statusTitle}</span>
        </div>
        <p className="text-[var(--atlas-text-secondary)] leading-relaxed">
          {statusMessage}
        </p>
      </div>

      {/* 5. Prominent "Run Network Test" Action Button (Terracotta Brand Accent) */}
      <div className="mt-auto pt-2">
        <Link
          href={`/network-test?building=${encodeURIComponent(
            selectedBuilding?.name || "Academic Block A"
          )}&floor=${selectedFloor}&locationId=${encodeURIComponent(
            selectedLocation?.id || "loc_01"
          )}`}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-md font-semibold text-sm text-white bg-[var(--atlas-terracotta)] hover:bg-[var(--atlas-terracotta-hover)] active:translate-y-px transition-all shadow-xs focus:ring-2 focus:ring-[var(--atlas-terracotta-ring)] focus:outline-hidden"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Run Network Test at this Location</span>
        </Link>
        <p className="text-[11px] text-center text-[var(--atlas-text-secondary)] mt-2">
          Empirical DCN test executes 5s HTTP chunked downlink probe.
        </p>
      </div>
    </div>
  );
}
