'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

/**
 * CampusSignal — Signal Atlas Modal Dialog
 * Owner: Abhinandana S
 * Solid crisp container, no glassmorphism or blur.
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-lg',
}) {
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen) onClose();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Solid high-contrast backdrop */}
      <div
        className="fixed inset-0 bg-[#242B38]/60 transition-opacity"
        onClick={onClose}
      />

      <div
        className={`relative w-full ${maxWidth} bg-white dark:bg-[#171D27] border border-[#E4E8EC] dark:border-[#273140] rounded-lg shadow-lg z-10 overflow-hidden`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E4E8EC] dark:border-[#273140]">
          <div>
            {title && (
              <h3 className="text-base font-semibold text-[#242B38] dark:text-[#E8EDF3]">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-[#697586] dark:text-[#8B98A9] mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-[#697586] hover:text-[#242B38] dark:hover:text-[#E8EDF3] p-1 rounded-md transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
