import React from 'react';

/**
 * CampusSignal — Page Container
 * Owners: Abhinandana S + Yashwanth
 * Controls viewport width, padding, and responsive constraints
 */
export default function PageContainer({ children, className = '', fullWidth = false }) {
  return (
    <div
      className={`w-full mx-auto p-4 sm:p-6 lg:p-8 ${
        fullWidth ? '' : 'max-w-7xl'
      } ${className}`}
    >
      {children}
    </div>
  );
}
