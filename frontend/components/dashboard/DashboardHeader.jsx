'use client';

import React from 'react';
import { RefreshCw, MapPin } from 'lucide-react';
import Button from '../common/Button';

/**
 * CampusSignal — Dashboard Header
 * Owner: Abhinandana S
 */
export default function DashboardHeader({
  lastUpdated,
  selectedBuilding,
  selectedFloor,
  onRefresh,
  loading = false,
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-4 border-b border-[#E4E8EC] dark:border-[#273140]">
      <div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#B84C3A]" />
          <h2 className="text-base sm:text-lg font-bold text-[#242B38] dark:text-[#E8EDF3] tracking-tight">
            Signal Atlas — Campus Network Observability
          </h2>
        </div>
        <p className="text-xs text-[#697586] dark:text-[#8B98A9] mt-0.5 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-[#B84C3A]" />
          <span>
            {selectedBuilding ? selectedBuilding.name : 'All Campus Buildings'} • Floor{' '}
            {selectedFloor !== null ? (selectedFloor === 0 ? 'Ground' : selectedFloor) : 'All'}
          </span>
          {lastUpdated && (
            <span className="ml-2 text-[11px] text-[#697586] dark:text-[#8B98A9]">
              • Updated: {lastUpdated}
            </span>
          )}
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Button
          variant="secondary"
          size="sm"
          icon={RefreshCw}
          onClick={onRefresh}
          loading={loading}
        >
          Sync Telemetry
        </Button>
      </div>
    </div>
  );
}
