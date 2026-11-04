/**
 * CampusSignal — Dashboard Service
 * Owner: Abhinandana S
 *
 * Responsibilities:
 * - Calculate aggregated network performance summaries from stored measurements
 * - Aggregate KPI metrics (average throughput, latency, test count, dead-zone count)
 * - Compute quality distribution and classify critical dead zones
 * - Provide time-series and comparative metrics for dashboard charts
 */

import { pool } from '../config/database.js';

/**
 * Returns default empty-state KPI and summary data.
 * Used when no measurements exist yet or during database initialization.
 */
function getEmptySummaryState() {
  return {
    kpi: {
      totalTestsRecorded: 0,
      avgDownloadSpeedMbps: 0,
      avgUploadSpeedMbps: 0,
      avgLatencyMs: 0,
      identifiedDeadZones: 0,
    },
    qualityDistribution: {
      goodCount: 0,
      moderateCount: 0,
      poorCount: 0,
      goodPercent: 0,
      moderatePercent: 0,
      poorPercent: 0,
    },
    criticalDeadZones: [],
    recentTests: [],
    hasData: false,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Fetches the aggregated dashboard summary.
 * Queries PostgreSQL when connected; gracefully provides clean zero-state when empty.
 */
export async function getDashboardSummary() {
  try {
    // 1. Overall KPI Aggregates
    const kpiResult = await pool.query(`
      SELECT 
        COUNT(*)::int AS total_tests,
        COALESCE(ROUND(AVG(download_speed_mbps)::numeric, 2), 0) AS avg_download,
        COALESCE(ROUND(AVG(upload_speed_mbps)::numeric, 2), 0) AS avg_upload,
        COALESCE(ROUND(AVG(latency_ms)::numeric, 2), 0) AS avg_latency
      FROM network_tests;
    `);

    const kpiRow = kpiResult.rows[0] || {};
    const totalTests = parseInt(kpiRow.total_tests, 10) || 0;

    if (totalTests === 0) {
      return getEmptySummaryState();
    }

    // 2. Quality Category Distribution
    const qualityResult = await pool.query(`
      SELECT 
        quality_category,
        COUNT(*)::int AS category_count
      FROM network_tests
      GROUP BY quality_category;
    `);

    let goodCount = 0;
    let moderateCount = 0;
    let poorCount = 0;

    for (const row of qualityResult.rows) {
      const cat = (row.quality_category || '').toLowerCase();
      const count = parseInt(row.category_count, 10) || 0;
      if (cat === 'good') goodCount = count;
      else if (cat === 'moderate') moderateCount = count;
      else if (cat === 'poor') poorCount = count;
    }

    const goodPercent = totalTests > 0 ? Number(((goodCount / totalTests) * 100).toFixed(1)) : 0;
    const moderatePercent = totalTests > 0 ? Number(((moderateCount / totalTests) * 100).toFixed(1)) : 0;
    const poorPercent = totalTests > 0 ? Number(((poorCount / totalTests) * 100).toFixed(1)) : 0;

    // 3. Critical Dead Zones (Locations where avg download < 5 Mbps OR avg latency > 150 ms)
    const deadZonesResult = await pool.query(`
      SELECT 
        l.id AS "locationId",
        l.building_name AS "buildingName",
        l.zone_name AS "zoneName",
        l.floor AS "floor",
        ROUND(AVG(t.download_speed_mbps)::numeric, 2) AS "avgDownloadSpeedMbps",
        ROUND(AVG(t.upload_speed_mbps)::numeric, 2) AS "avgUploadSpeedMbps",
        ROUND(AVG(t.latency_ms)::numeric, 2) AS "avgLatencyMs",
        COUNT(t.id)::int AS "testCount"
      FROM locations l
      JOIN network_tests t ON l.id = t.location_id
      GROUP BY l.id, l.building_name, l.zone_name, l.floor
      HAVING AVG(t.download_speed_mbps) < 5.0 OR AVG(t.latency_ms) > 150.0
      ORDER BY "avgDownloadSpeedMbps" ASC
      LIMIT 10;
    `);

    // 4. Recent Test Submissions
    const recentResult = await pool.query(`
      SELECT 
        t.id,
        t.location_id AS "locationId",
        COALESCE(l.building_name || ' - ' || l.zone_name, 'Unknown Location') AS "locationName",
        t.download_speed_mbps AS "downloadSpeedMbps",
        t.upload_speed_mbps AS "uploadSpeedMbps",
        t.latency_ms AS "latencyMs",
        t.quality_category AS "qualityCategory",
        t.recorded_at AS "recordedAt"
      FROM network_tests t
      LEFT JOIN locations l ON t.location_id = l.id
      ORDER BY t.recorded_at DESC
      LIMIT 10;
    `);

    return {
      kpi: {
        totalTestsRecorded: totalTests,
        avgDownloadSpeedMbps: parseFloat(kpiRow.avg_download) || 0,
        avgUploadSpeedMbps: parseFloat(kpiRow.avg_upload) || 0,
        avgLatencyMs: parseFloat(kpiRow.avg_latency) || 0,
        identifiedDeadZones: deadZonesResult.rows.length,
      },
      qualityDistribution: {
        goodCount,
        moderateCount,
        poorCount,
        goodPercent,
        moderatePercent,
        poorPercent,
      },
      criticalDeadZones: deadZonesResult.rows,
      recentTests: recentResult.rows,
      hasData: true,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('[DashboardService] Query error:', error.message);
    throw error;
  }
}

/**
 * Returns performance comparison aggregated by campus building/zone.
 */
export async function getLocationComparison() {
  try {
    const result = await pool.query(`
      SELECT 
        l.id AS "locationId",
        l.building_name AS "buildingName",
        l.zone_name AS "zoneName",
        l.floor AS "floor",
        ROUND(AVG(t.download_speed_mbps)::numeric, 2) AS "avgDownloadSpeedMbps",
        ROUND(AVG(t.upload_speed_mbps)::numeric, 2) AS "avgUploadSpeedMbps",
        ROUND(AVG(t.latency_ms)::numeric, 2) AS "avgLatencyMs",
        COUNT(t.id)::int AS "totalTests",
        CASE 
          WHEN AVG(t.download_speed_mbps) >= 15.0 AND AVG(t.latency_ms) < 50.0 THEN 'Good'
          WHEN AVG(t.download_speed_mbps) < 5.0 OR AVG(t.latency_ms) > 150.0 THEN 'Poor'
          ELSE 'Moderate'
        END AS "overallQuality"
      FROM locations l
      LEFT JOIN network_tests t ON l.id = t.location_id
      GROUP BY l.id, l.building_name, l.zone_name, l.floor
      ORDER BY l.building_name ASC, l.floor ASC;
    `);
    return result.rows;
  } catch (error) {
    console.error('[DashboardService] Location comparison query error:', error.message);
    throw error;
  }
}

/**
 * Returns recent tests for dashboard widgets.
 */
export async function getRecentTests(limit = 10) {
  const safeLimit = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 50);

  try {
    const result = await pool.query(`
      SELECT 
        t.id,
        t.location_id AS "locationId",
        COALESCE(l.building_name || ' - ' || l.zone_name, 'Unknown Location') AS "locationName",
        t.download_speed_mbps AS "downloadSpeedMbps",
        t.upload_speed_mbps AS "uploadSpeedMbps",
        t.latency_ms AS "latencyMs",
        t.quality_category AS "qualityCategory",
        t.recorded_at AS "recordedAt"
      FROM network_tests t
      LEFT JOIN locations l ON t.location_id = l.id
      ORDER BY t.recorded_at DESC
      LIMIT $1;
    `, [safeLimit]);
    return result.rows;
  } catch (error) {
    console.error('[DashboardService] Recent tests query error:', error.message);
    throw error;
  }
}

export default {
  getDashboardSummary,
  getLocationComparison,
  getRecentTests,
};
