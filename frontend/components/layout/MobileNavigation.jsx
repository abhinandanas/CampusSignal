'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Compass,
  LayoutDashboard,
  Wifi,
  MapPin,
  History,
  Info,
  X,
  Radio,
} from 'lucide-react';
import { NAVIGATION_LINKS } from '../../lib/constants';

const ICON_MAP = {
  LayoutDashboard,
  Wifi,
  MapPin,
  History,
  Info,
};

/**
 * CampusSignal — Signal Atlas Mobile Navigation
 * Owner: Yashwanth
 *
 * Implements mobile-first navigation controls:
 * 1. Fixed bottom navigation bar for immediate one-thumb routing
 * 2. Accessible slide-out navigation drawer with esc-key support
 * 3. Automatic route-selection dismissal
 * 4. Zero horizontal overflow
 */
export default function MobileNavigation({
  isOpen = false,
  onClose,
  showBottomBar = true,
}) {
  const pathname = usePathname();

  // Close drawer on ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && onClose) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock background scrolling when slide-out drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      {/* ──────────────────────────────────────────────────────────────────────── */}
      {/* 1. Accessible Slide-Out Mobile Drawer (when isOpen is true)             */}
      {/* ──────────────────────────────────────────────────────────────────────── */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 md:hidden flex justify-start"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation menu"
        >
          {/* Semi-transparent Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer Surface */}
          <div className="relative w-4/5 max-w-xs h-full bg-white dark:bg-[#171D27] text-[#242B38] dark:text-[#E8EDF3] shadow-xl flex flex-col justify-between z-10 overflow-y-auto">
            {/* Header */}
            <div>
              <div className="h-16 px-4 border-b border-[#E4E8EC] dark:border-[#273140] flex items-center justify-between">
                <Link
                  href="/dashboard"
                  onClick={onClose}
                  className="flex items-center gap-2 group"
                >
                  <div className="w-8 h-8 rounded-md bg-[#B84C3A] text-white flex items-center justify-center font-bold">
                    <Compass className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <div>
                    <span className="font-bold text-sm tracking-tight text-[#242B38] dark:text-[#E8EDF3]">
                      CampusSignal
                    </span>
                    <span className="ml-1 text-[10px] font-semibold uppercase px-1 py-0.5 rounded bg-[#FBF0EE] dark:bg-[rgba(184,76,58,0.2)] text-[#B84C3A]">
                      Atlas
                    </span>
                  </div>
                </Link>

                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 rounded-md text-[#697586] hover:text-[#242B38] dark:hover:text-[#E8EDF3] hover:bg-[#F3F6F8] dark:hover:bg-[#1F2734] cursor-pointer"
                  aria-label="Close navigation menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Items */}
              <nav className="p-3 space-y-1" aria-label="Mobile menu links">
                {NAVIGATION_LINKS.map((item) => {
                  const Icon = ICON_MAP[item.icon] || LayoutDashboard;
                  const isActive =
                    pathname === item.href ||
                    (item.href === '/dashboard' && pathname === '/');

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      aria-current={isActive ? 'page' : undefined}
                      className={`flex items-center gap-3 px-3.5 py-3 rounded-md text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-[#FBF0EE] dark:bg-[rgba(184,76,58,0.18)] text-[#B84C3A] font-semibold border-l-4 border-[#B84C3A]'
                          : 'text-[#697586] dark:text-[#8B98A9] hover:bg-[#F3F6F8] dark:hover:bg-[#1A222F] hover:text-[#242B38] dark:hover:text-[#E8EDF3]'
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 shrink-0 ${
                          isActive ? 'text-[#B84C3A]' : ''
                        }`}
                      />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Bottom Status & Info */}
            <div className="p-4 border-t border-[#E4E8EC] dark:border-[#273140] space-y-2 bg-[#F3F6F8] dark:bg-[#1A222F]">
              <div className="flex items-center gap-2 text-xs font-medium text-[#242B38] dark:text-[#E8EDF3]">
                <span className="w-2 h-2 rounded-full bg-[#39836A] animate-pulse" />
                <Radio className="w-3.5 h-3.5 text-[#39836A]" />
                <span>Wi-Fi Telemetry Active</span>
              </div>
              <p className="text-[11px] text-[#697586] dark:text-[#8B98A9]">
                Team SignalX • Yashwanth
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────────── */}
      {/* 2. Fixed Mobile Bottom Bar (Thumb-Accessible, md:hidden)               */}
      {/* ──────────────────────────────────────────────────────────────────────── */}
      {showBottomBar && (
        <nav
          className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 dark:bg-[#171D27]/95 border-t border-[#E4E8EC] dark:border-[#273140] backdrop-blur-xs overflow-x-hidden safe-area-pb"
          aria-label="Mobile quick navigation"
        >
          <div className="grid grid-cols-5 h-14 max-w-lg mx-auto px-1">
            {NAVIGATION_LINKS.map((item) => {
              const Icon = ICON_MAP[item.icon] || LayoutDashboard;
              const isActive =
                pathname === item.href ||
                (item.href === '/dashboard' && pathname === '/');

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors ${
                    isActive
                      ? 'text-[#B84C3A] font-semibold'
                      : 'text-[#697586] dark:text-[#8B98A9] hover:text-[#242B38] dark:hover:text-[#E8EDF3]'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 transition-transform ${
                      isActive ? 'scale-110 text-[#B84C3A]' : ''
                    }`}
                  />
                  <span className="truncate max-w-[56px] text-center">{item.name.replace('Campus ', '')}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </>
  );
}
