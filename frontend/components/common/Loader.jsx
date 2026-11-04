import React from 'react';

/**
 * CampusSignal — Signal Atlas Loader
 * Owner: Abhinandana S
 */
export default function Loader({ label = 'Querying telemetry...', size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3',
  };

  return (
    <div className={`flex flex-col items-center justify-center p-6 gap-2.5 ${className}`}>
      <div
        className={`${sizeClasses[size] || sizeClasses.md} border-[#B84C3A] border-t-transparent rounded-full animate-spin`}
      />
      {label && (
        <span className="text-xs font-medium text-[#697586] dark:text-[#8B98A9]">
          {label}
        </span>
      )}
    </div>
  );
}
