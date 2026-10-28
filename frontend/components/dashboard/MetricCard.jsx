"use client";

import React from "react";

/**
 * MetricCard — Signal Atlas KPI Display Card
 * Displays numerical performance figures with units, status indicators, and clean typography.
 */
export default function MetricCard({
  title,
  value,
  unit,
  status = "neutral",
  icon: Icon,
  subtitle,
  change,
  className = "",
}) {
  // Status-driven styling
  const statusConfig = {
    healthy: {
      badgeBg: "bg-[var(--atlas-healthy-subtle)]",
      textColor: "text-[var(--atlas-healthy)]",
      borderColor: "border-[var(--atlas-healthy)]/25",
      dotColor: "bg-[var(--atlas-healthy)]",
      label: "Healthy",
    },
    weak: {
      badgeBg: "bg-[var(--atlas-weak-subtle)]",
      textColor: "text-[var(--atlas-weak)]",
      borderColor: "border-[var(--atlas-weak)]/25",
      dotColor: "bg-[var(--atlas-weak)]",
      label: "Weak",
    },
    poor: {
      badgeBg: "bg-[var(--atlas-poor-subtle)]",
      textColor: "text-[var(--atlas-poor)]",
      borderColor: "border-[var(--atlas-poor)]/25",
      dotColor: "bg-[var(--atlas-poor)]",
      label: "Dead Zone",
    },
    terracotta: {
      badgeBg: "bg-[var(--atlas-terracotta-subtle)]",
      textColor: "text-[var(--atlas-terracotta)]",
      borderColor: "border-[var(--atlas-terracotta)]/25",
      dotColor: "bg-[var(--atlas-terracotta)]",
      label: "Active",
    },
    neutral: {
      badgeBg: "bg-[var(--atlas-map-bg)]",
      textColor: "text-[var(--atlas-text-secondary)]",
      borderColor: "border-[var(--atlas-border)]",
      dotColor: "bg-[var(--atlas-text-secondary)]",
      label: "Standard",
    },
  };

  const currentStatus = statusConfig[status] || statusConfig.neutral;

  return (
    <div
      className={`bg-[var(--atlas-card)] border border-[var(--atlas-border)] rounded-md p-4 transition-all duration-150 hover:border-[var(--atlas-terracotta)]/40 ${className}`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium uppercase tracking-wider text-[var(--atlas-text-secondary)]">
          {title}
        </span>
        {Icon && (
          <div className="p-1.5 rounded bg-[var(--atlas-map-bg)] text-[var(--atlas-text-secondary)]">
            <Icon className="w-4 h-4" strokeWidth={1.8} />
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-1.5 mb-1.5">
        <span className="text-2xl lg:text-3xl font-semibold tracking-tight text-[var(--atlas-text-primary)] tabular-nums">
          {value !== undefined && value !== null ? value : "—"}
        </span>
        {unit && (
          <span className="text-xs font-medium text-[var(--atlas-text-secondary)]">
            {unit}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-[var(--atlas-divider)] text-xs">
        {subtitle && (
          <span className="text-[var(--atlas-text-secondary)] truncate">
            {subtitle}
          </span>
        )}
        {status !== "neutral" && (
          <div
            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium border ${currentStatus.badgeBg} ${currentStatus.textColor} ${currentStatus.borderColor}`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${currentStatus.dotColor}`}
            />
            {currentStatus.label}
          </div>
        )}
      </div>
    </div>
  );
}
