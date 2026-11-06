'use client';

import React, { useState, useEffect, useCallback } from 'react';
import AppLayout from '../../components/layout/AppLayout';
import PageContainer from '../../components/layout/PageContainer';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { getTestHistory } from '../../services/historyService';
import { getCampusLocations } from '../../services/locationService';
import { formatSpeed, formatLatency, formatTimestamp } from '../../lib/formatters';
import {
  History,
  Filter,
  RefreshCw,
  Search,
  Wifi,
  Download,
  Upload,
  Clock,
  MapPin,
  ShieldAlert,
  SlidersHorizontal,
  ChevronRight,
  ArrowUpDown,
  RotateCcw,
} from 'lucide-react';

/**
 * CampusSignal — Network Test History Page
 * Owner: Santosh (USN: 4SF24IS100)
 *
 * Full-featured historical telemetry explorer:
 * - Real-time querying against Express backend /api/tests
 * - Multi-criteria filtering (by location UUID, quality status, search string)
 * - Summary telemetry metrics computed over historical datasets
 * - Responsive table with loading, error, and empty states
 */
export default function HistoryPage() {
  // Data States
  const [tests, setTests] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Filter States
  const [selectedLocationId, setSelectedLocationId] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date-desc');

  // Load campus locations for the dropdown
  useEffect(() => {
    let isMounted = true;
    async function loadLocations() {
      try {
        const data = await getCampusLocations();
        if (isMounted) setLocations(data);
      } catch (err) {
        console.error('Failed to load locations for filter:', err);
      }
    }
    loadLocations();
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch test records from backend
  const fetchHistory = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const filters = { limit: 100 };
      if (selectedLocationId) filters.locationId = selectedLocationId;
      if (selectedStatus) filters.status = selectedStatus;

      const data = await getTestHistory(filters);
      setTests(data);
    } catch (err) {
      console.error('Error querying test history:', err);
      setError(err?.message || 'Failed to retrieve test history from server.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedLocationId, selectedStatus]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // Client-side text search and sorting filter
  const filteredTests = tests.filter((test) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const locName = (test.locationName || '').toLowerCase();
    const source = (test.measurementSource || '').toLowerCase();
    return locName.includes(query) || source.includes(query);
  }).sort((a, b) => {
    if (sortBy === 'date-desc') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (sortBy === 'date-asc') {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    if (sortBy === 'speed-desc') {
      return b.downloadMbps - a.downloadMbps;
    }
    if (sortBy === 'speed-asc') {
      return a.downloadMbps - b.downloadMbps;
    }
    if (sortBy === 'latency-asc') {
      return a.latencyMs - b.latencyMs;
    }
    return 0;
  });

  // Calculate high-level summary KPIs from historical data
  const totalTests = filteredTests.length;
  const avgDownload = totalTests > 0
    ? (filteredTests.reduce((acc, t) => acc + t.downloadMbps, 0) / totalTests).toFixed(1)
    : '0.0';
  const avgUpload = totalTests > 0
    ? (filteredTests.reduce((acc, t) => acc + t.uploadMbps, 0) / totalTests).toFixed(1)
    : '0.0';
  const avgLatency = totalTests > 0
    ? Math.round(filteredTests.reduce((acc, t) => acc + t.latencyMs, 0) / totalTests)
    : 0;
  const deadZonesCount = filteredTests.filter((t) => t.status === 'weak' || t.downloadMbps < 5.0).length;

  const handleResetFilters = () => {
    setSelectedLocationId('');
    setSelectedStatus('');
    setSearchQuery('');
    setSortBy('date-desc');
  };

  return (
    <AppLayout
      title="Network Test History"
      subtitle="Historical telemetry registry of Wi-Fi performance tests across campus"
    >
      <PageContainer>
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <div className="p-4 rounded-lg bg-white dark:bg-[#171D27] border border-[#E4E8EC] dark:border-[#273140] shadow-2xs">
            <div className="flex items-center justify-between text-[#697586] dark:text-[#8B98A9] mb-1.5 text-xs font-medium">
              <span>Tests Logged</span>
              <History className="w-4 h-4 text-[#B84C3A]" />
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-[#242B38] dark:text-[#E8EDF3]">
              {totalTests}
            </div>
            <p className="text-[11px] text-[#697586] dark:text-[#8B98A9] mt-0.5">
              Across all filtered zones
            </p>
          </div>

          <div className="p-4 rounded-lg bg-white dark:bg-[#171D27] border border-[#E4E8EC] dark:border-[#273140] shadow-2xs">
            <div className="flex items-center justify-between text-[#697586] dark:text-[#8B98A9] mb-1.5 text-xs font-medium">
              <span>Avg Download</span>
              <Download className="w-4 h-4 text-[#B84C3A]" />
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-[#242B38] dark:text-[#E8EDF3]">
              {avgDownload} <span className="text-xs font-normal">Mbps</span>
            </div>
            <p className="text-[11px] text-[#697586] dark:text-[#8B98A9] mt-0.5">
              Throughput baseline
            </p>
          </div>

          <div className="p-4 rounded-lg bg-white dark:bg-[#171D27] border border-[#E4E8EC] dark:border-[#273140] shadow-2xs">
            <div className="flex items-center justify-between text-[#697586] dark:text-[#8B98A9] mb-1.5 text-xs font-medium">
              <span>Avg Latency (RTT)</span>
              <Clock className="w-4 h-4 text-[#39836A]" />
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-[#242B38] dark:text-[#E8EDF3]">
              {avgLatency} <span className="text-xs font-normal">ms</span>
            </div>
            <p className="text-[11px] text-[#697586] dark:text-[#8B98A9] mt-0.5">
              Round-trip ping time
            </p>
          </div>

          <div className="p-4 rounded-lg bg-white dark:bg-[#171D27] border border-[#E4E8EC] dark:border-[#273140] shadow-2xs">
            <div className="flex items-center justify-between text-[#697586] dark:text-[#8B98A9] mb-1.5 text-xs font-medium">
              <span>Dead Zones Flagged</span>
              <ShieldAlert className="w-4 h-4 text-[#B84C3A]" />
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-[#B84C3A]">
              {deadZonesCount}
            </div>
            <p className="text-[11px] text-[#697586] dark:text-[#8B98A9] mt-0.5">
              Download &lt; 5 Mbps or weak RTT
            </p>
          </div>
        </div>

        {/* Filter Toolbar */}
        <Card noPadding className="mb-6">
          <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#E4E8EC] dark:border-[#273140]">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#697586] dark:text-[#8B98A9]" />
              <input
                type="text"
                placeholder="Search by campus zone name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-md bg-[#F3F6F8] dark:bg-[#11151D] border border-[#E4E8EC] dark:border-[#273140] text-[#242B38] dark:text-[#E8EDF3] placeholder-[#697586] focus:outline-none focus:ring-1 focus:ring-[#B84C3A]"
              />
            </div>

            {/* Filter Dropdowns and Actions */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Location Filter */}
              <select
                value={selectedLocationId}
                onChange={(e) => setSelectedLocationId(e.target.value)}
                className="px-3 py-2 text-xs rounded-md bg-[#F3F6F8] dark:bg-[#11151D] border border-[#E4E8EC] dark:border-[#273140] text-[#242B38] dark:text-[#E8EDF3] focus:outline-none focus:ring-1 focus:ring-[#B84C3A]"
                aria-label="Filter by Location"
              >
                <option value="">All Campus Locations</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.buildingName} - {loc.zoneName}
                  </option>
                ))}
              </select>

              {/* Status Filter */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 text-xs rounded-md bg-[#F3F6F8] dark:bg-[#11151D] border border-[#E4E8EC] dark:border-[#273140] text-[#242B38] dark:text-[#E8EDF3] focus:outline-none focus:ring-1 focus:ring-[#B84C3A]"
                aria-label="Filter by Quality Status"
              >
                <option value="">All Quality Tiers</option>
                <option value="good">Healthy (&ge; 25 Mbps)</option>
                <option value="fair">Moderate (10 - 24.9 Mbps)</option>
                <option value="weak">Dead Zone (&lt; 10 Mbps)</option>
              </select>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 text-xs rounded-md bg-[#F3F6F8] dark:bg-[#11151D] border border-[#E4E8EC] dark:border-[#273140] text-[#242B38] dark:text-[#E8EDF3] focus:outline-none focus:ring-1 focus:ring-[#B84C3A]"
                aria-label="Sort By"
              >
                <option value="date-desc">Newest Tests First</option>
                <option value="date-asc">Oldest Tests First</option>
                <option value="speed-desc">Highest Download Speed</option>
                <option value="speed-asc">Lowest Download Speed</option>
                <option value="latency-asc">Lowest Latency (Fastest)</option>
              </select>

              {/* Refresh Button */}
              <Button
                variant="secondary"
                size="sm"
                icon={RefreshCw}
                loading={refreshing}
                onClick={() => fetchHistory(true)}
                title="Refresh test history"
              >
                Refresh
              </Button>

              {(selectedLocationId || selectedStatus || searchQuery) && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-2.5 py-2 text-xs text-[#B84C3A] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

          {/* Main Content Area */}
          {loading ? (
            <div className="py-20 flex items-center justify-center">
              <Loader label="Querying historical tests from database..." size="lg" />
            </div>
          ) : error ? (
            <div className="p-8 text-center bg-[#FBF0EE] dark:bg-[rgba(184,76,58,0.1)]">
              <ShieldAlert className="w-8 h-8 text-[#B84C3A] mx-auto mb-2" />
              <h3 className="text-sm font-semibold text-[#242B38] dark:text-[#E8EDF3]">
                Unable to Load Test History
              </h3>
              <p className="text-xs text-[#697586] dark:text-[#8B98A9] max-w-sm mx-auto mt-1 mb-4">
                {error}
              </p>
              <Button variant="primary" size="sm" onClick={() => fetchHistory()}>
                Retry Query
              </Button>
            </div>
          ) : filteredTests.length === 0 ? (
            <div className="py-12">
              <EmptyState
                icon={History}
                title="No Test Records Found"
                description={
                  selectedLocationId || selectedStatus || searchQuery
                    ? 'No historical test measurements matched your filter criteria. Try adjusting or resetting the filters.'
                    : 'No network telemetry tests have been saved to the PostgreSQL database yet.'
                }
                actionLabel={selectedLocationId || selectedStatus || searchQuery ? 'Clear Filters' : undefined}
                onAction={selectedLocationId || selectedStatus || searchQuery ? handleResetFilters : undefined}
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-[#F3F6F8] dark:bg-[#1A222F] border-b border-[#E4E8EC] dark:border-[#273140] text-[#697586] dark:text-[#8B98A9] font-semibold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="px-5 py-3.5">Campus Test Location</th>
                    <th className="px-5 py-3.5">Download</th>
                    <th className="px-5 py-3.5">Upload</th>
                    <th className="px-5 py-3.5">Latency (RTT)</th>
                    <th className="px-5 py-3.5">Quality Assessment</th>
                    <th className="px-5 py-3.5 text-right">Date & Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E4E8EC] dark:divide-[#273140]">
                  {filteredTests.map((test) => (
                    <tr
                      key={test.id}
                      className="hover:bg-[#F3F6F8]/60 dark:hover:bg-[#1A222F]/60 transition-colors"
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-[#B84C3A] shrink-0" />
                          <div>
                            <span className="font-semibold text-[#242B38] dark:text-[#E8EDF3]">
                              {test.locationName}
                            </span>
                            <div className="text-[10px] text-[#697586] dark:text-[#8B98A9]">
                              ID: {test.id.slice(0, 8)}... • Client: {test.measurementSource}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 font-mono font-bold text-[#242B38] dark:text-[#E8EDF3] tabular-nums">
                        {formatSpeed(test.downloadMbps)}
                      </td>
                      <td className="px-5 py-3.5 font-mono text-[#697586] dark:text-[#8B98A9] tabular-nums">
                        {formatSpeed(test.uploadMbps)}
                      </td>
                      <td className="px-5 py-3.5 font-mono text-[#697586] dark:text-[#8B98A9] tabular-nums">
                        {formatLatency(test.latencyMs)}
                      </td>
                      <td className="px-5 py-3.5">
                        <Badge status={test.status} size="sm" />
                      </td>
                      <td className="px-5 py-3.5 text-right font-mono text-[#697586] dark:text-[#8B98A9] whitespace-nowrap">
                        {formatTimestamp(test.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </PageContainer>
    </AppLayout>
  );
}
