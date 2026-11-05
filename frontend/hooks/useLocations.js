'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { getCampusLocations } from '../services/locationService';

/**
 * CampusSignal — Reusable Locations Data Fetching Hook
 * Owner: Yashwanth
 *
 * Coordinates asynchronous campus location fetching, filtering,
 * loading/error states, and request cancellation.
 *
 * @param {Object} [options]
 * @param {string} [options.initialBuilding]
 * @param {string|number} [options.initialFloor]
 * @param {string} [options.initialSearch]
 * @param {boolean} [options.autoFetch=true]
 * @returns {Object} Location state and handler methods
 */
export function useLocations({
  initialBuilding = '',
  initialFloor = '',
  initialSearch = '',
  autoFetch = true,
} = {}) {
  const [locations, setLocations] = useState([]);
  const [allLocations, setAllLocations] = useState([]);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [filterBuilding, setFilterBuilding] = useState(initialBuilding);
  const [filterFloor, setFilterFloor] = useState(initialFloor !== '' ? String(initialFloor) : '');
  const [selectedLocationId, setSelectedLocationId] = useState(null);

  // Request counter to trigger clean refreshes
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Active abort controller reference
  const activeAbortRef = useRef(null);

  // 1. Initial / broad load to populate building/floor catalogues
  useEffect(() => {
    let ignore = false;
    const controller = new AbortController();

    async function loadAllLocations() {
      try {
        const data = await getCampusLocations({ signal: controller.signal });
        if (!ignore) {
          setAllLocations(data);
        }
      } catch (err) {
        if (!ignore && err.name !== 'AbortError') {
          // Failure on background catalogue load is non-fatal
        }
      }
    }

    loadAllLocations();
    return () => {
      ignore = true;
      controller.abort();
    };
  }, [refreshTrigger]);

  // 2. Filtered fetch from API
  useEffect(() => {
    if (!autoFetch) return;

    if (activeAbortRef.current) {
      activeAbortRef.current.abort();
    }

    const controller = new AbortController();
    activeAbortRef.current = controller;

    const timer = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getCampusLocations({
          building: filterBuilding,
          floor: filterFloor,
          search: searchQuery,
          signal: controller.signal,
        });

        if (!controller.signal.aborted) {
          setLocations(data);
          setError(null);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          if (err.name !== 'AbortError') {
            setError(err.message || 'Unable to retrieve campus locations from the server.');
            setLocations([]);
          }
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, searchQuery ? 250 : 0); // Debounce search input slightly to avoid excess requests

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [filterBuilding, filterFloor, searchQuery, refreshTrigger, autoFetch]);

  // Refresh callback
  const refresh = useCallback(() => {
    setError(null);
    setRefreshTrigger((c) => c + 1);
  }, []);

  // Reset filters callback
  const resetFilters = useCallback(() => {
    setSearchQuery('');
    setFilterBuilding('');
    setFilterFloor('');
    setSelectedLocationId(null);
  }, []);

  // Derived catalogue of available buildings
  const buildings = useMemo(() => {
    const source = allLocations.length > 0 ? allLocations : locations;
    const set = new Set();
    source.forEach((loc) => {
      if (loc.buildingName) set.add(loc.buildingName);
    });
    return Array.from(set).sort();
  }, [allLocations, locations]);

  // Derived catalogue of available floors (context-aware: if building selected, floors in that building)
  const floors = useMemo(() => {
    const source = allLocations.length > 0 ? allLocations : locations;
    const relevant = filterBuilding
      ? source.filter((loc) => loc.buildingName.toLowerCase() === filterBuilding.toLowerCase())
      : source;

    const set = new Set();
    relevant.forEach((loc) => {
      if (loc.floor != null) set.add(Number(loc.floor));
    });
    return Array.from(set).sort((a, b) => a - b);
  }, [allLocations, locations, filterBuilding]);

  // Selected location object
  const selectedLocation = useMemo(() => {
    if (!selectedLocationId) return null;
    return (
      locations.find((l) => l.id === selectedLocationId) ||
      allLocations.find((l) => l.id === selectedLocationId) ||
      null
    );
  }, [selectedLocationId, locations, allLocations]);

  return {
    locations,
    allLocations,
    loading,
    isLoading: loading,
    error,
    refresh,
    refetch: refresh,
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
    totalCount: allLocations.length || locations.length,
    filteredCount: locations.length,
  };
}

export default useLocations;
