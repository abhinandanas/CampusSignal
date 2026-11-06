'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import EmptyState from '../common/EmptyState';
import Loader from '../common/Loader';
import { BarChart3, ArrowUpRight, Clock, MapPin, RefreshCw } from 'lucide-react';
import { formatSpeed, formatLatency } from '../../lib/formatters';
import { getCampusLocations } from '../../services/locationService';
import { getTestHistory } from '../../services/historyService';

/**
 * CampusSignal — Location Comparison Component
 * Owner: Santosh (USN: 4SF24IS100)
 *
 * Compares empirical Wi-Fi performance metrics across campus locations / structures.
 * Shows average download speed, upload speed, latency (RTT), and identified dead-zones.
 */
export default function LocationComparison({
  data: propData,
  locations: propLocations,
  tests: propTests,
  loading: propLoading = false,
  error: propError = null,
  title = 'Campus Comparative Throughput',
  subtitle = 'Performance benchmark and dead-zone telemetry across campus zones',
  targetSpeed = 15.0,
}) {
  const [internalLocations, setInternalLocations] = useState([]);
  const [internalTests, setInternalTests] = useState([]);
  const [internalLoading, setInternalLoading] = useState(false);
  const [internalError, setInternalError] = useState(null);

  const loadData = useCallback(async () => {
    if ((propData && propData.length > 0) || (propLocations && propLocations.length > 0)) return;
    setInternalLoading(true);
    setInternalError(null);
    try {
      const [locs, recs] = await Promise.all([
        getCampusLocations().catch(() => []),
        getTestHistory({ limit: 50 }).catch(() => []),
      ]);
      setInternalLocations(locs);
      setInternalTests(recs);
    } catch (err) {
      setInternalError(err?.message || 'Could not aggregate location data.');
    } finally {
      setInternalLoading(false);
    }
  }, [propData, propLocations]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const loading = propLoading || internalLoading;
  const error = propError || internalError;
  const activeLocations = (propLocations && propLocations.length > 0) ? propLocations : internalLocations;
  const activeTests = (propTests && propTests.length > 0) ? propTests : internalTests;

  // Process and normalize items to compare
  let items = [];

  if (Array.isArray(propData) && propData.length > 0) {
    items = propData;
  } else if (Array.isArray(activeLocations) && activeLocations.length > 0) {
    const buildingMap = new Map();

    activeLocations.forEach((loc) => {
      const bldg = loc.buildingName || loc.building_name || 'Campus Building';
      if (!buildingMap.has(bldg)) {
        buildingMap.set(bldg, {
          name: bldg,
          totalDownload: 0,
          totalUpload: 0,
          totalLatency: 0,
          testCount: 0,
          deadZones: 0,
          zones: [],
        });
      }
      const entry = buildingMap.get(bldg);
      entry.zones.push(loc);

      if (loc.downloadSpeedMbps != null) {
        entry.totalDownload += Number(loc.downloadSpeedMbps);
        entry.totalLatency += Number(loc.latencyMs || 0);
        entry.testCount += 1;
        if (Number(loc.downloadSpeedMbps) < 5.0) {
          entry.deadZones += 1;
        }
      }
    });

    if (Array.isArray(activeTests)) {
      activeTests.forEach((t) => {
        const dl = Number(t.downloadMbps ?? t.download_mbps ?? 0);
        const ul = Number(t.uploadMbps ?? t.upload_mbps ?? 0);
        const lat = Number(t.latencyMs ?? t.latency_ms ?? 0);
        const locName = t.locationName || t.location_name || '';

        for (const [bldg, entry] of buildingMap.entries()) {
          if (locName.includes(bldg) || entry.zones.some((z) => z.id === t.locationId)) {
            entry.totalDownload += dl;
            entry.totalUpload += ul;
            entry.totalLatency += lat;
            entry.testCount += 1;
            if (dl < 5.0) entry.deadZones += 1;
            break;
          }
        }
      });
    }

    items = Array.from(buildingMap.values()).map((entry) => ({
      name: entry.name,
      avgDownload: entry.testCount > 0 ? entry.totalDownload / entry.testCount : 0,
      avgUpload: entry.testCount > 0 ? entry.totalUpload / entry.testCount : 0,
      avgLatency: entry.testCount > 0 ? entry.totalLatency / entry.testCount : 0,
      totalTests: entry.testCount,
      deadZones: entry.deadZones,
    }));
  }

  // 1. Loading State
  if (loading && items.length === 0) {
    return (
      <Card title={title} subtitle={subtitle}>
        <div className="h-56 flex items-center justify-center">
          <Loader label="Aggregating location metrics..." size="md" />
        </div>
      </Card>
    );
  }

  // 2. Error State
  if (error && items.length === 0) {
    return (
      <Card title={title} subtitle={subtitle}>
        <div className="p-4 bg-[#FBF0EE] dark:bg-[rgba(184,76,58,0.1)] text-[#B84C3A] text-xs rounded-md">
          {typeof error === 'string' ? error : error?.message || 'Failed to calculate location comparisons.'}
        </div>
      </Card>
    );
  }

  // 3. Empty State
  if (items.length === 0) {
    return (
      <Card title={title} subtitle={subtitle}>
        <EmptyState
          icon={BarChart3}
          title="No Location Comparisons Available"
          description="Campus location performance metrics will appear here once speed tests are submitted across campus."
        />
      </Card>
    );
  }

  const maxBaseline = Math.max(30, ...items.map((i) => i.avgDownload || 0));

  return (
    <Card
      title={title}
      subtitle={subtitle}
      action={
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-[#697586] dark:text-[#8B98A9]">
            Target: {targetSpeed.toFixed(1)} Mbps
          </span>
          <button
            type="button"
            onClick={loadData}
            className="text-xs text-[#697586] hover:text-[#B84C3A] transition-colors cursor-pointer"
            title="Refresh location telemetry"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        {items.map((item) => {
          const download = Number(item.avgDownload || item.download || 0);
          const upload = Number(item.avgUpload || item.upload || 0);
          const latency = Number(item.avgLatency || item.latency || 0);
          const deadZones = Number(item.deadZones || 0);

          const percent = Math.min((download / maxBaseline) * 100, 100);
          const isHealthy = download >= targetSpeed;
          const isWeak = download >= 5.0 && download < targetSpeed;

          return (
            <div
              key={item.name}
              className="p-3.5 rounded-lg border border-[#E4E8EC] dark:border-[#273140] bg-white dark:bg-[#171D27] hover:border-[#B84C3A]/40 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-md bg-[#F3F6F8] dark:bg-[#1F2734] text-[#B84C3A] flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-semibold text-[#242B38] dark:text-[#E8EDF3]">
                      {item.name}
                    </h4>
                    {item.totalTests != null && (
                      <span className="text-[11px] text-[#697586] dark:text-[#8B98A9]">
                        {item.totalTests} {item.totalTests === 1 ? 'test' : 'tests'} recorded
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {deadZones > 0 && (
                    <Badge
                      status="poor"
                      label={`${deadZones} Dead Zone${deadZones > 1 ? 's' : ''}`}
                      size="sm"
                    />
                  )}
                  <div className="text-right">
                    <span className="text-xs sm:text-sm font-bold font-mono text-[#242B38] dark:text-[#E8EDF3]">
                      {formatSpeed(download)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Visual Meter Bar */}
              <div className="w-full h-2 rounded-full bg-[#F3F6F8] dark:bg-[#1B222E] overflow-hidden border border-[#E4E8EC] dark:border-[#273140] my-2">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isHealthy
                      ? 'bg-[#39836A]'
                      : isWeak
                      ? 'bg-[#D5A342]'
                      : 'bg-[#B84C3A]'
                  }`}
                  style={{ width: `${Math.max(percent, 3)}%` }}
                />
              </div>

              {/* Sub-metrics: Upload & Latency */}
              <div className="flex items-center justify-between text-[11px] text-[#697586] dark:text-[#8B98A9] font-mono pt-1">
                <div className="flex items-center gap-1">
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#D5A342]" />
                  <span>Up: {formatSpeed(upload)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#39836A]" />
                  <span>RTT: {formatLatency(latency)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
