'use client';

import React from 'react';
import { Search, Building2, Layers, RotateCcw, X, Filter } from 'lucide-react';
import Button from '../common/Button';

/**
 * CampusSignal — Signal Atlas Location Filters
 * Owner: Yashwanth
 *
 * Provides responsive search, building dropdown, floor picker,
 * and filter reset controls bound to actual campus location data.
 */
export default function LocationFilters({
  searchQuery = '',
  onSearchChange,
  selectedBuilding = '',
  onBuildingChange,
  selectedFloor = '',
  onFloorChange,
  buildings = [],
  floors = [],
  onReset,
  totalCount = 0,
  filteredCount = 0,
  className = '',
}) {
  const hasActiveFilters = Boolean(
    searchQuery || selectedBuilding || selectedFloor !== ''
  );

  return (
    <div
      className={`bg-white dark:bg-[#171D27] rounded-lg border border-[#E4E8EC] dark:border-[#273140] p-4 shadow-2xs transition-colors ${className}`}
    >
      <div className="flex flex-col gap-3.5">
        {/* Top Toolbar: Search + Quick Reset */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search Input Field */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#697586] dark:text-[#8B98A9]">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
              placeholder="Search by zone, building, or description..."
              className="w-full pl-9 pr-9 py-2 text-sm bg-white dark:bg-[#11151D] text-[#242B38] dark:text-[#E8EDF3] border border-[#E4E8EC] dark:border-[#273140] rounded-md focus:outline-none focus:border-[#B84C3A] focus:ring-1 focus:ring-[#B84C3A] placeholder-[#8B98A9] transition-colors"
              aria-label="Search campus locations"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange && onSearchChange('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#697586] hover:text-[#242B38] dark:hover:text-[#E8EDF3] cursor-pointer"
                title="Clear search"
                aria-label="Clear search input"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Reset Filters Action Button */}
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              icon={RotateCcw}
              onClick={onReset}
              className="shrink-0"
              title="Reset all active filters"
            >
              Reset Filters
            </Button>
          )}
        </div>

        {/* Secondary Row: Building Dropdown + Floor Dropdown + Count Indicator */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-[#E4E8EC] dark:border-[#273140]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1 max-w-xl">
            {/* Building Selection Dropdown */}
            <div className="relative">
              <label
                htmlFor="location-building-select"
                className="block text-[11px] font-semibold uppercase tracking-wider text-[#697586] dark:text-[#8B98A9] mb-1"
              >
                Building
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-[#697586] dark:text-[#8B98A9]">
                  <Building2 className="w-3.5 h-3.5" />
                </div>
                <select
                  id="location-building-select"
                  value={selectedBuilding}
                  onChange={(e) => onBuildingChange && onBuildingChange(e.target.value)}
                  className="w-full pl-8 pr-8 py-1.5 text-xs bg-white dark:bg-[#11151D] text-[#242B38] dark:text-[#E8EDF3] border border-[#E4E8EC] dark:border-[#273140] rounded-md focus:outline-none focus:border-[#B84C3A] focus:ring-1 focus:ring-[#B84C3A] cursor-pointer"
                >
                  <option value="">All Buildings ({buildings.length})</option>
                  {buildings.map((bldg) => (
                    <option key={bldg} value={bldg}>
                      {bldg}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Floor Selection Dropdown */}
            <div className="relative">
              <label
                htmlFor="location-floor-select"
                className="block text-[11px] font-semibold uppercase tracking-wider text-[#697586] dark:text-[#8B98A9] mb-1"
              >
                Floor Level
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-[#697586] dark:text-[#8B98A9]">
                  <Layers className="w-3.5 h-3.5" />
                </div>
                <select
                  id="location-floor-select"
                  value={selectedFloor}
                  onChange={(e) => onFloorChange && onFloorChange(e.target.value)}
                  className="w-full pl-8 pr-8 py-1.5 text-xs bg-white dark:bg-[#11151D] text-[#242B38] dark:text-[#E8EDF3] border border-[#E4E8EC] dark:border-[#273140] rounded-md focus:outline-none focus:border-[#B84C3A] focus:ring-1 focus:ring-[#B84C3A] cursor-pointer"
                >
                  <option value="">All Floors ({floors.length})</option>
                  {floors.map((flr) => (
                    <option key={flr} value={String(flr)}>
                      {flr === 0 ? 'Ground Floor (0)' : `Floor ${flr}`}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Results Counter & Context */}
          <div className="flex items-center justify-between sm:justify-end gap-2 text-xs text-[#697586] dark:text-[#8B98A9] self-end sm:self-center">
            <span className="inline-flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-[#B84C3A]" />
              <span>
                Showing <strong className="text-[#242B38] dark:text-[#E8EDF3]">{filteredCount}</strong> of{' '}
                {totalCount} locations
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
