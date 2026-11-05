'use client';

import React from 'react';
import Link from 'next/link';
import {
  MapPin,
  Building2,
  Layers,
  Wifi,
  Activity,
  ArrowRight,
  Radio,
  CheckCircle2,
  X,
} from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import PageContainer from '../../components/layout/PageContainer';
import LocationFilters from '../../components/locations/LocationFilters';
import LocationList from '../../components/locations/LocationList';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { useLocations } from '../../hooks/useLocations';

/**
 * CampusSignal — Campus Locations Page
 * Owner: Yashwanth
 *
 * Signal Atlas Locations directory allowing students and administrators
 * to browse campus buildings, filter by floor, inspect Wi-Fi coverage status,
 * and select physical zones for network testing.
 */
export default function LocationsPage() {
  const {
    locations,
    allLocations,
    loading,
    error,
    refresh,
    buildings,
    floors,
    searchQuery,
    setSearchQuery,
    filterBuilding,
    setFilterBuilding,
    filterFloor,
    setFilterFloor,
    selectedLocationId,
    setSelectedLocationId,
    selectedLocation,
    resetFilters,
    totalCount,
    filteredCount,
  } = useLocations();

  const hasActiveFilters = Boolean(
    searchQuery || filterBuilding || filterFloor !== ''
  );

  // Real benchmarked count (only count records with actual telemetry)
  const benchmarkedCount = allLocations.filter(
    (loc) => loc.qualityCategory || loc.status
  ).length;

  return (
    <AppLayout title="Campus Locations" subtitle="Signal Atlas Directory">
      <PageContainer className="max-w-7xl">
        {/* Page Header Banner */}
        <div className="mb-6 pb-6 border-b border-[#E4E8EC] dark:border-[#273140] flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider bg-[#FBF0EE] dark:bg-[rgba(184,76,58,0.2)] text-[#B84C3A] border border-[#E8A398]/50 mb-2">
              <MapPin className="w-3.5 h-3.5" />
              <span>Campus Geographic Hierarchy</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#242B38] dark:text-[#E8EDF3]">
              Campus Locations
            </h1>
            <p className="text-sm text-[#697586] dark:text-[#8B98A9] max-w-2xl mt-1.5 leading-relaxed">
              Explore monitored campus buildings, floors, and test zones. View empirical Wi-Fi coverage status and select zones for throughput benchmarking.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Link href="/network-test">
              <Button variant="primary" size="md" icon={Wifi}>
                Run Wi-Fi Test
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick KPI Metric Strip (Computed from Real Location Data) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <div className="p-3.5 sm:p-4 rounded-lg bg-white dark:bg-[#171D27] border border-[#E4E8EC] dark:border-[#273140] shadow-2xs">
            <div className="flex items-center justify-between text-xs text-[#697586] dark:text-[#8B98A9] mb-1">
              <span>Monitored Zones</span>
              <MapPin className="w-4 h-4 text-[#B84C3A]" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-[#242B38] dark:text-[#E8EDF3]">
              {loading && totalCount === 0 ? '--' : totalCount}
            </div>
            <span className="text-[11px] text-[#697586] dark:text-[#8B98A9]">
              Physical AP target zones
            </span>
          </div>

          <div className="p-3.5 sm:p-4 rounded-lg bg-white dark:bg-[#171D27] border border-[#E4E8EC] dark:border-[#273140] shadow-2xs">
            <div className="flex items-center justify-between text-xs text-[#697586] dark:text-[#8B98A9] mb-1">
              <span>Active Buildings</span>
              <Building2 className="w-4 h-4 text-[#39836A]" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-[#242B38] dark:text-[#E8EDF3]">
              {loading && buildings.length === 0 ? '--' : buildings.length}
            </div>
            <span className="text-[11px] text-[#697586] dark:text-[#8B98A9]">
              Campus infrastructure blocks
            </span>
          </div>

          <div className="p-3.5 sm:p-4 rounded-lg bg-white dark:bg-[#171D27] border border-[#E4E8EC] dark:border-[#273140] shadow-2xs">
            <div className="flex items-center justify-between text-xs text-[#697586] dark:text-[#8B98A9] mb-1">
              <span>Vertical Floors</span>
              <Layers className="w-4 h-4 text-[#D5A342]" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-[#242B38] dark:text-[#E8EDF3]">
              {loading && floors.length === 0 ? '--' : floors.length}
            </div>
            <span className="text-[11px] text-[#697586] dark:text-[#8B98A9]">
              Multi-floor elevations
            </span>
          </div>

          <div className="p-3.5 sm:p-4 rounded-lg bg-white dark:bg-[#171D27] border border-[#E4E8EC] dark:border-[#273140] shadow-2xs">
            <div className="flex items-center justify-between text-xs text-[#697586] dark:text-[#8B98A9] mb-1">
              <span>Benchmarked</span>
              <Activity className="w-4 h-4 text-[#39836A]" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-[#242B38] dark:text-[#E8EDF3]">
              {loading && totalCount === 0 ? '--' : benchmarkedCount}
            </div>
            <span className="text-[11px] text-[#39836A] font-medium">
              Zones with real telemetry
            </span>
          </div>
        </div>

        {/* Selected Location Action Callout (Shown when a location is selected) */}
        {selectedLocation && (
          <div className="mb-6 p-4 rounded-lg bg-[#FBF0EE] dark:bg-[rgba(184,76,58,0.15)] border border-[#E8A398] dark:border-[#B84C3A]/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all animate-in fade-in duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#B84C3A] text-white flex items-center justify-center shrink-0 shadow-xs">
                <MapPin className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-[#242B38] dark:text-[#E8EDF3]">
                    {selectedLocation.zoneName}
                  </h3>
                  {selectedLocation.qualityCategory ? (
                    <Badge
                      status={selectedLocation.qualityCategory.toLowerCase()}
                      size="sm"
                    />
                  ) : (
                    <Badge status="neutral" label="Unmeasured" size="sm" showIcon={false} />
                  )}
                </div>
                <p className="text-xs text-[#697586] dark:text-[#8B98A9] mt-0.5">
                  {selectedLocation.buildingName} •{' '}
                  {selectedLocation.floor === 0
                    ? 'Ground Floor'
                    : `Floor ${selectedLocation.floor}`}
                  {selectedLocation.description ? ` — ${selectedLocation.description}` : ''}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
              <button
                type="button"
                onClick={() => setSelectedLocationId(null)}
                className="p-1.5 rounded text-[#697586] hover:text-[#242B38] dark:hover:text-[#E8EDF3] transition-colors cursor-pointer"
                title="Deselect location"
                aria-label="Clear location selection"
              >
                <X className="w-4 h-4" />
              </button>
              <Link href={`/network-test?locationId=${selectedLocation.id}`}>
                <Button variant="primary" size="sm" icon={Wifi}>
                  Benchmark This Zone
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Filter Toolbar Controls */}
        <div className="mb-6">
          <LocationFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedBuilding={filterBuilding}
            onBuildingChange={setFilterBuilding}
            selectedFloor={filterFloor}
            onFloorChange={setFilterFloor}
            buildings={buildings}
            floors={floors}
            onReset={resetFilters}
            totalCount={totalCount}
            filteredCount={filteredCount}
          />
        </div>

        {/* Locations List Component */}
        <section aria-labelledby="locations-list-heading">
          <h2 id="locations-list-heading" className="sr-only">
            List of campus locations
          </h2>
          <LocationList
            locations={locations}
            selectedLocationId={selectedLocationId}
            onSelectLocation={(loc) => setSelectedLocationId(loc.id)}
            isLoading={loading}
            error={error}
            onRetry={refresh}
            onResetFilters={resetFilters}
            hasActiveFilters={hasActiveFilters}
          />
        </section>
      </PageContainer>
    </AppLayout>
  );
}
