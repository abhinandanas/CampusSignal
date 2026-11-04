"use client";

import React from "react";
import { Table, Clock, Wifi, CheckCircle2, AlertTriangle, AlertCircle } from "lucide-react";

/**
 * RecentTestsTable — Signal Atlas Telemetry Log
 * Shows chronological speed tests logged across campus testing locations.
 */
export default function RecentTestsTable({
  tests = [
    {
      id: "test_01",
      location: "ISE Lab 3",
      building: "Academic Block A",
      floor: 2,
      download: 18.45,
      upload: 8.2,
      latency: 38.5,
      status: "healthy",
      time: "2 mins ago",
    },
    {
      id: "test_02",
      location: "Ground Reference Stacks",
      building: "Central Library",
      floor: 0,
      download: 0.85,
      upload: 0.2,
      latency: 412.0,
      status: "poor",
      time: "14 mins ago",
    },
    {
      id: "test_03",
      location: "Food Court Common",
      building: "Student Hub",
      floor: 0,
      download: 5.8,
      upload: 3.1,
      latency: 118.0,
      status: "weak",
      time: "32 mins ago",
    },
    {
      id: "test_04",
      location: "3F Cloud Computing Lab",
      building: "Tech Tower",
      floor: 3,
      download: 34.2,
      upload: 15.6,
      latency: 22.0,
      status: "healthy",
      time: "48 mins ago",
    },
    {
      id: "test_05",
      location: "Lecture Hall 102",
      building: "Academic Block A",
      floor: 1,
      download: 24.1,
      upload: 10.4,
      latency: 31.0,
      status: "healthy",
      time: "1 hour ago",
    },
  ],
}) {
  return (
    <div className="bg-[var(--atlas-card)] border border-[var(--atlas-border)] rounded-md overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--atlas-divider)]">
        <div>
          <h3 className="text-sm font-bold text-[var(--atlas-text-primary)] flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[var(--atlas-terracotta)]" />
            <span>Recent Campus Telemetry Logs</span>
          </h3>
          <p className="text-xs text-[var(--atlas-text-secondary)]">
            Empirical client test submissions recorded in PostgreSQL
          </p>
        </div>
        <span className="text-xs font-medium text-[var(--atlas-text-secondary)]">
          {tests.length} Recent Submissions
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[var(--atlas-map-bg)] border-b border-[var(--atlas-border)] text-[var(--atlas-text-secondary)] font-semibold uppercase tracking-wider text-[10px]">
            <tr>
              <th className="px-4 py-2.5">Location & Landmark</th>
              <th className="px-4 py-2.5">Building / Floor</th>
              <th className="px-4 py-2.5">Download</th>
              <th className="px-4 py-2.5">Upload</th>
              <th className="px-4 py-2.5">Latency</th>
              <th className="px-4 py-2.5">Diagnosis</th>
              <th className="px-4 py-2.5 text-right">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--atlas-divider)]">
            {tests.map((t) => (
              <tr
                key={t.id}
                className="hover:bg-[var(--atlas-map-bg)]/60 transition-colors"
              >
                <td className="px-4 py-2.5 font-semibold text-[var(--atlas-text-primary)]">
                  {t.location}
                </td>
                <td className="px-4 py-2.5 text-[var(--atlas-text-secondary)]">
                  {t.building} • {t.floor === 0 ? "Ground" : `${t.floor}F`}
                </td>
                <td className="px-4 py-2.5 font-mono font-bold text-[var(--atlas-text-primary)] tabular-nums">
                  {t.download.toFixed(1)} Mbps
                </td>
                <td className="px-4 py-2.5 font-mono text-[var(--atlas-text-secondary)] tabular-nums">
                  {t.upload.toFixed(1)} Mbps
                </td>
                <td className="px-4 py-2.5 font-mono text-[var(--atlas-text-secondary)] tabular-nums">
                  {t.latency.toFixed(0)} ms
                </td>
                <td className="px-4 py-2.5">
                  {t.status === "healthy" && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[var(--atlas-healthy)] bg-[var(--atlas-healthy-subtle)] px-2 py-0.5 rounded border border-[var(--atlas-healthy)]/20">
                      <CheckCircle2 className="w-3 h-3" />
                      Healthy
                    </span>
                  )}
                  {t.status === "weak" && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[var(--atlas-weak)] bg-[var(--atlas-weak-subtle)] px-2 py-0.5 rounded border border-[var(--atlas-weak)]/20">
                      <AlertTriangle className="w-3 h-3" />
                      Weak
                    </span>
                  )}
                  {t.status === "poor" && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[var(--atlas-poor)] bg-[var(--atlas-poor-subtle)] px-2 py-0.5 rounded border border-[var(--atlas-poor)]/20">
                      <AlertCircle className="w-3 h-3" />
                      Dead Zone
                    </span>
                  )}
                </td>
                <td className="px-4 py-2.5 text-right font-mono text-[var(--atlas-text-secondary)]">
                  {t.time}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
