/**
 * CampusSignal — Network Tests Database Repository
 * Purpose: Data-access layer for empirical Wi-Fi throughput and latency measurements
 */

import { query } from '../config/database.js';

/**
 * Persist a newly measured network speed test.
 * @param {Object} testData
 * @returns {Promise<Object>}
 */
export async function createTest(testData) {
  const {
    locationId,
    downloadSpeedMbps,
    uploadSpeedMbps,
    latencyMs,
    jitterMs = null,
    packetLossPercent = null,
    qualityCategory,
    networkSsid = null,
    clientDevice = null,
  } = testData;

  const sql = `
    INSERT INTO network_tests (
      location_id,
      download_speed_mbps,
      upload_speed_mbps,
      latency_ms,
      jitter_ms,
      packet_loss_percent,
      quality_category,
      network_ssid,
      client_device
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING 
      id,
      location_id AS "locationId",
      download_speed_mbps AS "downloadSpeedMbps",
      upload_speed_mbps AS "uploadSpeedMbps",
      latency_ms AS "latencyMs",
      jitter_ms AS "jitterMs",
      packet_loss_percent AS "packetLossPercent",
      quality_category AS "qualityCategory",
      network_ssid AS "networkSsid",
      client_device AS "clientDevice",
      recorded_at AS "recordedAt";
  `;

  const result = await query(sql, [
    locationId,
    downloadSpeedMbps,
    uploadSpeedMbps,
    latencyMs,
    jitterMs,
    packetLossPercent,
    qualityCategory,
    networkSsid,
    clientDevice,
  ]);

  return result.rows[0];
}

/**
 * Retrieve the most recent network measurements with associated location metadata.
 * @param {number} [limit=10]
 * @returns {Promise<Array<Object>>}
 */
export async function getRecentTests(limit = 10) {
  const safeLimit = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);

  const sql = `
    SELECT 
      t.id,
      t.location_id AS "locationId",
      COALESCE(l.building_name || ' - ' || l.zone_name, 'Unknown Location') AS "locationName",
      l.building_name AS "buildingName",
      l.floor AS "floor",
      l.zone_name AS "zoneName",
      t.download_speed_mbps AS "downloadSpeedMbps",
      t.upload_speed_mbps AS "uploadSpeedMbps",
      t.latency_ms AS "latencyMs",
      t.jitter_ms AS "jitterMs",
      t.packet_loss_percent AS "packetLossPercent",
      t.quality_category AS "qualityCategory",
      t.recorded_at AS "recordedAt"
    FROM network_tests t
    LEFT JOIN locations l ON t.location_id = l.id
    ORDER BY t.recorded_at DESC
    LIMIT $1;
  `;

  const result = await query(sql, [safeLimit]);
  return result.rows;
}

/**
 * Retrieve paginated test history with optional location and quality filters.
 * @param {Object} [filters]
 * @returns {Promise<{ tests: Array<Object>, total: number }>}
 */
export async function getTestsHistory({ locationId, quality, limit = 25, offset = 0 } = {}) {
  const conditions = [];
  const params = [];
  const parsedLimit = Number(limit);
  const parsedOffset = Number(offset);
  const safeLimit = Number.isSafeInteger(parsedLimit) && parsedLimit > 0
    ? Math.min(parsedLimit, 100)
    : 25;
  const safeOffset = Number.isSafeInteger(parsedOffset) && parsedOffset >= 0
    ? parsedOffset
    : 0;

  if (locationId) {
    params.push(locationId);
    conditions.push(`t.location_id = $${params.length}`);
  }

  if (quality) {
    params.push(quality);
    conditions.push(`LOWER(t.quality_category) = LOWER($${params.length})`);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  // Get total matching count
  const countSql = `
    SELECT COUNT(*)::int AS total
    FROM network_tests t
    ${whereClause};
  `;
  const countResult = await query(countSql, params);
  const total = countResult.rows[0]?.total || 0;

  // Get paginated slice
  const dataParams = [...params, safeLimit, safeOffset];
  const dataSql = `
    SELECT 
      t.id,
      t.location_id AS "locationId",
      COALESCE(l.building_name || ' - ' || l.zone_name, 'Unknown Location') AS "locationName",
      l.building_name AS "buildingName",
      l.floor AS "floor",
      t.download_speed_mbps AS "downloadSpeedMbps",
      t.upload_speed_mbps AS "uploadSpeedMbps",
      t.latency_ms AS "latencyMs",
      t.jitter_ms AS "jitterMs",
      t.quality_category AS "qualityCategory",
      t.recorded_at AS "recordedAt"
    FROM network_tests t
    LEFT JOIN locations l ON t.location_id = l.id
    ${whereClause}
    ORDER BY t.recorded_at DESC
    LIMIT $${params.length + 1} OFFSET $${params.length + 2};
  `;

  const dataResult = await query(dataSql, dataParams);

  return {
    tests: dataResult.rows,
    total,
  };
}

/**
 * Compute high-level KPI aggregates across all recorded tests.
 * @returns {Promise<Object>}
 */
export async function getAggregatedKPIs() {
  const sql = `
    SELECT 
      COUNT(*)::int AS "totalTestsRecorded",
      COALESCE(ROUND(AVG(download_speed_mbps)::numeric, 2), 0) AS "avgDownloadSpeedMbps",
      COALESCE(ROUND(AVG(upload_speed_mbps)::numeric, 2), 0) AS "avgUploadSpeedMbps",
      COALESCE(ROUND(AVG(latency_ms)::numeric, 2), 0) AS "avgLatencyMs"
    FROM network_tests;
  `;
  const result = await query(sql);
  const row = result.rows[0] || {};
  return {
    totalTestsRecorded: parseInt(row.totalTestsRecorded, 10) || 0,
    avgDownloadSpeedMbps: parseFloat(row.avgDownloadSpeedMbps) || 0,
    avgUploadSpeedMbps: parseFloat(row.avgUploadSpeedMbps) || 0,
    avgLatencyMs: parseFloat(row.avgLatencyMs) || 0,
  };
}

export default {
  createTest,
  getRecentTests,
  getTestsHistory,
  getAggregatedKPIs,
};
