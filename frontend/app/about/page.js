'use client';

import React from 'react';
import AppLayout from '../../components/layout/AppLayout';
import PageContainer from '../../components/layout/PageContainer';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import {
  Compass,
  Wifi,
  Radio,
  Server,
  Database,
  Layers,
  Activity,
  CheckCircle2,
  Clock,
  Download,
  Upload,
  ShieldAlert,
  Code,
  Users,
  Terminal,
  Cpu,
  Globe,
} from 'lucide-react';

/**
 * CampusSignal — About & Architecture Documentation Page
 * Owner: Santosh (USN: 4SF24IS100)
 *
 * Detailed documentation covering the project mission, problem statement,
 * technical architecture, network metrics theory, and Team SignalX credits.
 */
export default function AboutPage() {
  const techStack = [
    {
      category: 'Frontend Engineering',
      techs: ['Next.js App Router', 'React (JavaScript)', 'Tailwind CSS v4', 'Recharts', 'Lucide React'],
      icon: Globe,
    },
    {
      category: 'Backend & API Services',
      techs: ['Node.js', 'Express.js (ESM)', 'RESTful Endpoints', 'Centralized Error Handling'],
      icon: Server,
    },
    {
      category: 'Data Persistence',
      techs: ['PostgreSQL', 'Connection Pooling (pg)', 'Parameterized SQL', 'Relational Migrations'],
      icon: Database,
    },
    {
      category: 'Observability & Architecture',
      techs: ['Signal Atlas GIS Design', 'End-to-End Latency RTT', 'Throughput Benchmarking'],
      icon: Activity,
    },
  ];

  const teamMembers = [
    {
      name: 'Santosh',
      usn: '4SF24IS100',
      role: 'Frontend & Backend Development',
      responsibilities: 'History Page, About Page, Error Middleware, Health Check API, Performance Charts & Location Comparison.',
      highlight: true,
    },
    {
      name: 'Abhinandana S',
      usn: 'Team Member',
      role: 'System Architecture & Dashboard GIS',
      responsibilities: 'Signal Atlas Map Engine, Dashboard Layout, and UI Design Tokens.',
      highlight: false,
    },
    {
      name: 'Yashwanth',
      usn: 'Team Member',
      role: 'Locations API & Navigation',
      responsibilities: 'Campus Locations Service, Locations Page, and Multi-floor Navigator.',
      highlight: false,
    },
    {
      name: 'Ankitha',
      usn: 'Team Member',
      role: 'Network Tests & Speedtest Logic',
      responsibilities: 'Network Test Service, Telemetry Submission, and Test Suite.',
      highlight: false,
    },
  ];

  return (
    <AppLayout
      title="About CampusSignal"
      subtitle="Observability platform for empirical campus Wi-Fi performance telemetry"
    >
      <PageContainer>
        {/* Hero Section */}
        <div className="mb-8 p-6 sm:p-8 rounded-xl bg-white dark:bg-[#171D27] border border-[#E4E8EC] dark:border-[#273140] shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-lg bg-[#B84C3A] text-white flex items-center justify-center shrink-0 shadow-sm shadow-[#B84C3A]/20">
              <Compass className="w-7 h-7 stroke-[2.2]" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FBF0EE] dark:bg-[rgba(184,76,58,0.2)] text-[#B84C3A] border border-[#E8A398]/50 text-[10px] font-semibold uppercase tracking-wider mb-1">
                <span>Signal Atlas Framework</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#242B38] dark:text-[#E8EDF3]">
                CampusSignal — Wi-Fi Dead-Zone Mapper
              </h1>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-[#697586] dark:text-[#8B98A9] leading-relaxed max-w-3xl">
            CampusSignal is an academic engineering and network telemetry platform designed to identify, map,
            and diagnose wireless dead zones across university campuses. By crowdsourcing client-side throughput
            and round-trip latency measurements, CampusSignal transforms scattered student connectivity reports
            into high-precision, cartographic geospatial telemetry.
          </p>
        </div>

        {/* Problem Statement & Objectives */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card title="The Problem Statement" subtitle="Wireless infrastructure bottlenecks in campus facilities">
            <div className="space-y-3 text-xs text-[#697586] dark:text-[#8B98A9] leading-relaxed">
              <p>
                In large collegiate environments, wireless local area networks (WLANs) face severe architectural
                challenges. Thick concrete walls, multi-floor concrete slabs, structural pillars, and dynamic RF
                attenuation create localized <strong className="text-[#B84C3A]">Wi-Fi dead zones</strong>.
              </p>
              <p>
                Traditional network monitoring systems only probe the health of access points (APs) from the NOC
                perspective, ignoring client-side degradations such as packet loss, bufferbloat, and signal shadows
                inside study labs, libraries, and lecture halls.
              </p>
            </div>
          </Card>

          <Card title="Project Objectives" subtitle="Empirical goals and outcomes delivered by SignalX">
            <ul className="space-y-2.5 text-xs text-[#697586] dark:text-[#8B98A9]">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#39836A] shrink-0 mt-0.5" />
                <span><strong>Empirical Telemetry:</strong> Log actual client download, upload, and latency measurements.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#39836A] shrink-0 mt-0.5" />
                <span><strong>Spatial Cartography:</strong> Map dead zones to physical buildings, floors, and specific lab zones.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#39836A] shrink-0 mt-0.5" />
                <span><strong>Predictive Diagnostics:</strong> Categorize network quality into Healthy, Weak, and Dead-Zone states.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#39836A] shrink-0 mt-0.5" />
                <span><strong>Infrastructure Optimization:</strong> Equip IT administrators with actionable data to reposition APs.</span>
              </li>
            </ul>
          </Card>
        </div>

        {/* How The System Works & Metrics Primer */}
        <Card title="Network Telemetry Fundamentals" subtitle="Understanding key performance metrics measured by CampusSignal" className="mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            <div className="p-4 rounded-lg bg-[#F3F6F8] dark:bg-[#11151D] border border-[#E4E8EC] dark:border-[#273140]">
              <div className="w-8 h-8 rounded-md bg-[#EDF7F3] dark:bg-[rgba(57,131,106,0.18)] text-[#39836A] flex items-center justify-center mb-3">
                <Clock className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-[#242B38] dark:text-[#E8EDF3] mb-1">
                RTT / Latency (ms)
              </h4>
              <p className="text-[11px] text-[#697586] dark:text-[#8B98A9] leading-relaxed">
                Round-Trip Time measures the milliseconds required for a network packet to travel from the client
                device to the server and back. Low latency (&lt; 50 ms) ensures responsive interactive sessions.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-[#F3F6F8] dark:bg-[#11151D] border border-[#E4E8EC] dark:border-[#273140]">
              <div className="w-8 h-8 rounded-md bg-[#FBF0EE] dark:bg-[rgba(184,76,58,0.18)] text-[#B84C3A] flex items-center justify-center mb-3">
                <Download className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-[#242B38] dark:text-[#E8EDF3] mb-1">
                Download Throughput (Mbps)
              </h4>
              <p className="text-[11px] text-[#697586] dark:text-[#8B98A9] leading-relaxed">
                Megabits transferred per second during bulk data reception. Campus locations maintaining &ge; 25 Mbps
                are marked as Healthy Coverage; areas below 5 Mbps are flagged as Critical Dead Zones.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-[#F3F6F8] dark:bg-[#11151D] border border-[#E4E8EC] dark:border-[#273140]">
              <div className="w-8 h-8 rounded-md bg-[#FEF8EC] dark:bg-[rgba(213,163,66,0.18)] text-[#D5A342] flex items-center justify-center mb-3">
                <Upload className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-[#242B38] dark:text-[#E8EDF3] mb-1">
                Upload Throughput (Mbps)
              </h4>
              <p className="text-[11px] text-[#697586] dark:text-[#8B98A9] leading-relaxed">
                Upstream transfer capacity critical for code deployment, video conferencing, and lab submissions.
                Balanced symmetric throughput indicates proper RF channel bandwidth allocation.
              </p>
            </div>
          </div>
        </Card>

        {/* Technology Stack */}
        <div className="mb-8">
          <h2 className="text-sm font-bold text-[#242B38] dark:text-[#E8EDF3] tracking-tight uppercase tracking-wider mb-4">
            Full-Stack Technology Architecture
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {techStack.map((stack) => {
              const Icon = stack.icon;
              return (
                <div
                  key={stack.category}
                  className="p-4 rounded-lg bg-white dark:bg-[#171D27] border border-[#E4E8EC] dark:border-[#273140] shadow-2xs"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Icon className="w-4 h-4 text-[#B84C3A]" />
                    <h3 className="text-xs font-semibold text-[#242B38] dark:text-[#E8EDF3]">
                      {stack.category}
                    </h3>
                  </div>
                  <ul className="space-y-1.5">
                    {stack.techs.map((tech) => (
                      <li
                        key={tech}
                        className="text-[11px] text-[#697586] dark:text-[#8B98A9] flex items-center gap-1.5"
                      >
                        <span className="w-1 h-1 rounded-full bg-[#B84C3A]" />
                        <span>{tech}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* Team SignalX Roster */}
        <Card title="Team SignalX — Project Contributors" subtitle="Engineering division and assignment ownership">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            {teamMembers.map((member) => (
              <div
                key={member.name}
                className={`p-4 rounded-lg border transition-all ${
                  member.highlight
                    ? 'border-[#B84C3A] bg-[#FBF0EE]/30 dark:bg-[rgba(184,76,58,0.08)]'
                    : 'border-[#E4E8EC] dark:border-[#273140] bg-white dark:bg-[#171D27]'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#B84C3A] text-white flex items-center justify-center font-bold text-xs">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#242B38] dark:text-[#E8EDF3]">
                        {member.name}
                      </h4>
                      <span className="text-[10px] font-mono text-[#697586] dark:text-[#8B98A9]">
                        USN: {member.usn}
                      </span>
                    </div>
                  </div>
                  {member.highlight && (
                    <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-[#B84C3A] text-white">
                      Author
                    </span>
                  )}
                </div>
                <div className="mt-2 text-[11px] font-medium text-[#B84C3A] dark:text-[#E27663]">
                  {member.role}
                </div>
                <p className="mt-1 text-[11px] text-[#697586] dark:text-[#8B98A9] leading-relaxed">
                  {member.responsibilities}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </PageContainer>
    </AppLayout>
  );
}
