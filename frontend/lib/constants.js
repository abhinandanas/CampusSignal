/**
 * CampusSignal — Signal Atlas Design Tokens & Application Constants
 * Owner: Abhinandana S
 *
 * Theme: Signal Atlas (GIS, Cartographic & Network Observability identity)
 */

export const THEME_COLORS = {
  // Light Mode Colors
  mainBg: '#FFFFFF',
  cardBg: '#FFFFFF',
  mapBg: '#F3F6F8',
  textPrimary: '#242B38',
  textSecondary: '#697586',
  border: '#E4E8EC',
  terracotta: '#B84C3A',
  terracottaHover: '#A03D2D',
  terracottaLight: '#FBF0EE',
  healthy: '#39836A',
  healthyLight: '#EDF7F3',
  weak: '#D5A342',
  weakLight: '#FEF8EC',

  // Dark Mode Counterparts
  dark: {
    mainBg: '#11151D',
    cardBg: '#171D27',
    mapBg: '#1B222E',
    textPrimary: '#E8EDF3',
    textSecondary: '#8B98A9',
    border: '#273140',
    terracotta: '#B84C3A',
    terracottaLight: 'rgba(184, 76, 58, 0.15)',
    healthy: '#4DA284',
    healthyLight: 'rgba(57, 131, 106, 0.15)',
    weak: '#E0B253',
    weakLight: 'rgba(213, 163, 66, 0.15)',
  },
};

export const PERFORMANCE_THRESHOLDS = {
  DOWNLOAD: {
    HEALTHY: 15.0, // >= 15 Mbps
    WEAK: 5.0,     // 5.0 - 14.9 Mbps
    POOR: 0.0,     // < 5.0 Mbps
  },
  LATENCY: {
    HEALTHY: 50.0, // < 50 ms
    WEAK: 150.0,   // 50 - 150 ms
    POOR: 9999.0,  // > 150 ms
  },
};

export const NAVIGATION_LINKS = [
  { name: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
  { name: 'Run Wi-Fi Test', href: '/network-test', icon: 'Wifi' },
  { name: 'Campus Locations', href: '/locations', icon: 'MapPin' },
  { name: 'Test History', href: '/history', icon: 'History' },
  { name: 'About SignalX', href: '/about', icon: 'Info' },
];

/**
 * Standard schematic campus building hierarchy for multi-floor GIS visualization.
 * Scalable: Campus -> Building -> Floor -> Test Zone
 */
export const CAMPUS_BUILDINGS = [
  {
    id: 'bldg_eng',
    name: 'Engineering Block',
    code: 'ENG',
    floors: [0, 1, 2, 3, 4, 5],
    center: { x: 260, y: 190 },
    width: 170,
    height: 120,
    zones: [
      { id: 'zone_eng_01', name: 'ISE Computer Lab 3', floor: 2, x: 280, y: 180, quality: 'healthy' },
      { id: 'zone_eng_02', name: 'ECE Embedded Systems Lab', floor: 3, x: 340, y: 160, quality: 'weak' },
      { id: 'zone_eng_03', name: 'Ground Seminar Hall', floor: 0, x: 290, y: 240, quality: 'poor' },
      { id: 'zone_eng_04', name: '5th Floor Server Room', floor: 5, x: 370, y: 220, quality: 'healthy' },
    ],
  },
  {
    id: 'bldg_acad',
    name: 'Academic Block A',
    code: 'ACA',
    floors: [0, 1, 2, 3, 4],
    center: { x: 500, y: 160 },
    width: 180,
    height: 110,
    zones: [
      { id: 'zone_acad_01', name: 'Lecture Hall 101', floor: 1, x: 520, y: 140, quality: 'healthy' },
      { id: 'zone_acad_02', name: 'Faculty Chambers', floor: 2, x: 600, y: 160, quality: 'healthy' },
      { id: 'zone_acad_03', name: 'Auditorium Quad', floor: 0, x: 540, y: 210, quality: 'weak' },
    ],
  },
  {
    id: 'bldg_lib',
    name: 'Central Library',
    code: 'LIB',
    floors: [0, 1, 2, 3],
    center: { x: 300, y: 370 },
    width: 150,
    height: 130,
    zones: [
      { id: 'zone_lib_01', name: 'Digital Library Section', floor: 1, x: 320, y: 360, quality: 'healthy' },
      { id: 'zone_lib_02', name: 'Quiet Study Hall', floor: 2, x: 380, y: 390, quality: 'weak' },
      { id: 'zone_lib_03', name: 'Ground Stacks', floor: 0, x: 340, y: 440, quality: 'poor' },
    ],
  },
  {
    id: 'bldg_sci',
    name: 'Science & Research Centre',
    code: 'SRC',
    floors: [0, 1, 2, 3, 4],
    center: { x: 540, y: 350 },
    width: 160,
    height: 120,
    zones: [
      { id: 'zone_sci_01', name: 'IoT Research Lab', floor: 3, x: 560, y: 340, quality: 'healthy' },
      { id: 'zone_sci_02', name: 'Robotics Workshop', floor: 1, x: 620, y: 380, quality: 'weak' },
    ],
  },
  {
    id: 'bldg_admin',
    name: 'Administrative Complex',
    code: 'ADM',
    floors: [0, 1, 2],
    center: { x: 120, y: 260 },
    width: 110,
    height: 150,
    zones: [
      { id: 'zone_adm_01', name: 'Admissions Office', floor: 0, x: 140, y: 270, quality: 'healthy' },
      { id: 'zone_adm_02', name: 'Boardroom', floor: 2, x: 150, y: 350, quality: 'healthy' },
    ],
  },
];
