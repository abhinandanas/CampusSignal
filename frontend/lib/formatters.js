/**
 * CampusSignal — Metric & Timestamp Formatters
 * Owner: Abhinandana S
 */

import { PERFORMANCE_THRESHOLDS } from './constants';

export function formatSpeed(mbps) {
  if (mbps === undefined || mbps === null || isNaN(mbps)) return '-- Mbps';
  return `${Number(mbps).toFixed(1)} Mbps`;
}

export function formatLatency(ms) {
  if (ms === undefined || ms === null || isNaN(ms)) return '-- ms';
  return `${Math.round(ms)} ms`;
}

export function formatTimestamp(dateString) {
  if (!dateString) return 'No tests recorded';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid date';

    // Format like "28 Oct 2026, 10:45 AM"
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  } catch {
    return dateString;
  }
}

/**
 * Classifies telemetry into Signal Atlas performance categories:
 * - 'healthy': Good Wi-Fi speed & low latency
 * - 'weak': Moderate speed or latency degradation
 * - 'poor': Dead zone (speed < 5 Mbps or latency > 150 ms)
 */
export function classifyPerformance(downloadMbps, latencyMs) {
  if (downloadMbps === undefined || downloadMbps === null) return 'unknown';

  const dl = parseFloat(downloadMbps);
  const lat = parseFloat(latencyMs) || 0;

  if (dl >= PERFORMANCE_THRESHOLDS.DOWNLOAD.HEALTHY && lat < PERFORMANCE_THRESHOLDS.LATENCY.HEALTHY) {
    return 'healthy';
  }
  if (dl < PERFORMANCE_THRESHOLDS.DOWNLOAD.WEAK || lat > PERFORMANCE_THRESHOLDS.LATENCY.WEAK) {
    return 'poor';
  }
  return 'weak';
}

export function getQualityMetadata(quality) {
  switch ((quality || '').toLowerCase()) {
    case 'healthy':
    case 'good':
      return {
        label: 'Healthy Coverage',
        shortLabel: 'Healthy',
        color: '#39836A',
        bgLight: '#EDF7F3',
        textLight: '#1B5441',
        border: '#93CBB8',
        icon: 'CheckCircle2',
      };
    case 'weak':
    case 'moderate':
      return {
        label: 'Weak Signal',
        shortLabel: 'Weak',
        color: '#D5A342',
        bgLight: '#FEF8EC',
        textLight: '#8A6417',
        border: '#F2D390',
        icon: 'AlertTriangle',
      };
    case 'poor':
    case 'dead zone':
    case 'dead-zone':
      return {
        label: 'Dead Zone',
        shortLabel: 'Dead Zone',
        color: '#B84C3A',
        bgLight: '#FBF0EE',
        textLight: '#7C2B1D',
        border: '#E8A398',
        icon: 'XCircle',
      };
    default:
      return {
        label: 'Unmeasured',
        shortLabel: 'Unmeasured',
        color: '#697586',
        bgLight: '#F3F6F8',
        textLight: '#394353',
        border: '#D0D7DE',
        icon: 'HelpCircle',
      };
  }
}
