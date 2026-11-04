import Link from "next/link";
import { Compass, ArrowLeft, Radio } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--atlas-bg)] text-[var(--atlas-text-primary)] px-4">
      <div className="max-w-md w-full bg-[var(--atlas-card)] border border-[var(--atlas-border)] rounded-md p-6 text-center shadow-xs">
        <div className="w-12 h-12 rounded bg-[var(--atlas-terracotta-subtle)] text-[var(--atlas-terracotta)] flex items-center justify-center mx-auto mb-4 border border-[var(--atlas-terracotta)]/20">
          <Radio className="w-6 h-6" />
        </div>
        <span className="text-xs font-mono text-[var(--atlas-terracotta)] font-semibold uppercase tracking-wider">
          404 — Location Out of Bounds
        </span>
        <h1 className="text-xl font-bold text-[var(--atlas-text-primary)] mt-1 mb-2">
          Campus Coordinate Not Found
        </h1>
        <p className="text-xs text-[var(--atlas-text-secondary)] leading-relaxed mb-6">
          The requested route or campus telemetry view does not exist in the Signal Atlas registry.
        </p>

        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded font-semibold text-xs text-white bg-[var(--atlas-terracotta)] hover:bg-[var(--atlas-terracotta-hover)] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Campus Dashboard</span>
        </Link>
      </div>
    </div>
  );
}
