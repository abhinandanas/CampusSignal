import { createDashboardService } from '../services/dashboard.service.js';

export function createDashboardController(service = createDashboardService()) {
  return { summary: async (_req, res) => {
    const summary = await service.summary();
    res.json({ status: 'success', data: {
      kpi: {
        totalTestsRecorded: summary.total_tests,
        avgDownloadSpeedMbps: Number(summary.average_download_mbps) || 0,
        avgUploadSpeedMbps: Number(summary.average_upload_mbps) || 0,
        avgLatencyMs: Number(summary.average_latency_ms) || 0,
        identifiedDeadZones: summary.weak_count,
        totalLocations: summary.total_locations,
      },
      qualityDistribution: {
        goodCount: summary.good_count,
        moderateCount: summary.fair_count,
        poorCount: summary.weak_count,
        goodPercent: summary.total_tests ? Number((summary.good_count * 100 / summary.total_tests).toFixed(1)) : 0,
        moderatePercent: summary.total_tests ? Number((summary.fair_count * 100 / summary.total_tests).toFixed(1)) : 0,
        poorPercent: summary.total_tests ? Number((summary.weak_count * 100 / summary.total_tests).toFixed(1)) : 0,
      },
      criticalDeadZones: [],
      recentTests: [],
      hasData: summary.total_tests > 0,
      timestamp: new Date().toISOString(),
      totalTests: summary.total_tests,
      totalLocations: summary.total_locations,
      goodCount: summary.good_count,
      fairCount: summary.fair_count,
      weakCount: summary.weak_count,
      averageDownloadMbps: Number(summary.average_download_mbps) || 0,
    } });
  } };
}
