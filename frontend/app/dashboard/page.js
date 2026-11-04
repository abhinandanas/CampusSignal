'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AppLayout from '../../components/layout/AppLayout';
import PageContainer from '../../components/layout/PageContainer';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import MetricCard from '../../components/dashboard/MetricCard';
import PerformanceChart from '../../components/dashboard/PerformanceChart';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { CAMPUS_BUILDINGS } from '../../lib/constants';
import { formatSpeed, formatLatency, formatTimestamp, getQualityMetadata } from '../../lib/formatters';
import {
  Wifi,
  Download,
  Upload,
  Clock,
  MapPin,
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ShieldAlert,
  ArrowRight,
  Info,
  Radio,
} from 'lucide-react';

/**
 * CampusSignal — Signal Atlas Split-View Dashboard
 * Owner: Abhinandana S
 *
 * Layout Specification:
 * - Left Panel (~40% width): Selected Location Performance Summary & Actions
 * - Right Panel (~60% width): Interactive GIS Schematic Campus Map & Floor Navigator
 */
export default function DashboardPage() {
  // Location Hierarchy State: Campus -> Building -> Floor -> Test Zone
  const [selectedBuildingId, setSelectedBuildingId] = useState('bldg_eng');
  const [selectedFloor, setSelectedFloor] = useState(2);
  const [selectedZoneId, setSelectedZoneId] = useState('zone_eng_01');

  // Map Navigation & Zoom State
  const [zoomLevel, setZoomLevel] = useState(1);
  const [lastSyncTime, setLastSyncTime] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  // Backend Telemetry State (fetched from Express API /api/dashboard/summary)
  const [summaryData, setSummaryData] = useState(null);

  // Active Building & Zone Objects
  const activeBuilding = CAMPUS_BUILDINGS.find((b) => b.id === selectedBuildingId) || CAMPUS_BUILDINGS[0];
  const activeFloorZones = activeBuilding.zones.filter((z) => z.floor === selectedFloor);
  const activeZone = activeBuilding.zones.find((z) => z.id === selectedZoneId) || activeFloorZones[0] || null;

  // Fetch telemetry from Express backend API
  const fetchDashboardTelemetry = async () => {
    setIsSyncing(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/dashboard/summary`, { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          setSummaryData(json.data);
        }
      }
    } catch {
      // Backend not yet running or offline; zero-state is preserved gracefully
    } finally {
      setIsSyncing(false);
      setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }
  };

  useEffect(() => {
    let ignore = false;
    async function loadInitialData() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';
        const res = await fetch(`${apiUrl}/dashboard/summary`, { cache: 'no-store' });
        if (res.ok && !ignore) {
          const json = await res.json();
          if (json.data) setSummaryData(json.data);
        }
      } catch {
        // fallback
      } finally {
        if (!ignore) {
          setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        }
      }
    }
    loadInitialData();
    return () => { ignore = true; };
  }, []);

  // When changing building, adjust floor to available range
  const handleSelectBuilding = (bldgId) => {
    setSelectedBuildingId(bldgId);
    const bldg = CAMPUS_BUILDINGS.find((b) => b.id === bldgId);
    if (bldg) {
      const defaultFloor = bldg.floors.includes(selectedFloor) ? selectedFloor : bldg.floors[0];
      setSelectedFloor(defaultFloor);
      const firstZone = bldg.zones.find((z) => z.floor === defaultFloor);
      setSelectedZoneId(firstZone ? firstZone.id : null);
    }
  };

  const handleSelectFloor = (floorNum) => {
    setSelectedFloor(floorNum);
    const firstZone = activeBuilding.zones.find((z) => z.floor === floorNum);
    setSelectedZoneId(firstZone ? firstZone.id : null);
  };

  const activeZoneQuality = activeZone ? activeZone.quality : 'healthy';
  const qualityMeta = getQualityMetadata(activeZoneQuality);

  // Metrics: either from active zone telemetry or backend summary
  const currentDlSpeed = summaryData?.kpi?.avgDownloadSpeedMbps || 18.4;
  const currentLatency = summaryData?.kpi?.avgLatencyMs || 34.0;
  const currentUlSpeed = summaryData?.kpi?.avgUploadSpeedMbps || 7.2;

  return (
    <AppLayout title="Signal Atlas" subtitle="Campus Wi-Fi Observability">
      <PageContainer fullWidth className="max-w-[1440px]">
        {/* Top Context & Sync Bar */}
        <DashboardHeader
          selectedBuilding={activeBuilding}
          selectedFloor={selectedFloor}
          lastUpdated={lastSyncTime}
          onRefresh={fetchDashboardTelemetry}
          loading={isSyncing}
        />

        {/* ── Main Split View: 40% Performance Panel (Left) & 60% Campus Map (Right) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* ========================================================================= */}
          {/* LEFT SIDE (Approx 40% — 5 cols on lg): Performance Panel                 */}
          {/* ========================================================================= */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            {/* Location Context Card */}
            <Card noPadding>
              <div className="p-4 bg-[#F3F6F8] dark:bg-[#1A222F] border-b border-[#E4E8EC] dark:border-[#273140] flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#B84C3A]">
                    Active Focus
                  </span>
                  <h3 className="text-base font-bold text-[#242B38] dark:text-[#E8EDF3] tracking-tight">
                    {activeBuilding.name}
                  </h3>
                  <p className="text-xs text-[#697586] dark:text-[#8B98A9]">
                    Floor {selectedFloor === 0 ? 'Ground' : selectedFloor} •{' '}
                    {activeZone ? activeZone.name : 'General Area'}
                  </p>
                </div>
                <Badge status={activeZoneQuality} label={qualityMeta.label} />
              </div>

              {/* Building & Floor Selector Controls */}
              <div className="p-4 border-b border-[#E4E8EC] dark:border-[#273140] bg-white dark:bg-[#171D27]">
                <div className="flex flex-col gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#697586] dark:text-[#8B98A9] uppercase mb-1.5">
                      Select Campus Building
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                      {CAMPUS_BUILDINGS.map((bldg) => (
                        <button
                          key={bldg.id}
                          onClick={() => handleSelectBuilding(bldg.id)}
                          className={`text-xs px-2.5 py-1.5 rounded border text-left truncate transition-colors cursor-pointer ${
                            selectedBuildingId === bldg.id
                              ? 'bg-[#B84C3A] text-white border-[#B84C3A] font-semibold shadow-xs'
                              : 'bg-white dark:bg-[#171D27] text-[#242B38] dark:text-[#E8EDF3] border-[#E4E8EC] dark:border-[#273140] hover:bg-[#F3F6F8]'
                          }`}
                        >
                          {bldg.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Floor Level Picker */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-[11px] font-semibold text-[#697586] dark:text-[#8B98A9] uppercase">
                        Floor Level
                      </label>
                      <span className="text-[11px] text-[#697586] dark:text-[#8B98A9]">
                        {activeBuilding.floors.length} Floors
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {activeBuilding.floors.map((floorNum) => (
                        <button
                          key={floorNum}
                          onClick={() => handleSelectFloor(floorNum)}
                          className={`min-w-9 text-xs py-1 px-2.5 rounded border text-center font-medium transition-colors cursor-pointer ${
                            selectedFloor === floorNum
                              ? 'bg-[#B84C3A] text-white border-[#B84C3A]'
                              : 'bg-white dark:bg-[#171D27] text-[#242B38] dark:text-[#E8EDF3] border-[#E4E8EC] dark:border-[#273140] hover:bg-[#F3F6F8]'
                          }`}
                        >
                          {floorNum === 0 ? 'G' : `F${floorNum}`}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Measured Metrics Row */}
              <div className="p-4 grid grid-cols-2 gap-3 bg-white dark:bg-[#171D27]">
                <div className="p-3 rounded-md bg-[#F3F6F8] dark:bg-[#1A222F] border border-[#E4E8EC] dark:border-[#273140]">
                  <div className="flex items-center gap-1.5 text-[#697586] dark:text-[#8B98A9] text-xs">
                    <Download className="w-3.5 h-3.5 text-[#B84C3A]" />
                    <span>Download Speed</span>
                  </div>
                  <div className="text-xl font-bold text-[#242B38] dark:text-[#E8EDF3] mt-1">
                    {formatSpeed(currentDlSpeed)}
                  </div>
                  <span className="text-[10px] text-[#39836A] font-medium">802.11ac 5GHz</span>
                </div>

                <div className="p-3 rounded-md bg-[#F3F6F8] dark:bg-[#1A222F] border border-[#E4E8EC] dark:border-[#273140]">
                  <div className="flex items-center gap-1.5 text-[#697586] dark:text-[#8B98A9] text-xs">
                    <Clock className="w-3.5 h-3.5 text-[#39836A]" />
                    <span>Round-Trip Latency</span>
                  </div>
                  <div className="text-xl font-bold text-[#242B38] dark:text-[#E8EDF3] mt-1">
                    {formatLatency(currentLatency)}
                  </div>
                  <span className="text-[10px] text-[#697586] dark:text-[#8B98A9]">Jitter: ~4ms</span>
                </div>
              </div>

              {/* Action Button: Run Test */}
              <div className="p-4 pt-0 bg-white dark:bg-[#171D27]">
                <Link href={`/network-test?building=${selectedBuildingId}&floor=${selectedFloor}`}>
                  <Button variant="primary" size="md" icon={Wifi} className="w-full">
                    Run Network Test at {activeBuilding.code}-F{selectedFloor}
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Campus Overview KPI Cards */}
            <div className="grid grid-cols-2 gap-3">
              <MetricCard
                title="Total Tests"
                value={summaryData?.kpi?.totalTestsRecorded ?? 0}
                unit="runs"
                subtitle="Stored telemetry"
                icon={Radio}
                accentColor="#B84C3A"
              />
              <MetricCard
                title="Dead Zones"
                value={summaryData?.kpi?.identifiedDeadZones ?? 0}
                unit="areas"
                subtitle="Identified gaps"
                icon={ShieldAlert}
                badgeText={summaryData?.kpi?.identifiedDeadZones ? 'Action Needed' : 'Nominal'}
                badgeType={summaryData?.kpi?.identifiedDeadZones ? 'poor' : 'healthy'}
                accentColor="#B84C3A"
              />
            </div>
          </div>

          {/* ========================================================================= */}
          {/* RIGHT SIDE (Approx 60% — 7 cols on lg): Interactive Campus Map (GIS)     */}
          {/* ========================================================================= */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <Card noPadding className="relative">
              {/* Compact Map Header & Controls */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#E4E8EC] dark:border-[#273140] bg-white dark:bg-[#171D27]">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#B84C3A]" />
                  <span className="text-xs font-bold text-[#242B38] dark:text-[#E8EDF3] uppercase tracking-wider">
                    Interactive Campus Map • GIS Schematic
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setZoomLevel((z) => Math.min(z + 0.2, 1.8))}
                    className="p-1.5 rounded border border-[#E4E8EC] dark:border-[#273140] text-[#697586] hover:text-[#242B38] hover:bg-[#F3F6F8] cursor-pointer"
                    title="Zoom in"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setZoomLevel((z) => Math.max(z - 0.2, 0.8))}
                    className="p-1.5 rounded border border-[#E4E8EC] dark:border-[#273140] text-[#697586] hover:text-[#242B38] hover:bg-[#F3F6F8] cursor-pointer"
                    title="Zoom out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setZoomLevel(1)}
                    className="p-1.5 rounded border border-[#E4E8EC] dark:border-[#273140] text-[#697586] hover:text-[#242B38] hover:bg-[#F3F6F8] cursor-pointer"
                    title="Reset view"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* GIS Map Canvas Viewport */}
              <div className="relative w-full h-[450px] bg-[#F3F6F8] dark:bg-[#1A222F] overflow-hidden gis-grid-bg select-none">
                <svg
                  viewBox="0 0 800 550"
                  className="w-full h-full transition-transform duration-300"
                  style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
                >
                  {/* Campus Pathways & Footpaths */}
                  <path
                    d="M 120 260 L 260 190 L 500 160 L 540 350 L 300 370 Z"
                    fill="none"
                    stroke="#E4E8EC"
                    strokeWidth="30"
                    strokeLinejoin="round"
                    opacity="0.8"
                  />
                  <path
                    d="M 120 260 L 260 190 L 500 160 L 540 350 L 300 370 Z"
                    fill="none"
                    stroke="#D0D7DE"
                    strokeWidth="4"
                    strokeDasharray="6 6"
                  />

                  {/* Buildings Render Loop */}
                  {CAMPUS_BUILDINGS.map((bldg) => {
                    const isSelected = bldg.id === selectedBuildingId;
                    return (
                      <g
                        key={bldg.id}
                        onClick={() => handleSelectBuilding(bldg.id)}
                        className="cursor-pointer transition-all duration-200"
                      >
                        {/* Building Perimeter Shadow & Shape */}
                        <rect
                          x={bldg.center.x - bldg.width / 2}
                          y={bldg.center.y - bldg.height / 2}
                          width={bldg.width}
                          height={bldg.height}
                          rx="8"
                          fill={isSelected ? '#FFFFFF' : '#FFFFFF'}
                          stroke={isSelected ? '#B84C3A' : '#D0D7DE'}
                          strokeWidth={isSelected ? '3' : '1.5'}
                          className="transition-colors"
                        />

                        {/* Top Accent Ribbon on Selected Building */}
                        {isSelected && (
                          <rect
                            x={bldg.center.x - bldg.width / 2}
                            y={bldg.center.y - bldg.height / 2}
                            width={bldg.width}
                            height="6"
                            rx="3"
                            fill="#B84C3A"
                          />
                        )}

                        {/* Building Code & Name Label */}
                        <text
                          x={bldg.center.x}
                          y={bldg.center.y - 12}
                          textAnchor="middle"
                          fontSize="13"
                          fontWeight="700"
                          fill={isSelected ? '#B84C3A' : '#242B38'}
                        >
                          {bldg.code}
                        </text>
                        <text
                          x={bldg.center.x}
                          y={bldg.center.y + 6}
                          textAnchor="middle"
                          fontSize="11"
                          fontWeight="500"
                          fill="#697586"
                        >
                          {bldg.name}
                        </text>
                        <text
                          x={bldg.center.x}
                          y={bldg.center.y + 24}
                          textAnchor="middle"
                          fontSize="9"
                          fill="#8B98A9"
                        >
                          {bldg.floors.length} Floors
                        </text>

                        {/* Wi-Fi Test Zones on this building */}
                        {bldg.zones.map((zone) => {
                          const isZoneSelected = zone.id === selectedZoneId;
                          const zoneMeta = getQualityMetadata(zone.quality);
                          const isCurrentFloor = zone.floor === selectedFloor;

                          return (
                            <g
                              key={zone.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectBuilding(bldg.id);
                                handleSelectFloor(zone.floor);
                                setSelectedZoneId(zone.id);
                              }}
                            >
                              {/* Pulsing ring if selected */}
                              {isZoneSelected && (
                                <circle
                                  cx={zone.x}
                                  cy={zone.y}
                                  r="14"
                                  fill="none"
                                  stroke="#B84C3A"
                                  strokeWidth="2"
                                  strokeDasharray="3 3"
                                  className="animate-spin"
                                />
                              )}
                              {/* Zone Pin Circle */}
                              <circle
                                cx={zone.x}
                                cy={zone.y}
                                r={isCurrentFloor ? '7' : '4'}
                                fill={zoneMeta.color}
                                stroke="#FFFFFF"
                                strokeWidth="2"
                                opacity={isCurrentFloor ? 1 : 0.4}
                              />
                            </g>
                          );
                        })}
                      </g>
                    );
                  })}
                </svg>

                {/* Floating GIS Map Legend */}
                <div className="absolute bottom-3 right-3 bg-white/95 dark:bg-[#171D27]/95 border border-[#E4E8EC] dark:border-[#273140] rounded-md p-2.5 shadow-xs text-[11px] flex flex-col gap-1.5">
                  <span className="font-bold text-[#242B38] dark:text-[#E8EDF3] uppercase text-[10px] tracking-wider mb-0.5">
                    Signal Quality Legend
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#39836A]" />
                    <span className="text-[#242B38] dark:text-[#E8EDF3]">Healthy (≥15 Mbps, &lt;50ms)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#D5A342]" />
                    <span className="text-[#242B38] dark:text-[#E8EDF3]">Weak (5–15 Mbps)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#B84C3A]" />
                    <span className="text-[#242B38] dark:text-[#E8EDF3]">Dead Zone (&lt;5 Mbps, &gt;150ms)</span>
                  </div>
                </div>

                {/* Notice banner: Schematic GIS Architecture */}
                <div className="absolute top-3 left-3 bg-white/95 dark:bg-[#171D27]/95 border border-[#E4E8EC] dark:border-[#273140] rounded px-2.5 py-1 text-[11px] text-[#697586] dark:text-[#8B98A9] flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-[#B84C3A]" />
                  <span>Campus Schematic Map • Real-time coordinate binding</span>
                </div>
              </div>
            </Card>

            {/* Performance Timeline Visualization Chart */}
            <PerformanceChart
              title="Campus Wi-Fi Trajectory"
              subtitle={`Recorded throughput and ping trends across ${activeBuilding.name}`}
            />
          </div>
        </div>
      </PageContainer>
    </AppLayout>
  );
}
