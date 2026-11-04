'use client';

import React from 'react';
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
import { Activity } from 'lucide-react';

/**
 * CampusSignal — Performance Visualization Chart
 * Owner: Abhinandana S
 */
export default function PerformanceChart({
  data = [],
  title = 'Bandwidth & Latency Trajectory',
  subtitle = 'Telemetry timeline of recorded network tests',
}) {
  if (!data || data.length === 0) {
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

  return (
    <Card title={title} subtitle={subtitle}>
      <div className="w-full h-64 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
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
            <Tooltip
              contentStyle={{
                backgroundColor: '#FFFFFF',
                borderColor: '#E4E8EC',
                borderRadius: '6px',
                fontSize: '12px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.06)',
                color: '#242B38',
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
              iconType="circle"
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="download"
              name="Download (Mbps)"
              stroke="#B84C3A"
              strokeWidth={2}
              dot={{ r: 3, fill: '#B84C3A' }}
              activeDot={{ r: 5 }}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="upload"
              name="Upload (Mbps)"
              stroke="#D5A342"
              strokeWidth={1.5}
              strokeDasharray="3 3"
              dot={{ r: 2, fill: '#D5A342' }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="latency"
              name="Latency (ms)"
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
