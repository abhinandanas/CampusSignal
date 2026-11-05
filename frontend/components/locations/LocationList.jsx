'use client';

import React from 'react';
import { MapPin, SearchX, AlertCircle, RefreshCw } from 'lucide-react';
import LocationCard from './LocationCard';
import Loader from '../common/Loader';
import EmptyState from '../common/EmptyState';
import Button from '../common/Button';

/**
 * CampusSignal — Signal Atlas Location List
 * Owner: Yashwanth
 *
 * Renders a responsive grid of campus location cards with loading,
 * empty, and error fallback states.
 *
 * @param {Object} props
 * @param {Array} props.locations - Array of location objects
 * @param {string|null} [props.selectedLocationId] - Currently selected location ID
 * @param {Function} [props.onSelectLocation] - Callback when location is selected
 * @param {boolean} [props.isLoading=false] - Whether data is actively loading
 * @param {string|null} [props.error=null] - Error message if fetch failed
 * @param {Function} [props.onRetry] - Callback to retry after error
 * @param {Function} [props.onResetFilters] - Callback to clear search/filters
 * @param {boolean} [props.hasActiveFilters=false] - Whether user has filtered the list
 * @param {string} [props.className='']
 */
export default function LocationList({
  locations = [],
  selectedLocationId = null,
  onSelectLocation,
  isLoading = false,
  error = null,
  onRetry,
  onResetFilters,
  hasActiveFilters = false,
  className = '',
}) {
  // 1. Loading State
  if (isLoading) {
    return (
      <div className="py-16 flex flex-col items-center justify-center">
        <Loader label="Fetching campus locations from repository..." size="lg" />
      </div>
    );
  }

  // 2. Error State
  if (error) {
    return (
      <div className="p-8 rounded-lg border border-[#FDA29B] bg-[#FEF3F2] dark:bg-[rgba(184,76,58,0.1)] dark:border-[#B84C3A]/40 text-center my-4">
        <div className="w-12 h-12 rounded-full bg-white dark:bg-[#171D27] text-[#B84C3A] border border-[#FDA29B] flex items-center justify-center mx-auto mb-3 shadow-xs">
          <AlertCircle className="w-6 h-6 stroke-[2]" />
        </div>
        <h4 className="text-sm font-bold text-[#B42318] dark:text-[#E8EDF3]">
          Unable to Load Campus Locations
        </h4>
        <p className="text-xs text-[#697586] dark:text-[#8B98A9] max-w-md mx-auto mt-1 mb-4 leading-relaxed">
          {error}
        </p>
        {onRetry && (
          <Button
            variant="primary"
            size="sm"
            icon={RefreshCw}
            onClick={onRetry}
            className="cursor-pointer"
          >
            Retry Connection
          </Button>
        )}
      </div>
    );
  }

  // 3. Empty State — When search / filters yield 0 results
  if (locations.length === 0) {
    if (hasActiveFilters) {
      return (
        <EmptyState
          title="No Matching Campus Locations"
          description="No buildings, floors, or zones matched your current filter criteria. Try adjusting your keyword search or resetting the filters."
          icon={SearchX}
          actionLabel="Clear All Filters"
          onAction={onResetFilters}
          className="my-6"
        />
      );
    }

    // Empty State — When database has 0 locations
    return (
      <EmptyState
        title="No Campus Locations Available"
        description="No physical buildings or test zones have been catalogued in the database yet. Run the database seed migration to populate campus locations."
        icon={MapPin}
        actionLabel={onRetry ? 'Refresh List' : undefined}
        onAction={onRetry}
        className="my-6"
      />
    );
  }

  // 4. Populated Responsive Grid Layout
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 items-stretch ${className}`}
      role="list"
      aria-label="Campus locations directory"
    >
      {locations.map((location) => {
        const isSelected = selectedLocationId === location.id;

        return (
          <div key={location.id} role="listitem">
            <LocationCard
              location={location}
              isSelected={isSelected}
              onSelect={onSelectLocation}
            />
          </div>
        );
      })}
    </div>
  );
}
