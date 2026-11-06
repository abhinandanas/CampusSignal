/**
 * CampusSignal — Test History Service
 * Owner: Santosh (USN: 4SF24IS100)
 *
 * Communicates with the Express network tests API (/api/tests),
 * normalizes telemetry measurements, and supports filtering by location and status.
 */

import { request } from './apiClient';

/**
 * Normalizes a raw test measurement record from the backend API.
 *
 * @param {Object} item - Raw test record from backend
 * @returns {Object|null} Normalized test measurement object
 */
export function normalizeTestRecord(item) {
  if (!item || item.id == null) return null;

  const download = Number(item.download_mbps ?? item.downloadMbps ?? item.download_speed_mbps ?? 0);
  const upload = Number(item.upload_mbps ?? item.uploadMbps ?? item.upload_speed_mbps ?? 0);
  const latency = Number(item.latency_ms ?? item.latencyMs ?? 0);

  // Status mapping: good/healthy, fair/moderate/weak, weak/poor/dead zone
  const rawStatus = (item.status ?? item.quality_category ?? item.qualityCategory ?? '').toLowerCase();
  let status = 'good';
  if (rawStatus === 'weak' || rawStatus === 'poor' || download < 10) {
    status = 'weak';
  } else if (rawStatus === 'fair' || rawStatus === 'moderate' || download < 25) {
    status = 'fair';
  }

  return {
    id: String(item.id),
    locationId: item.location_id ?? item.locationId ?? null,
    locationName: item.location_name ?? item.locationName ?? item.location ?? 'Campus Test Zone',
    downloadMbps: Number.isFinite(download) ? download : 0,
    uploadMbps: Number.isFinite(upload) ? upload : 0,
    latencyMs: Number.isFinite(latency) ? latency : 0,
    status,
    qualityCategory: item.quality_category ?? item.qualityCategory ?? (status === 'good' ? 'Good' : status === 'fair' ? 'Moderate' : 'Poor'),
    measurementSource: item.measurement_source ?? item.measurementSource ?? 'browser',
    createdAt: item.created_at ?? item.createdAt ?? item.recorded_at ?? new Date().toISOString(),
  };
}

/**
 * Fetches historical network tests from the backend API with optional filters.
 *
 * @param {Object} [params] - Query options: { locationId, status, limit, offset, signal }
 * @returns {Promise<Array>} Array of normalized test records
 */
export async function getTestHistory({ locationId, status, limit = 50, offset = 0, signal } = {}) {
  const query = new URLSearchParams();

  if (locationId && String(locationId).trim() !== '') {
    query.append('locationId', String(locationId).trim());
  }

  if (status && ['good', 'fair', 'weak'].includes(status.toLowerCase())) {
    query.append('status', status.toLowerCase());
  }

  if (limit !== undefined && limit !== null) {
    query.append('limit', String(limit));
  }

  if (offset !== undefined && offset !== null) {
    query.append('offset', String(offset));
  }

  const queryString = query.toString();
  const endpoint = queryString ? `/tests?${queryString}` : '/tests';

  const body = await request(endpoint, {
    method: 'GET',
    signal,
  });

  const records = Array.isArray(body) ? body : (body?.data || []);
  if (!Array.isArray(records)) {
    throw new Error('The tests API returned an unsupported response format.');
  }

  return records.map(normalizeTestRecord).filter(Boolean);
}

/**
 * Fetches a single test record by UUID.
 *
 * @param {string} id - Test record UUID
 * @param {Object} [options] - Options including abort signal
 * @returns {Promise<Object>} Normalized test record
 */
export async function getTestById(id, { signal } = {}) {
  if (!id) throw new Error('A test ID is required.');

  const body = await request(`/tests/${id}`, {
    method: 'GET',
    signal,
  });

  const record = body?.data ?? body;
  const normalized = normalizeTestRecord(record);
  if (!normalized) {
    throw new Error(`Test record with ID ${id} was not found.`);
  }

  return normalized;
}

const historyService = {
  getTestHistory,
  getTestById,
  normalizeTestRecord,
};

export default historyService;
