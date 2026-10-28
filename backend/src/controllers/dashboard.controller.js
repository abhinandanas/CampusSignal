import { createDashboardService } from '../services/dashboard.service.js';

export function createDashboardController(service = createDashboardService()) {
  return { summary: async (_req, res) => {
    const summary = await service.summary();
    res.json({ status: 'success', data: {
      totalTests: summary.total_tests,
      totalLocations: summary.total_locations,
      goodCount: summary.good_count,
      fairCount: summary.fair_count,
      weakCount: summary.weak_count,
      averageDownloadMbps: Number(summary.average_download_mbps) || 0,
    } });
  } };
}
