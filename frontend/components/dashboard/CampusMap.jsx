"use client";

import React, { useState } from "react";
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Layers,
  MapPin,
  Compass,
  Wifi,
  Navigation,
  Eye,
  Info,
} from "lucide-react";

/**
 * CampusMap — Signal Atlas Interactive GIS Schematic Canvas
 *
 * Implements:
 * 1. Precision GIS-styled vector schematic of the university campus.
 * 2. Multi-building, multi-floor navigation (Ground through 5th floor).
 * 3. Interactive selectable rooms and AP nodes with live telemetry badges.
 * 4. Terracotta (#B84C3A) active location indicator.
 * 5. Zoom / Pan / Reset controls.
 * 6. Signal quality legend (Healthy, Weak, Dead Zone).
 */
export default function CampusMap({
  buildings = [],
  selectedBuilding,
  selectedFloor,
  selectedLocation,
  onSelectLocation,
  onSelectBuilding,
  onSelectFloor,
  filterMode = "all",
}) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showGrid, setShowGrid] = useState(true);
  const [showAps, setShowAps] = useState(true);

  const handleZoomIn = () => setZoomLevel((z) => Math.min(z + 0.25, 2.2));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(z - 0.25, 0.75));
  const handleResetZoom = () => setZoomLevel(1);

  // Available floors for the currently selected building
  const availableFloors = selectedBuilding?.floors || [0, 1, 2, 3, 4];

  return (
    <div className="relative flex flex-col h-full w-full bg-[var(--atlas-map-bg)] border border-[var(--atlas-border)] rounded-md overflow-hidden select-none">
      {/* Top Map Context Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 bg-[var(--atlas-card)]/90 backdrop-blur-xs border-b border-[var(--atlas-border)] z-10">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--atlas-text-primary)]">
            <Compass className="w-3.5 h-3.5 text-[var(--atlas-terracotta)]" />
            <span>Campus GIS Atlas</span>
          </span>
          <span className="text-xs text-[var(--atlas-text-secondary)]">|</span>
          <span className="text-xs font-medium text-[var(--atlas-text-secondary)]">
            {selectedBuilding ? selectedBuilding.name : "Overview"} •{" "}
            {selectedFloor === 0 ? "Ground Floor" : `Floor ${selectedFloor}`}
          </span>
        </div>

        {/* Floor Selection Toolbar */}
        <div className="flex items-center gap-1 bg-[var(--atlas-map-bg)] border border-[var(--atlas-border)] rounded p-0.5">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--atlas-text-secondary)] px-1.5">
            Floor:
          </span>
          {availableFloors.map((fl) => {
            const isFlActive = selectedFloor === fl;
            return (
              <button
                key={fl}
                onClick={() => onSelectFloor && onSelectFloor(fl)}
                className={`px-2 py-0.5 text-xs rounded font-medium transition-colors ${
                  isFlActive
                    ? "bg-[var(--atlas-terracotta)] text-white shadow-2xs font-bold"
                    : "text-[var(--atlas-text-secondary)] hover:text-[var(--atlas-text-primary)]"
                }`}
              >
                {fl === 0 ? "G" : `${fl}F`}
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive GIS SVG Canvas Area */}
      <div className="relative flex-1 w-full min-h-[460px] lg:min-h-[580px] overflow-hidden flex items-center justify-center p-4">
        {/* Cartographic Coordinate Grid */}
        {showGrid && (
          <div
            className="absolute inset-0 opacity-[0.35] pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle, var(--atlas-text-secondary) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />
        )}

        {/* Scalable GIS Vector Model */}
        <div
          className="relative transition-transform duration-200 ease-out origin-center"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <svg
            viewBox="0 0 900 600"
            className="w-[820px] h-[550px] drop-shadow-2xs"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Campus Pathways & Access Corridors */}
            <path
              d="M 50 280 L 850 280 M 450 40 L 450 560 M 240 180 L 680 420 M 240 420 L 680 180"
              stroke="var(--atlas-border)"
              strokeWidth="10"
              strokeLinecap="round"
            />
            <path
              d="M 50 280 L 850 280 M 450 40 L 450 560"
              stroke="var(--atlas-card)"
              strokeWidth="6"
              strokeLinecap="round"
            />

            {/* Central Courtyard / Quad */}
            <circle
              cx="450"
              cy="280"
              r="48"
              fill="var(--atlas-map-bg)"
              stroke="var(--atlas-border)"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
            <text
              x="450"
              y="284"
              textAnchor="middle"
              fontSize="11"
              fontWeight="600"
              fill="var(--atlas-text-secondary)"
              className="tracking-wider uppercase"
            >
              Central Quad
            </text>

            {/* ── BUILDING 1: Academic Block A ── */}
            {renderBuildingBlock({
              id: "bldg_block_a",
              name: "Academic Block A",
              x: 100,
              y: 80,
              width: 250,
              height: 160,
              floorsCount: 4,
              isSelected: selectedBuilding?.id === "bldg_block_a",
              onClick: () => onSelectBuilding && onSelectBuilding("bldg_block_a"),
              rooms: [
                { id: "loc_01", name: "ISE Lab 3", fl: 2, x: 120, y: 110, w: 100, h: 55, status: "healthy", speed: "18.4 Mbps" },
                { id: "loc_02", name: "Lecture Hall 102", fl: 1, x: 230, y: 110, w: 100, h: 55, status: "healthy", speed: "24.1 Mbps" },
                { id: "loc_03", name: "Seminar Hall 4A", fl: 4, x: 120, y: 175, w: 100, h: 50, status: "weak", speed: "7.8 Mbps" },
                { id: "loc_04", name: "Basement Server Room", fl: 0, x: 230, y: 175, w: 100, h: 50, status: "poor", speed: "1.2 Mbps" },
              ],
              selectedFloor,
              selectedLocation,
              onSelectLocation,
              filterMode,
            })}

            {/* ── BUILDING 2: Central Library ── */}
            {renderBuildingBlock({
              id: "bldg_library",
              name: "Central Library",
              x: 550,
              y: 70,
              width: 260,
              height: 170,
              floorsCount: 3,
              isSelected: selectedBuilding?.id === "bldg_library",
              onClick: () => onSelectBuilding && onSelectBuilding("bldg_library"),
              rooms: [
                { id: "loc_05", name: "1F Quiet Reading", fl: 1, x: 570, y: 100, w: 105, h: 60, status: "healthy", speed: "28.5 Mbps" },
                { id: "loc_06", name: "2F Periodical Room", fl: 2, x: 685, y: 100, w: 105, h: 60, status: "healthy", speed: "21.0 Mbps" },
                { id: "loc_07", name: "Ground Reference Stacks", fl: 0, x: 570, y: 170, w: 105, h: 55, status: "poor", speed: "0.9 Mbps" },
                { id: "loc_08", name: "3F Digital Media Lab", fl: 3, x: 685, y: 170, w: 105, h: 55, status: "weak", speed: "9.4 Mbps" },
              ],
              selectedFloor,
              selectedLocation,
              onSelectLocation,
              filterMode,
            })}

            {/* ── BUILDING 3: Technology Tower ── */}
            {renderBuildingBlock({
              id: "bldg_tech_tower",
              name: "Technology Tower",
              x: 90,
              y: 330,
              width: 270,
              height: 180,
              floorsCount: 6,
              isSelected: selectedBuilding?.id === "bldg_tech_tower",
              onClick: () => onSelectBuilding && onSelectBuilding("bldg_tech_tower"),
              rooms: [
                { id: "loc_09", name: "3F Network Cloud Lab", fl: 3, x: 110, y: 360, w: 110, h: 65, status: "healthy", speed: "34.2 Mbps" },
                { id: "loc_10", name: "Ground Auditorium", fl: 0, x: 230, y: 360, w: 110, h: 65, status: "weak", speed: "6.5 Mbps" },
                { id: "loc_11", name: "5F Dean & Admin Suites", fl: 5, x: 110, y: 435, w: 110, h: 60, status: "healthy", speed: "19.8 Mbps" },
                { id: "loc_12", name: "2F Hardware Workshop", fl: 2, x: 230, y: 435, w: 110, h: 60, status: "poor", speed: "2.1 Mbps" },
              ],
              selectedFloor,
              selectedLocation,
              onSelectLocation,
              filterMode,
            })}

            {/* ── BUILDING 4: Student Hub & Cafeteria ── */}
            {renderBuildingBlock({
              id: "bldg_student_hub",
              name: "Student Hub & Cafeteria",
              x: 540,
              y: 340,
              width: 280,
              height: 170,
              floorsCount: 2,
              isSelected: selectedBuilding?.id === "bldg_student_hub",
              onClick: () => onSelectBuilding && onSelectBuilding("bldg_student_hub"),
              rooms: [
                { id: "loc_13", name: "Food Court Common", fl: 0, x: 560, y: 370, w: 115, h: 60, status: "weak", speed: "5.8 Mbps" },
                { id: "loc_14", name: "1F Indoor Sports Club", fl: 1, x: 685, y: 370, w: 115, h: 60, status: "healthy", speed: "16.2 Mbps" },
                { id: "loc_15", name: "Ground Outdoor Deck", fl: 0, x: 560, y: 440, w: 115, h: 55, status: "healthy", speed: "22.0 Mbps" },
                { id: "loc_16", name: "1F Club Discussion Hub", fl: 1, x: 685, y: 440, w: 115, h: 55, status: "weak", speed: "11.2 Mbps" },
              ],
              selectedFloor,
              selectedLocation,
              onSelectLocation,
              filterMode,
            })}
          </svg>
        </div>

        {/* Map Legend (Bottom-Left Overlay) */}
        <div className="absolute bottom-3 left-3 bg-[var(--atlas-card)]/95 border border-[var(--atlas-border)] rounded-md p-2.5 shadow-sm text-xs z-10">
          <div className="text-[11px] font-semibold text-[var(--atlas-text-secondary)] uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <Info className="w-3 h-3 text-[var(--atlas-terracotta)]" />
            <span>Telemetry Legend</span>
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--atlas-healthy)] border border-white dark:border-black" />
              <span className="text-[var(--atlas-text-primary)]">Healthy (≥ 15 Mbps)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--atlas-weak)] border border-white dark:border-black" />
              <span className="text-[var(--atlas-text-primary)]">Weak (5–15 Mbps)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--atlas-poor)] border border-white dark:border-black" />
              <span className="text-[var(--atlas-text-primary)]">Dead Zone (&lt; 5 Mbps)</span>
            </div>
            <div className="flex items-center gap-2 pt-1 border-t border-[var(--atlas-divider)]">
              <span className="w-2.5 h-2.5 rounded-full ring-2 ring-[var(--atlas-terracotta)] bg-transparent" />
              <span className="text-[var(--atlas-terracotta)] font-medium">Selected Location</span>
            </div>
          </div>
        </div>

        {/* Map Navigation Controls (Bottom-Right Overlay) */}
        <div className="absolute bottom-3 right-3 flex flex-col gap-1 bg-[var(--atlas-card)] border border-[var(--atlas-border)] rounded-md p-1 shadow-sm z-10">
          <button
            onClick={handleZoomIn}
            title="Zoom In"
            className="p-1.5 rounded hover:bg-[var(--atlas-map-bg)] text-[var(--atlas-text-primary)] transition-colors"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            title="Zoom Out"
            className="p-1.5 rounded hover:bg-[var(--atlas-map-bg)] text-[var(--atlas-text-primary)] transition-colors"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetZoom}
            title="Fit to Campus"
            className="p-1.5 rounded hover:bg-[var(--atlas-map-bg)] text-[var(--atlas-text-primary)] transition-colors"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Helper to render individual architectural building blocks with sub-rooms
 */
function renderBuildingBlock({
  id,
  name,
  x,
  y,
  width,
  height,
  floorsCount,
  isSelected,
  onClick,
  rooms = [],
  selectedFloor,
  selectedLocation,
  onSelectLocation,
  filterMode,
}) {
  return (
    <g key={id} className="cursor-pointer transition-all">
      {/* Outer Building Footprint */}
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx="8"
        fill="var(--atlas-card)"
        stroke={isSelected ? "var(--atlas-terracotta)" : "var(--atlas-border)"}
        strokeWidth={isSelected ? "3" : "1.5"}
        onClick={onClick}
        className="transition-colors hover:stroke-[var(--atlas-terracotta)]/70"
      />

      {/* Building Header Tag */}
      <rect
        x={x}
        y={y}
        width={width}
        height="30"
        rx="8"
        fill={isSelected ? "var(--atlas-terracotta-subtle)" : "var(--atlas-map-bg)"}
        onClick={onClick}
      />
      <text
        x={x + 12}
        y={y + 19}
        fontSize="12"
        fontWeight="700"
        fill={isSelected ? "var(--atlas-terracotta)" : "var(--atlas-text-primary)"}
      >
        {name}
      </text>
      <text
        x={x + width - 12}
        y={y + 19}
        fontSize="10"
        textAnchor="end"
        fill="var(--atlas-text-secondary)"
        fontWeight="500"
      >
        {floorsCount} Floors
      </text>

      {/* Rooms on the floor */}
      {rooms.map((room) => {
        // Check filter mode
        if (filterMode === "healthy" && room.status !== "healthy") return null;
        if (filterMode === "weak" && room.status !== "weak") return null;
        if (filterMode === "poor" && room.status !== "poor") return null;

        const isRoomSelected = selectedLocation?.id === room.id;
        const isCurrentFloor = room.fl === selectedFloor;

        // Color coding based on status
        let statusStroke = "var(--atlas-healthy)";
        let statusFill = "var(--atlas-healthy-subtle)";
        if (room.status === "weak") {
          statusStroke = "var(--atlas-weak)";
          statusFill = "var(--atlas-weak-subtle)";
        } else if (room.status === "poor") {
          statusStroke = "var(--atlas-poor)";
          statusFill = "var(--atlas-poor-subtle)";
        }

        return (
          <g
            key={room.id}
            onClick={(e) => {
              e.stopPropagation();
              onSelectLocation && onSelectLocation(room, id);
            }}
            className="cursor-pointer group"
          >
            {/* Room Boundary */}
            <rect
              x={room.x}
              y={room.y}
              width={room.w}
              height={room.h}
              rx="4"
              fill={isRoomSelected ? "var(--atlas-terracotta-subtle)" : statusFill}
              stroke={
                isRoomSelected
                  ? "var(--atlas-terracotta)"
                  : isCurrentFloor
                  ? statusStroke
                  : "var(--atlas-border)"
              }
              strokeWidth={isRoomSelected ? "2.5" : isCurrentFloor ? "1.5" : "1"}
              strokeDasharray={isCurrentFloor ? "none" : "3 3"}
              opacity={isCurrentFloor ? "1" : "0.4"}
              className="transition-all group-hover:stroke-[var(--atlas-terracotta)]"
            />

            {/* Room Label */}
            <text
              x={room.x + 6}
              y={room.y + 16}
              fontSize="9.5"
              fontWeight={isRoomSelected ? "700" : "600"}
              fill="var(--atlas-text-primary)"
              opacity={isCurrentFloor ? "1" : "0.5"}
            >
              {room.name.length > 15 ? room.name.substring(0, 14) + "…" : room.name}
            </text>

            {/* Floor Tag & Metric */}
            <text
              x={room.x + 6}
              y={room.y + 30}
              fontSize="8.5"
              fill="var(--atlas-text-secondary)"
              fontWeight="500"
              opacity={isCurrentFloor ? "1" : "0.5"}
            >
              Floor {room.fl === 0 ? "G" : room.fl} • {room.speed}
            </text>

            {/* Status Indicator Dot */}
            <circle
              cx={room.x + room.w - 10}
              cy={room.y + 12}
              r="4"
              fill={statusStroke}
            />

            {/* Active Terracotta Pin Highlight */}
            {isRoomSelected && (
              <circle
                cx={room.x + room.w - 10}
                cy={room.y + 12}
                r="7"
                fill="none"
                stroke="var(--atlas-terracotta)"
                strokeWidth="2"
                className="animate-ping"
              />
            )}
          </g>
        );
      })}
    </g>
  );
}
