/**
 * CampusSignal — Campus Locations Service
 * Owner: Yashwanth
 *
 * Communicates with the Express locations API endpoints,
 * validates responses, normalizes campus metadata, and handles errors.
 */

import { request } from './apiClient';

/**
 * Normalizes a raw location record from the API to guarantee consistent field names.
 *
 * @param {Object} item - Raw location item from backend
 * @returns {Object|null} Normalized location object
 */
export function normalizeLocation(item) {
  if (!item || item.id == null) return null;

  return {
    id: String(item.id),
    buildingName: item.buildingName ?? item.building_name ?? item.name ?? 'Campus Building',
    floor: item.floor != null ? Number(item.floor) : null,
    zoneName: item.zoneName ?? item.zone_name ?? item.name ?? 'Monitored Zone',
    description: item.description || '',
    targetAp: item.targetAp ?? item.target_ap ?? null,
    isActive: item.isActive ?? item.is_active ?? true,
    createdAt: item.createdAt ?? item.created_at ?? null,
    qualityCategory: item.qualityCategory ?? item.quality_category ?? null,
    status: item.status ?? (item.qualityCategory ? String(item.qualityCategory).toLowerCase() : null),
    downloadSpeedMbps: item.downloadSpeedMbps != null ? Number(item.downloadSpeedMbps) : null,
    latencyMs: item.latencyMs != null ? Number(item.latencyMs) : null,
    lastTestedAt: item.lastTestedAt ?? item.last_tested_at ?? null,
  };
}

/**
 * Fetch campus locations from Express backend with optional query filters.
 *
 * @param {Object} [params] - Filter options: { building, floor, search, signal }
 * @returns {Promise<Array>} Normalized array of location objects
 */
export async function getCampusLocations({ building, floor, search, signal } = {}) {
  const query = new URLSearchParams();

  if (building && String(building).trim() !== '') {
    query.append('building', String(building).trim());
  }

  if (floor !== undefined && floor !== null && String(floor).trim() !== '') {
    query.append('floor', String(floor).trim());
  }

  if (search && String(search).trim() !== '') {
    query.append('search', String(search).trim());
  }

  const queryString = query.toString();
  const endpoint = queryString ? `/locations?${queryString}` : '/locations';

  const body = await request(endpoint, {
    method: 'GET',
    signal,
  });

  const records = Array.isArray(body) ? body : (body?.data || []);
  if (!Array.isArray(records)) {
    throw new Error('The locations API returned an unsupported response format.');
  }

  return records.map(normalizeLocation).filter(Boolean);
}

/**
 * Retrieve a specific location record by its UUID.
 *
 * @param {string} id - Location UUID
 * @param {Object} [options] - Options including signal for cancellation
 * @returns {Promise<Object>} Normalized location object
 */
export async function getLocationById(id, { signal } = {}) {
  if (!id) throw new Error('A location ID is required.');

  const body = await request(`/locations/${id}`, {
    method: 'GET',
    signal,
  });

  const record = body?.data ?? body;
  const normalized = normalizeLocation(record);
  if (!normalized) {
    throw new Error(`Location with ID ${id} was not found.`);
  }

  return normalized;
}

const locationService = {
  getCampusLocations,
  getLocationById,
  normalizeLocation,
};

export default locationService;
