/**
 * CampusSignal — Dashboard Controller
 * Owner: Abhinandana S
 *
 * Responsibilities:
 * - Handle incoming HTTP requests for dashboard metrics and summaries
 * - Interface with dashboard.service.js to fetch data
 * - Return standardized JSON responses
 */

import * as dashboardService from '../services/dashboard.service.js';

/**
 * GET /api/dashboard/summary (or GET /api/dashboard)
 * Retrieves pre-aggregated KPI cards, quality distribution, dead zones, and recent tests.
 */
export async function getDashboardSummary(req, res, next) {
  try {
    const summary = await dashboardService.getDashboardSummary();
    return res.status(200).json({
      status: 'success',
      data: summary,
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * GET /api/dashboard/comparison
 * Retrieves performance comparison aggregated by campus building/zone.
 */
export async function getLocationComparison(req, res, next) {
  try {
    const comparison = await dashboardService.getLocationComparison();
    return res.status(200).json({
      status: 'success',
      count: comparison.length,
      data: comparison,
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * GET /api/dashboard/recent-tests
 * Retrieves recent network test submissions for the dashboard table.
 */
export async function getRecentTests(req, res, next) {
  try {
    const limit = req.query.limit || 10;
    const tests = await dashboardService.getRecentTests(limit);
    return res.status(200).json({
      status: 'success',
      count: tests.length,
      data: tests,
    });
  } catch (error) {
    return next(error);
  }
}

export default {
  getDashboardSummary,
  getLocationComparison,
  getRecentTests,
};
