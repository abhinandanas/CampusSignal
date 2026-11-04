'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Wifi, Sun, Moon, Radio, Compass } from 'lucide-react';
import Button from '../common/Button';

/**
 * CampusSignal — Signal Atlas Header
 * Owners: Abhinandana S + Yashwanth
 */
export default function Header({ title = 'Signal Atlas', subtitle }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark' ||
      (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-[#171D27] border-b border-[#E4E8EC] dark:border-[#273140] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand & Page Context */}
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-md bg-[#B84C3A] text-white flex items-center justify-center font-bold shadow-xs">
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

          {title && (
            <div className="hidden sm:flex items-center gap-2 pl-4 border-l border-[#E4E8EC] dark:border-[#273140] ml-3">
              <h1 className="text-sm font-semibold text-[#242B38] dark:text-[#E8EDF3]">
                {title}
              </h1>
              {subtitle && (
                <span className="text-xs text-[#697586] dark:text-[#8B98A9]">
                  • {subtitle}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Center/Right Actions: Network Badge, Dark Mode, Quick CTA */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#F3F6F8] dark:bg-[#1A222F] border border-[#E4E8EC] dark:border-[#273140] text-xs font-medium text-[#242B38] dark:text-[#E8EDF3]">
            <span className="w-2 h-2 rounded-full bg-[#39836A] animate-pulse" />
            <Radio className="w-3.5 h-3.5 text-[#39836A]" />
            <span>Campus Wi-Fi Active</span>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md border border-[#E4E8EC] dark:border-[#273140] text-[#697586] dark:text-[#8B98A9] hover:text-[#242B38] dark:hover:text-[#E8EDF3] hover:bg-[#F3F6F8] dark:hover:bg-[#1A222F] transition-colors cursor-pointer"
            aria-label="Toggle visual theme"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? <Sun className="w-4 h-4 text-[#D5A342]" /> : <Moon className="w-4 h-4" />}
          </button>

          <Link href="/network-test">
            <Button variant="primary" size="sm" icon={Wifi}>
              Run Test
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
