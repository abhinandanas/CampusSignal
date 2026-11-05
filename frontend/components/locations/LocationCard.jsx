'use client';

import React from 'react';
import Link from 'next/link';
import {
  MapPin,
  Building2,
  Layers,
  Wifi,
  Download,
  Clock,
  ArrowRight,
  Check,
  Radio,
} from 'lucide-react';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { formatSpeed, formatLatency } from '../../lib/formatters';

/**
 * CampusSignal — Signal Atlas Location Card
 * Owner: Yashwanth
 *
 * Displays a single campus test location with building, floor, description,
 * empirical Wi-Fi performance status (when backed by real data), and selection controls.
 *
 * @param {Object} props
 * @param {Object} props.location - Location data object
 * @param {boolean} [props.isSelected=false] - Whether this location is currently selected
 * @param {Function} [props.onSelect] - Callback triggered when location is chosen
 * @param {string} [props.className='']
 */
export default function LocationCard({
  location,
  isSelected = false,
  onSelect,
  className = '',
}) {
  if (!location) return null;

  const {
    id,
    buildingName = 'Campus Building',
    floor,
    zoneName = 'Monitored Zone',
    description,
    status,
    qualityCategory,
    downloadSpeedMbps,
    latencyMs,
  } = location;

  const floorLabel =
    floor === 0
      ? 'Ground Floor'
      : floor != null
      ? `Floor ${floor}`
      : 'Unspecified Floor';

  const hasTelemetry = Boolean(status || qualityCategory);
  const normalizedStatus = (status || qualityCategory || 'neutral').toLowerCase();

  return (
    <div
      onClick={() => onSelect && onSelect(location)}
      className={`group relative flex flex-col justify-between bg-white dark:bg-[#171D27] rounded-lg border transition-all duration-200 cursor-pointer overflow-hidden ${
        isSelected
          ? 'border-[#B84C3A] ring-2 ring-[#B84C3A]/25 shadow-sm'
          : 'border-[#E4E8EC] dark:border-[#273140] hover:border-[#B84C3A]/50 hover:shadow-2xs'
      } ${className}`}
    >
      {/* Top terracotta accent ribbon when selected */}
      {isSelected && (
        <div className="h-1 w-full bg-[#B84C3A] transition-all" />
      )}

      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        {/* Header: Zone Name & Status Badge */}
        <div>
          <div className="flex items-start justify-between gap-2.5 mb-2.5">
            <div className="flex items-center gap-2">
              <span
                className={`p-1.5 rounded-md ${
                  isSelected
                    ? 'bg-[#B84C3A] text-white'
                    : 'bg-[#F3F6F8] dark:bg-[#1A222F] text-[#B84C3A] group-hover:bg-[#FBF0EE] dark:group-hover:bg-[rgba(184,76,58,0.2)]'
                } transition-colors`}
              >
                <MapPin className="w-4 h-4" />
              </span>
              <h3 className="text-sm sm:text-base font-semibold text-[#242B38] dark:text-[#E8EDF3] tracking-tight leading-snug">
                {zoneName}
              </h3>
            </div>

            {hasTelemetry ? (
              <Badge status={normalizedStatus} size="sm" />
            ) : (
              <Badge status="neutral" label="Unmeasured" size="sm" showIcon={false} />
            )}
          </div>

          {/* Building & Floor Hierarchy Information */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-[#697586] dark:text-[#8B98A9] mb-3">
            <span className="inline-flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-[#697586] dark:text-[#8B98A9]" />
              <span className="font-medium text-[#242B38] dark:text-[#E8EDF3]">
                {buildingName}
              </span>
            </span>

            <span className="inline-flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#697586] dark:text-[#8B98A9]" />
              <span>{floorLabel}</span>
            </span>
          </div>

          {/* Description (if available) */}
          {description ? (
            <p className="text-xs text-[#697586] dark:text-[#8B98A9] line-clamp-2 leading-relaxed mb-3">
              {description}
            </p>
          ) : (
            <p className="text-xs italic text-[#8B98A9] dark:text-[#697586] mb-3">
              No additional notes provided for this zone.
            </p>
          )}
        </div>

        {/* Real Empirical Telemetry Row (Shown ONLY when backed by actual recorded tests) */}
        {hasTelemetry && (downloadSpeedMbps != null || latencyMs != null) ? (
          <div className="mt-2 pt-3 border-t border-[#E4E8EC] dark:border-[#273140] grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1.5 text-[#242B38] dark:text-[#E8EDF3]">
              <Download className="w-3.5 h-3.5 text-[#39836A]" />
              <span className="font-semibold">{formatSpeed(downloadSpeedMbps)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#242B38] dark:text-[#E8EDF3]">
              <Clock className="w-3.5 h-3.5 text-[#697586]" />
              <span className="font-semibold">{formatLatency(latencyMs)}</span>
            </div>
          </div>
        ) : (
          <div className="mt-2 pt-2.5 border-t border-[#E4E8EC] dark:border-[#273140] flex items-center gap-1.5 text-[11px] text-[#8B98A9] dark:text-[#697586]">
            <Radio className="w-3 h-3 text-[#B84C3A]" />
            <span>Ready for Wi-Fi benchmarking</span>
          </div>
        )}
      </div>

      {/* Card Footer Actions */}
      <div className="px-4 py-2.5 sm:px-5 sm:py-3 bg-[#F3F6F8] dark:bg-[#1A222F] border-t border-[#E4E8EC] dark:border-[#273140] flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelect && onSelect(location);
          }}
          className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded transition-colors cursor-pointer ${
            isSelected
              ? 'bg-[#B84C3A] text-white'
              : 'text-[#B84C3A] hover:bg-[#FBF0EE] dark:hover:bg-[rgba(184,76,58,0.2)]'
          }`}
        >
          {isSelected ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Selected</span>
            </>
          ) : (
            <span>Select Zone</span>
          )}
        </button>

        <Link
          href={`/network-test?locationId=${id}`}
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1 text-xs font-medium text-[#697586] dark:text-[#8B98A9] hover:text-[#B84C3A] dark:hover:text-[#B84C3A] transition-colors"
        >
          <Wifi className="w-3.5 h-3.5" />
          <span>Test Wi-Fi</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
