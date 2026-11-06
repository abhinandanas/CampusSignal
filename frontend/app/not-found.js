'use client';

import React from 'react';
import Link from 'next/link';
import { Compass, ArrowLeft, Radio, MapPinOff } from 'lucide-react';
import Button from '../components/common/Button';

/**
 * CampusSignal — 404 Route Not Found
 * Owner: Santosh (USN: 4SF24IS100)
 *
 * Professional 404 error page matching the Signal Atlas GIS cartography theme.
 */
export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F3F6F8] dark:bg-[#11151D] text-[#242B38] dark:text-[#E8EDF3] p-4 select-none">
      <div className="max-w-md w-full bg-white dark:bg-[#171D27] border border-[#E4E8EC] dark:border-[#273140] rounded-xl p-8 text-center shadow-sm">
        {/* Radar / Compass Icon */}
        <div className="w-16 h-16 rounded-2xl bg-[#FBF0EE] dark:bg-[rgba(184,76,58,0.18)] text-[#B84C3A] flex items-center justify-center mx-auto mb-5 border border-[#E8A398]/40 shadow-xs">
          <MapPinOff className="w-8 h-8 stroke-[1.8]" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FBF0EE] dark:bg-[rgba(184,76,58,0.2)] text-[#B84C3A] border border-[#E8A398]/50 text-xs font-mono font-semibold uppercase tracking-wider mb-3">
          <span>Error 404 • Out of Range</span>
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-[#242B38] dark:text-[#E8EDF3] mb-2 tracking-tight">
          Campus Coordinate Not Found
        </h1>

        <p className="text-xs sm:text-sm text-[#697586] dark:text-[#8B98A9] leading-relaxed mb-6">
          The requested URL path or campus telemetry route is outside the mapped Signal Atlas coverage grid.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/dashboard" className="w-full sm:w-auto">
            <Button variant="primary" size="md" icon={ArrowLeft} className="w-full">
              Back to Campus Dashboard
            </Button>
          </Link>
          <Link href="/history" className="w-full sm:w-auto">
            <Button variant="secondary" size="md" className="w-full">
              View Test History
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-6 text-xs text-[#697586] dark:text-[#8B98A9]">
        <Radio className="w-3.5 h-3.5 text-[#B84C3A]" />
        <span>CampusSignal Observability • Team SignalX</span>
      </div>
    </div>
  );
}
