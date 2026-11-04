'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Compass, Wifi, ArrowRight, Activity, MapPin } from 'lucide-react';
import Button from '../components/common/Button';

/**
 * CampusSignal — Home Landing Page
 * Owner: Abhinandana S
 * Directs incoming students to the Signal Atlas Dashboard
 */
export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Automatically transition to the dashboard
    const timer = setTimeout(() => {
      router.push('/dashboard');
    }, 1500);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-white dark:bg-[#11151D] text-[#242B38] dark:text-[#E8EDF3] flex flex-col items-center justify-center p-6 text-center select-none">
      <div className="w-16 h-16 rounded-xl bg-[#B84C3A] text-white flex items-center justify-center mb-6 shadow-md shadow-[#B84C3A]/20">
        <Compass className="w-9 h-9 stroke-[2.2] animate-pulse" />
      </div>

      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FBF0EE] dark:bg-[rgba(184,76,58,0.2)] text-[#B84C3A] border border-[#E8A398]/50 text-xs font-semibold uppercase tracking-wider mb-3">
        <span>Signal Atlas Theme</span>
      </div>

      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#242B38] dark:text-[#E8EDF3] max-w-lg">
        CampusSignal
      </h1>
      <p className="text-sm sm:text-base text-[#697586] dark:text-[#8B98A9] max-w-md mt-2 mb-8 leading-relaxed">
        Empirical Wi-Fi performance telemetry and dead-zone mapping for college campuses.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Link href="/dashboard">
          <Button variant="primary" size="lg" icon={ArrowRight} iconPosition="right">
            Open Signal Atlas Dashboard
          </Button>
        </Link>
        <Link href="/network-test">
          <Button variant="secondary" size="lg" icon={Wifi}>
            Run Speed Test
          </Button>
        </Link>
      </div>

      <p className="text-xs text-[#697586] dark:text-[#8B98A9] mt-8">
        Redirecting to dashboard...
      </p>
    </div>
  );
}
