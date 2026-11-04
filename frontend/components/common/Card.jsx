import React from 'react';

/**
 * CampusSignal — Signal Atlas Card
 * Owner: Abhinandana S
 * Solid white surface, crisp subtle border, no heavy shadow, GIS styling.
 */
export default function Card({
  children,
  className = '',
  title,
  subtitle,
  action,
  headerBorder = true,
  noPadding = false,
  ...props
}) {
  return (
    <div
      className={`bg-white dark:bg-[#171D27] border border-[#E4E8EC] dark:border-[#273140] rounded-lg shadow-2xs overflow-hidden transition-colors ${className}`}
      {...props}
    >
      {(title || subtitle || action) && (
        <div
          className={`flex items-center justify-between px-5 py-3.5 ${
            headerBorder ? 'border-b border-[#E4E8EC] dark:border-[#273140]' : ''
          }`}
        >
          <div>
            {title && (
              <h3 className="text-sm font-semibold text-[#242B38] dark:text-[#E8EDF3] tracking-tight">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-[#697586] dark:text-[#8B98A9] mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      <div className={noPadding ? '' : 'p-5'}>{children}</div>
    </div>
  );
}
