'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Header from './Header';
import MobileNavigation from './MobileNavigation';
import { NAVIGATION_LINKS } from '../../lib/constants';
import {
  LayoutDashboard,
  Wifi,
  MapPin,
  History,
  Info,
} from 'lucide-react';

const iconMap = {
  LayoutDashboard,
  Wifi,
  MapPin,
  History,
  Info,
};

/**
 * CampusSignal — Signal Atlas App Layout Shell
 * Owners: Abhinandana S + Yashwanth
 */
export default function AppLayout({ children, title, subtitle }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#11151D] text-[#242B38] dark:text-[#E8EDF3] transition-colors">
      <Header
        title={title}
        subtitle={subtitle}
        onToggleMobileMenu={() => setMobileMenuOpen((open) => !open)}
      />

      {/* Navigation Sub-bar */}
      <nav className="bg-white dark:bg-[#171D27] border-b border-[#E4E8EC] dark:border-[#273140] overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 py-1.5">
          {NAVIGATION_LINKS.map((item) => {
            const Icon = iconMap[item.icon] || LayoutDashboard;
            const isActive = pathname === item.href || (item.href === '/dashboard' && pathname === '/');

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors shrink-0 ${
                  isActive
                    ? 'bg-[#FBF0EE] dark:bg-[rgba(184,76,58,0.18)] text-[#B84C3A] border border-[#E8A398]/50'
                    : 'text-[#697586] dark:text-[#8B98A9] hover:text-[#242B38] dark:hover:text-[#E8EDF3] hover:bg-[#F3F6F8] dark:hover:bg-[#1F2734]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#B84C3A]' : ''}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col pb-14 md:pb-0">{children}</main>

      {/* Mobile Navigation Drawer & Fixed Bottom Bar */}
      <MobileNavigation
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-[#E4E8EC] dark:border-[#273140] bg-white dark:bg-[#171D27] py-4 text-center text-xs text-[#697586] dark:text-[#8B98A9]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>CampusSignal • 3rd Year ISE DCN Mini-Project</span>
          <span>Team SignalX: Abhinandana S, Ankitha GR, Yashwanth, Santosh</span>
        </div>
      </footer>
    </div>
  );
}
