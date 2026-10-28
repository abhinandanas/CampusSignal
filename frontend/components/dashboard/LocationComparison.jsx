"use client";

import React from "react";
import { BarChart3, TrendingUp } from "lucide-react";

/**
 * LocationComparison — Signal Atlas Comparative Campus Telemetry
 * Compares average download throughput across campus buildings with clean horizontal progress meters.
 */
export default function LocationComparison({
  data = [
    { name: "Academic Block A", avgDownload: 21.4, deadZones: 1, totalTests: 340 },
    { name: "Central Library", avgDownload: 24.8, deadZones: 1, totalTests: 412 },
    { name: "Technology Tower", avgDownload: 18.2, deadZones: 1, totalTests: 288 },
    { name: "Student Hub & Cafeteria", avgDownload: 12.1, deadZones: 0, totalTests: 195 },
    { name: "Admin Block", avgDownload: 26.5, deadZones: 0, totalTests: 185 },
  ],
}) {
  const maxDownload = 30; // Scale normalization baseline (Mbps)

  return (
    <div className="bg-[var(--atlas-card)] border border-[var(--atlas-border)] rounded-md p-4">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-[var(--atlas-divider)]">
        <div>
          <h3 className="text-sm font-bold text-[var(--atlas-text-primary)] flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4 text-[var(--atlas-terracotta)]" />
            <span>Campus Comparative Throughput</span>
          </h3>
          <p className="text-xs text-[var(--atlas-text-secondary)]">
            Average download speeds by campus structure
          </p>
        </div>
        <span className="text-xs font-mono text-[var(--atlas-text-secondary)]">
          Target: 15.0 Mbps
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {data.map((item) => {
          const percent = Math.min((item.avgDownload / maxDownload) * 100, 100);
          const isHealthy = item.avgDownload >= 15;
          const isWeak = item.avgDownload >= 5 && item.avgDownload < 15;

          return (
            <div key={item.name} className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-[var(--atlas-text-primary)]">
                  {item.name}
                </span>
                <div className="flex items-center gap-2">
                  {item.deadZones > 0 && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded font-medium bg-[var(--atlas-poor-subtle)] text-[var(--atlas-poor)] border border-[var(--atlas-poor)]/20">
                      {item.deadZones} Dead Zone{item.deadZones > 1 ? "s" : ""}
                    </span>
                  )}
                  <span className="font-semibold text-[var(--atlas-text-primary)] tabular-nums">
                    {item.avgDownload.toFixed(1)} Mbps
                  </span>
                </div>
              </div>

              {/* Meter track */}
              <div className="w-full h-2 rounded-full bg-[var(--atlas-map-bg)] overflow-hidden border border-[var(--atlas-border)]">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isHealthy
                      ? "bg-[var(--atlas-healthy)]"
                      : isWeak
                      ? "bg-[var(--atlas-weak)]"
                      : "bg-[var(--atlas-poor)]"
                  }`}
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
