'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import Card from '../common/Card';
import EmptyState from '../common/EmptyState';
import Loader from '../common/Loader';
import { Activity, AlertCircle, RefreshCw } from 'lucide-react';
import { formatSpeed, formatLatency, formatTimestamp } from '../../lib/formatters';
import { getTestHistory } from '../../services/historyService';

/**
 * CampusSignal — Performance Visualization Chart
 * Owner: Santosh (USN: 4SF24IS100)
 *
 * Visualizes longitudinal telemetry data:
 * - Download Speed (Mbps, Left Y-Axis, Terracotta brand #B84C3A)
 * - Upload Speed (Mbps, Left Y-Axis, Weak amber #D5A342)
 * - Latency / RTT (ms, Right Y-Axis, Healthy teal #39836A)
 */
export default function PerformanceChart({
  data: propData,
  loading: propLoading = false,
  error: propError = null,
  title = 'Bandwidth & Latency Trajectory',
  subtitle = 'Telemetry timeline of recorded network tests across campus',
  onRetry,
}) {
  const [internalData, setInternalData] = useState([]);
  const [internalLoading, setInternalLoading] = useState(false);
  const [internalError, setInternalError] = useState(null);

  // Self-fetch if data is not supplied via props
  const loadData = useCallback(async () => {
    if (propData && propData.length > 0) return;
    setInternalLoading(true);
    setInternalError(null);
    try {
      const records = await getTestHistory({ limit: 20 });
      // Reverse to chronological order (oldest to newest for timeline chart)
      setInternalData([...records].reverse());
    } catch (err) {
      setInternalError(err?.message || 'Could not load performance telemetry');
    } finally {
      setInternalLoading(false);
    }
  }, [propData]);

  useEffect(() => {
    if (propData && propData.length > 0) {
      setInternalData(propData);
    } else {
      loadData();
    }
  }, [propData, loadData]);

  const loading = propLoading || internalLoading;
  const error = propError || internalError;
  const activeData = (propData && propData.length > 0) ? propData : internalData;

  // 1. Loading State
  if (loading && activeData.length === 0) {
    return (
      <Card title={title} subtitle={subtitle}>
        <div className="h-64 flex items-center justify-center">
          <Loader label="Plotting performance metrics..." size="md" />
        </div>
      </Card>
    );
  }

  // 2. Error State
  if (error && activeData.length === 0) {
    return (
      <Card title={title} subtitle={subtitle}>
        <div className="h-64 flex flex-col items-center justify-center text-center p-6 bg-[#FBF0EE] dark:bg-[rgba(184,76,58,0.1)] border border-[#E8A398]/30 rounded-lg">
          <AlertCircle className="w-8 h-8 text-[#B84C3A] mb-2" />
          <h4 className="text-sm font-semibold text-[#242B38] dark:text-[#E8EDF3]">
            Unable to Load Performance Data
          </h4>
          <p className="text-xs text-[#697586] dark:text-[#8B98A9] max-w-sm mt-1 mb-3">
            {typeof error === 'string' ? error : error?.message || 'A network error occurred while querying telemetry.'}
          </p>
          <button
            type="button"
            onClick={onRetry || loadData}
            className="px-3 py-1.5 text-xs font-medium text-white bg-[#B84C3A] hover:bg-[#A03D2D] rounded-md transition-colors cursor-pointer"
          >
            Retry Telemetry Query
          </button>
        </div>
      </Card>
    );
  }

  // 3. Normalize incoming data points
  const chartData = (activeData || []).map((item, index) => {
    const rawTime = item.time ?? item.createdAt ?? item.created_at ?? item.recorded_at;
    let formattedTime = `Test ${index + 1}`;
    if (rawTime) {
      try {
        const d = new Date(rawTime);
        if (!isNaN(d.getTime())) {
          formattedTime = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else {
          formattedTime = String(rawTime);
        }
      } catch {
        formattedTime = String(rawTime);
      }
    }

    return {
      time: formattedTime,
      fullDate: rawTime ? formatTimestamp(rawTime) : formattedTime,
      download: Number(item.download ?? item.downloadMbps ?? item.download_mbps ?? 0),
      upload: Number(item.upload ?? item.uploadMbps ?? item.upload_mbps ?? 0),
      latency: Number(item.latency ?? item.latencyMs ?? item.latency_ms ?? 0),
      location: item.locationName ?? item.location_name ?? item.location ?? 'Campus Zone',
    };
  });

  // 4. Empty State
  if (chartData.length === 0) {
    return (
      <Card title={title} subtitle={subtitle}>
        <EmptyState
          icon={Activity}
          title="No Performance Telemetry"
          description="Timeline graphs will automatically visualize once students record throughput and ping tests."
        />
      </Card>
    );
  }

  // Custom Recharts Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;
    const point = payload[0]?.payload;

    return (
      <div className="bg-white dark:bg-[#171D27] border border-[#E4E8EC] dark:border-[#273140] rounded-md shadow-md p-3 text-xs">
        <p className="font-semibold text-[#242B38] dark:text-[#E8EDF3] mb-1">
          {point?.location || label}
        </p>
        <p className="text-[11px] text-[#697586] dark:text-[#8B98A9] mb-2 font-mono">
          {point?.fullDate || label}
        </p>
        <div className="flex flex-col gap-1 font-mono">
          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-[#B84C3A] font-medium">
              <span className="w-2 h-2 rounded-full bg-[#B84C3A]" />
              Download:
            </span>
            <span className="font-bold text-[#242B38] dark:text-[#E8EDF3]">
              {formatSpeed(point?.download)}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-[#D5A342] font-medium">
              <span className="w-2 h-2 rounded-full bg-[#D5A342]" />
              Upload:
            </span>
            <span className="font-bold text-[#242B38] dark:text-[#E8EDF3]">
              {formatSpeed(point?.upload)}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-[#39836A] font-medium">
              <span className="w-2 h-2 rounded-full bg-[#39836A]" />
              Latency:
            </span>
            <span className="font-bold text-[#242B38] dark:text-[#E8EDF3]">
              {formatLatency(point?.latency)}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card
      title={title}
      subtitle={subtitle}
      action={
        <button
          type="button"
          onClick={loadData}
          className="text-xs text-[#697586] hover:text-[#B84C3A] flex items-center gap-1 cursor-pointer transition-colors"
          title="Refresh chart data"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      }
    >
      <div className="w-full h-72 pt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 15, left: -15, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E4E8EC" opacity={0.6} />
            <XAxis
              dataKey="time"
              tick={{ fill: '#697586', fontSize: 11 }}
              stroke="#E4E8EC"
            />
            <YAxis
              yAxisId="left"
              tick={{ fill: '#697586', fontSize: 11 }}
              stroke="#E4E8EC"
              unit="M"
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fill: '#697586', fontSize: 11 }}
              stroke="#E4E8EC"
              unit="ms"
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
              iconType="circle"
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="download"
              name="Download Speed (Mbps)"
              stroke="#B84C3A"
              strokeWidth={2.2}
              dot={{ r: 3, fill: '#B84C3A' }}
              activeDot={{ r: 5 }}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="upload"
              name="Upload Speed (Mbps)"
              stroke="#D5A342"
              strokeWidth={1.8}
              strokeDasharray="4 4"
              dot={{ r: 2.5, fill: '#D5A342' }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="latency"
              name="Latency RTT (ms)"
              stroke="#39836A"
              strokeWidth={2}
              dot={{ r: 3, fill: '#39836A' }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
