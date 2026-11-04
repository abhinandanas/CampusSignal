import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, HelpCircle } from 'lucide-react';

/**
 * CampusSignal — Signal Atlas Status Badge
 * Owner: Abhinandana S
 */
export default function Badge({
  status = 'neutral',
  label,
  showIcon = true,
  size = 'md',
  className = '',
}) {
  const normStatus = (status || '').toLowerCase();

  const configs = {
    healthy: {
      color: '#39836A',
      bgClass: 'bg-[#EDF7F3] dark:bg-[rgba(57,131,106,0.18)] text-[#1B5441] dark:text-[#4DA284] border-[#93CBB8] dark:border-[#2B5446]',
      dotClass: 'bg-[#39836A]',
      icon: CheckCircle2,
      defaultLabel: 'Healthy Coverage',
    },
    good: {
      color: '#39836A',
      bgClass: 'bg-[#EDF7F3] dark:bg-[rgba(57,131,106,0.18)] text-[#1B5441] dark:text-[#4DA284] border-[#93CBB8] dark:border-[#2B5446]',
      dotClass: 'bg-[#39836A]',
      icon: CheckCircle2,
      defaultLabel: 'Healthy',
    },
    weak: {
      color: '#D5A342',
      bgClass: 'bg-[#FEF8EC] dark:bg-[rgba(213,163,66,0.18)] text-[#8A6417] dark:text-[#E0B253] border-[#F2D390] dark:border-[#59461F]',
      dotClass: 'bg-[#D5A342]',
      icon: AlertTriangle,
      defaultLabel: 'Weak Performance',
    },
    moderate: {
      color: '#D5A342',
      bgClass: 'bg-[#FEF8EC] dark:bg-[rgba(213,163,66,0.18)] text-[#8A6417] dark:text-[#E0B253] border-[#F2D390] dark:border-[#59461F]',
      dotClass: 'bg-[#D5A342]',
      icon: AlertTriangle,
      defaultLabel: 'Moderate',
    },
    poor: {
      color: '#B84C3A',
      bgClass: 'bg-[#FBF0EE] dark:bg-[rgba(184,76,58,0.18)] text-[#7C2B1D] dark:text-[#E27663] border-[#E8A398] dark:border-[#57271F]',
      dotClass: 'bg-[#B84C3A]',
      icon: XCircle,
      defaultLabel: 'Dead Zone',
    },
    neutral: {
      color: '#697586',
      bgClass: 'bg-[#F3F6F8] dark:bg-[#1F2734] text-[#394353] dark:text-[#8B98A9] border-[#D0D7DE] dark:border-[#2E3B4D]',
      dotClass: 'bg-[#697586]',
      icon: HelpCircle,
      defaultLabel: 'Unmeasured',
    },
  };

  const config = configs[normStatus] || configs.neutral;
  const IconComponent = config.icon;
  const textLabel = label || config.defaultLabel;

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2',
  };

  return (
    <span
      className={`inline-flex items-center font-medium border rounded-full shrink-0 ${sizeClasses[size] || sizeClasses.md} ${config.bgClass} ${className}`}
    >
      {showIcon ? (
        <IconComponent className="w-3.5 h-3.5 shrink-0" />
      ) : (
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${config.dotClass}`} />
      )}
      <span className="tracking-tight">{textLabel}</span>
    </span>
  );
}
