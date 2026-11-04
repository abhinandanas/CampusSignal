import React from 'react';
import { Radio } from 'lucide-react';
import Button from './Button';

/**
 * CampusSignal — Signal Atlas Empty State
 * Owner: Abhinandana S
 */
export default function EmptyState({
  title = 'No Telemetry Recorded Yet',
  description = 'No network performance measurements exist for this campus selection. Run a network test to measure latency, download, and upload speeds.',
  icon: Icon = Radio,
  actionLabel,
  onAction,
  className = '',
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center bg-[#F3F6F8] dark:bg-[#1A222F] border border-dashed border-[#E4E8EC] dark:border-[#273140] rounded-lg ${className}`}
    >
      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white dark:bg-[#171D27] text-[#B84C3A] border border-[#E4E8EC] dark:border-[#273140] mb-3.5 shadow-2xs">
        <Icon className="w-6 h-6 stroke-[1.75]" />
      </div>
      <h4 className="text-sm font-semibold text-[#242B38] dark:text-[#E8EDF3]">
        {title}
      </h4>
      <p className="text-xs text-[#697586] dark:text-[#8B98A9] max-w-sm mt-1 mb-4 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
