'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Compass,
  LayoutDashboard,
  Wifi,
  MapPin,
  History,
  Info,
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
 * CampusSignal — Signal Atlas Sidebar Navigation
 * Owner: Yashwanth
 *
 * Desktop navigation sidebar adhering to Signal Atlas design guidelines:
 * - Crisp white surface with subtle border (#E4E8EC / #273140)
 * - Terracotta brand accent (#B84C3A) for active state highlights
 * - Clear Lucide icons and campus identity branding
 */
export default function Sidebar({ className = '', onLinkClick }) {
  const pathname = usePathname();

  return (
    <aside
      className={`w-64 flex flex-col justify-between bg-white dark:bg-[#171D27] border-r border-[#E4E8EC] dark:border-[#273140] transition-colors select-none ${className}`}
      aria-label="Main application sidebar"
    >
      {/* Top Branding Section */}
      <div className="flex flex-col">
        <div className="h-16 px-5 border-b border-[#E4E8EC] dark:border-[#273140] flex items-center">
          <Link
            href="/dashboard"
            onClick={onLinkClick}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-9 h-9 rounded-md bg-[#B84C3A] text-white flex items-center justify-center font-bold shadow-xs transition-transform group-hover:scale-105">
              <Compass className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm tracking-tight text-[#242B38] dark:text-[#E8EDF3]">
                  CampusSignal
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#FBF0EE] dark:bg-[rgba(184,76,58,0.2)] text-[#B84C3A] border border-[#E8A398]/40">
                  Atlas
                </span>
              </div>
              <p className="text-[11px] text-[#697586] dark:text-[#8B98A9] font-medium leading-none mt-0.5">
                Wi-Fi Dead-Zone Mapper
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation Links List */}
        <nav className="p-3 space-y-1" aria-label="Sidebar navigation">
          {NAVIGATION_LINKS.map((item) => {
            const Icon = ICON_MAP[item.icon] || LayoutDashboard;
            const isActive =
              pathname === item.href ||
              (item.href === '/dashboard' && pathname === '/');

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onLinkClick}
                aria-current={isActive ? 'page' : undefined}
                className={`relative flex items-center gap-3 px-3.5 py-2.5 rounded-md text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-[#FBF0EE] dark:bg-[rgba(184,76,58,0.18)] text-[#B84C3A] font-semibold'
                    : 'text-[#697586] dark:text-[#8B98A9] hover:text-[#242B38] dark:hover:text-[#E8EDF3] hover:bg-[#F3F6F8] dark:hover:bg-[#1A222F]'
                }`}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <span
                    className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-sm bg-[#B84C3A]"
                    aria-hidden="true"
                  />
                )}
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-[#B84C3A]' : 'text-[#697586] dark:text-[#8B98A9]'
                  }`}
                />
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Observability Context & Academic Attribution */}
      <div className="p-4 border-t border-[#E4E8EC] dark:border-[#273140] space-y-3">
        {/* Campus Network Status Indicator */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-[#F3F6F8] dark:bg-[#1A222F] border border-[#E4E8EC] dark:border-[#273140] text-xs">
          <span className="w-2 h-2 rounded-full bg-[#39836A] animate-pulse shrink-0" />
          <Radio className="w-3.5 h-3.5 text-[#39836A] shrink-0" />
          <div className="flex flex-col min-w-0">
            <span className="text-[11px] font-semibold text-[#242B38] dark:text-[#E8EDF3] truncate">
              Campus Wi-Fi Active
            </span>
            <span className="text-[10px] text-[#697586] dark:text-[#8B98A9] truncate">
              Telemetry collector online
            </span>
          </div>
        </div>

        {/* Project & Team Tag */}
        <div className="px-1 text-[11px] text-[#697586] dark:text-[#8B98A9]">
          <p className="font-semibold text-[#242B38] dark:text-[#E8EDF3]">Team SignalX</p>
          <p className="text-[10px] text-[#8B98A9] dark:text-[#697586]">3rd Year ISE • DCN Project</p>
        </div>
      </div>
    </aside>
  );
}
