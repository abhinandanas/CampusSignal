import React from 'react';
import Card from '../common/Card';

/**
 * CampusSignal — Metric Card
 * Owner: Abhinandana S
 */
export default function MetricCard({
  title,
  value,
  unit,
  subtitle,
  icon: Icon,
  badgeText,
  badgeType = 'neutral',
  accentColor = '#B84C3A',
}) {
  const badgeClasses = {
    healthy: 'bg-[#EDF7F3] dark:bg-[rgba(57,131,106,0.18)] text-[#1B5441] dark:text-[#4DA284] border-[#93CBB8] dark:border-[#2B5446]',
    weak: 'bg-[#FEF8EC] dark:bg-[rgba(213,163,66,0.18)] text-[#8A6417] dark:text-[#E0B253] border-[#F2D390] dark:border-[#59461F]',
    poor: 'bg-[#FBF0EE] dark:bg-[rgba(184,76,58,0.18)] text-[#7C2B1D] dark:text-[#E27663] border-[#E8A398] dark:border-[#57271F]',
    neutral: 'bg-[#F3F6F8] dark:bg-[#1F2734] text-[#394353] dark:text-[#8B98A9] border-[#D0D7DE] dark:border-[#2E3B4D]',
  };

  return (
    <Card className="hover:border-[#B84C3A]/40 transition-colors" noPadding>
      <div className="p-4">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs font-semibold text-[#697586] dark:text-[#8B98A9] uppercase tracking-wider">
            {title}
          </span>
          {Icon && (
            <div
              className="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
              style={{
                backgroundColor: `${accentColor}18`,
                color: accentColor,
              }}
            >
              <Icon className="w-3.5 h-3.5" />
            </div>
          )}
        </div>

        <div className="flex items-baseline gap-1.5 my-1">
          <span className="text-2xl font-bold tracking-tight text-[#242B38] dark:text-[#E8EDF3]">
            {value !== undefined && value !== null ? value : '--'}
          </span>
          {unit && (
            <span className="text-xs font-medium text-[#697586] dark:text-[#8B98A9]">
              {unit}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-[#E4E8EC] dark:border-[#273140]">
          <span className="text-[11px] text-[#697586] dark:text-[#8B98A9] truncate">
            {subtitle || 'Campus Telemetry'}
          </span>
          {badgeText && (
            <span
              className={`text-[10px] font-medium px-2 py-0.5 rounded-full border shrink-0 ${
                badgeClasses[badgeType] || badgeClasses.neutral
              }`}
            >
              {badgeText}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}
