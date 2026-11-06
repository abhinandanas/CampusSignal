'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import EmptyState from '../common/EmptyState';
import Loader from '../common/Loader';
import { Table, Clock, Wifi, ArrowDown, ArrowUp, AlertCircle, RefreshCw } from 'lucide-react';
import { formatSpeed, formatLatency, formatTimestamp } from '../../lib/formatters';
import { getTestHistory } from '../../services/historyService';

/**
 * CampusSignal — Recent Tests Table Component
 * Owner: Santosh (USN: 4SF24IS100)
 *
 * Chronological table of empirical speed tests submitted by students and campus sensors.
 */
export default function RecentTestsTable({
  tests: propTests,
  loading: propLoading = false,
  error: propError = null,
  title = 'Recent Campus Telemetry Logs',
  subtitle = 'Empirical client Wi-Fi test submissions recorded in PostgreSQL',
  limit = 8,
  onRetry,
}) {
  const [internalTests, setInternalTests] = useState([]);
  const [internalLoading, setInternalLoading] = useState(false);
  const [internalError, setInternalError] = useState(null);

  const loadData = useCallback(async () => {
    if (propTests && propTests.length > 0) return;
    setInternalLoading(true);
    setInternalError(null);
    try {
      const records = await getTestHistory({ limit });
      setInternalTests(records);
    } catch (err) {
      setInternalError(err?.message || 'Could not fetch recent telemetry logs.');
    } finally {
      setInternalLoading(false);
    }
  }, [propTests, limit]);

  useEffect(() => {
    if (propTests && propTests.length > 0) {
      setInternalTests(propTests);
    } else {
      loadData();
    }
  }, [propTests, loadData]);

  const loading = propLoading || internalLoading;
  const error = propError || internalError;
  const activeTests = (propTests && propTests.length > 0) ? propTests : internalTests;

  // 1. Loading State
  if (loading && activeTests.length === 0) {
    return (
      <Card title={title} subtitle={subtitle}>
        <div className="h-48 flex items-center justify-center">
          <Loader label="Fetching recent network tests..." size="md" />
        </div>
      </Card>
    );
  }

  // 2. Error State
  if (error && activeTests.length === 0) {
    return (
      <Card title={title} subtitle={subtitle}>
        <div className="p-5 flex flex-col items-center justify-center text-center bg-[#FBF0EE] dark:bg-[rgba(184,76,58,0.1)] rounded-md border border-[#E8A398]/30">
          <AlertCircle className="w-6 h-6 text-[#B84C3A] mb-1.5" />
          <p className="text-xs text-[#242B38] dark:text-[#E8EDF3] font-medium">
            {typeof error === 'string' ? error : error?.message || 'Failed to load test history logs.'}
          </p>
          <button
            type="button"
            onClick={onRetry || loadData}
            className="mt-2.5 px-3 py-1 text-xs font-semibold text-white bg-[#B84C3A] hover:bg-[#A03D2D] rounded transition-colors cursor-pointer"
          >
            Retry
          </button>
        </div>
      </Card>
    );
  }

  // 3. Empty State
  if (activeTests.length === 0) {
    return (
      <Card title={title} subtitle={subtitle}>
        <EmptyState
          icon={Clock}
          title="No Recent Tests Recorded"
          description="New network performance measurements will be logged here in real-time as users run tests."
        />
      </Card>
    );
  }

  return (
    <Card
      title={title}
      subtitle={subtitle}
      noPadding
      action={
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-[#697586] dark:text-[#8B98A9]">
            {activeTests.length} Recent {activeTests.length === 1 ? 'Record' : 'Records'}
          </span>
          <button
            type="button"
            onClick={loadData}
            className="text-xs text-[#697586] hover:text-[#B84C3A] transition-colors cursor-pointer"
            title="Refresh recent logs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      }
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-[#F3F6F8] dark:bg-[#1A222F] border-b border-[#E4E8EC] dark:border-[#273140] text-[#697586] dark:text-[#8B98A9] font-semibold uppercase tracking-wider text-[11px]">
            <tr>
              <th className="px-4 py-3">Location & Landmark</th>
              <th className="px-4 py-3">Download</th>
              <th className="px-4 py-3">Upload</th>
              <th className="px-4 py-3">Latency</th>
              <th className="px-4 py-3">Quality Diagnosis</th>
              <th className="px-4 py-3 text-right">Recorded At</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E4E8EC] dark:divide-[#273140]">
            {activeTests.map((test) => {
              const download = Number(test.downloadMbps ?? test.download_mbps ?? test.download ?? 0);
              const upload = Number(test.uploadMbps ?? test.upload_mbps ?? test.upload ?? 0);
              const latency = Number(test.latencyMs ?? test.latency_ms ?? test.latency ?? 0);
              const locationName = test.locationName ?? test.location_name ?? test.location ?? 'Campus Zone';
              const timeString = test.createdAt ?? test.created_at ?? test.recorded_at ?? test.time;

              const status = (test.status || (download >= 25 ? 'good' : download >= 10 ? 'fair' : 'weak')).toLowerCase();

              return (
                <tr
                  key={test.id || `${locationName}-${timeString}`}
                  className="hover:bg-[#F3F6F8]/60 dark:hover:bg-[#1A222F]/60 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="font-semibold text-[#242B38] dark:text-[#E8EDF3]">
                      {locationName}
                    </div>
                    {test.measurementSource && (
                      <div className="text-[10px] text-[#697586] dark:text-[#8B98A9] capitalize">
                        Source: {test.measurementSource}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 font-mono font-bold text-[#242B38] dark:text-[#E8EDF3] tabular-nums">
                    {formatSpeed(download)}
                  </td>
                  <td className="px-4 py-3 font-mono text-[#697586] dark:text-[#8B98A9] tabular-nums">
                    {formatSpeed(upload)}
                  </td>
                  <td className="px-4 py-3 font-mono text-[#697586] dark:text-[#8B98A9] tabular-nums">
                    {formatLatency(latency)}
                  </td>
                  <td className="px-4 py-3">
                    <Badge status={status} size="sm" />
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-[#697586] dark:text-[#8B98A9] whitespace-nowrap">
                    {formatTimestamp(timeString)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
