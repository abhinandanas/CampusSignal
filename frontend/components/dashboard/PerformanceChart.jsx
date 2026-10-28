"use client";

import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { LineChart as LineChartIcon, Activity } from "lucide-react";

/**
 * PerformanceChart — Signal Atlas Dual-Axis Telemetry Timeline
 * Plots Download Throughput (Mbps) and Latency (ms) across historical intervals.
 */
export default function PerformanceChart({
  data = [
    { time: "09:00", download: 22.4, latency: 32 },
    { time: "10:30", download: 18.2, latency: 45 },
    { time: "12:00", download: 8.5, latency: 98 },
    { time: "13:30", download: 6.2, latency: 135 },
    { time: "15:00", download: 15.9, latency: 52 },
    { time: "16:30", download: 26.4, latency: 28 },
    { time: "18:00", download: 24.1, latency: 34 },
  ],
}) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="w-full h-64 bg-[var(--atlas-card)] border border-[var(--atlas-border)] rounded-md flex items-center justify-center text-xs text-[var(--atlas-text-secondary)]">
        Loading Telemetry Chart...
      </div>
    );
  }

  return (
    <div className="bg-[var(--atlas-card)] border border-[var(--atlas-border)] rounded-md p-4">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-[var(--atlas-divider)]">
        <div>
          <h3 className="text-sm font-bold text-[var(--atlas-text-primary)] flex items-center gap-1.5">
            <LineChartIcon className="w-4 h-4 text-[var(--atlas-terracotta)]" />
            <span>Time-Series Telemetry (Download vs Latency)</span>
          </h3>
          <p className="text-xs text-[var(--atlas-text-secondary)]">
            Hourly diurnal network performance trends across monitored campus APs
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[var(--atlas-terracotta)]" />
            <span className="text-[var(--atlas-text-secondary)] font-medium">Download (Mbps)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[var(--atlas-healthy)]" />
            <span className="text-[var(--atlas-text-secondary)] font-medium">Latency (ms)</span>
          </div>
        </div>
      </div>

      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="downloadGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--atlas-terracotta)" stopOpacity={0.25} />
                <stop offset="95%" stopColor="var(--atlas-terracotta)" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="latencyGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--atlas-healthy)" stopOpacity={0.2} />
                <stop offset="95%" stopColor="var(--atlas-healthy)" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--atlas-border)" vertical={false} />
            <XAxis
              dataKey="time"
              stroke="var(--atlas-text-secondary)"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: "var(--atlas-border)" }}
            />
            <YAxis
              stroke="var(--atlas-text-secondary)"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: "var(--atlas-border)" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="download"
              stroke="var(--atlas-terracotta)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#downloadGrad)"
              name="Download (Mbps)"
            />
            <Area
              type="monotone"
              dataKey="latency"
              stroke="var(--atlas-healthy)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#latencyGrad)"
              name="Latency (ms)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[var(--atlas-card)] border border-[var(--atlas-border)] rounded p-2.5 shadow-md text-xs">
        <p className="font-bold text-[var(--atlas-text-primary)] mb-1">Time: {label}</p>
        {payload.map((entry, index) => (
          <p key={`item-${index}`} className="flex items-center gap-2" style={{ color: entry.stroke }}>
            <span className="font-medium">{entry.name}:</span>
            <span className="font-bold tabular-nums">{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
}
