/**
 * CampusSignal — Locations Database Repository
 * Purpose: Data-access layer for campus buildings, floors, and testing zones
 */

import { query } from '../config/database.js';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Fetch all registered campus locations with optional filtering.
 * @param {Object} [filters]
 * @param {string} [filters.building] - Filter by building name
 * @param {boolean} [filters.isActive=true] - Filter by active status
 * @returns {Promise<Array<Object>>}
 */
export async function getAllLocations(filters = {}) {
  const conditions = [];
  const params = [];

  if (filters.isActive !== undefined) {
    params.push(Boolean(filters.isActive));
    conditions.push(`is_active = $${params.length}`);
  } else {
    // Default to active locations
    conditions.push(`is_active = true`);
  }

  if (filters.building) {
    params.push(filters.building);
    conditions.push(`building_name = $${params.length}`);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const sql = `
    SELECT 
      id,
      building_name AS "buildingName",
      floor,
      zone_name AS "zoneName",
      description,
      target_ap AS "targetAp",
      is_active AS "isActive",
      created_at AS "createdAt"
    FROM locations
    ${whereClause}
    ORDER BY building_name ASC, floor ASC, zone_name ASC;
  `;

  const result = await query(sql, params);
  return result.rows;
}

/**
 * Find a specific campus location by its primary key UUID.
 * @param {string} id - Location UUID
 * @returns {Promise<Object|null>}
 */
export async function getLocationById(id) {
  if (typeof id !== 'string' || !UUID_PATTERN.test(id)) {
    return null;
  }

  const sql = `
    SELECT 
      id,
      building_name AS "buildingName",
      floor,
      zone_name AS "zoneName",
      description,
      target_ap AS "targetAp",
      is_active AS "isActive",
      created_at AS "createdAt"
    FROM locations
    WHERE id = $1;
  `;
  const result = await query(sql, [id]);
  return result.rows[0] || null;
}

/**
 * Register a new campus location.
 * @param {Object} locationData
 * @returns {Promise<Object>}
 */
export async function createLocation(locationData) {
  const {
    buildingName,
    floor,
    zoneName,
    description = null,
    targetAp = null,
    isActive = true,
  } = locationData;

  const sql = `
    INSERT INTO locations (
      building_name,
      floor,
      zone_name,
      description,
      target_ap,
      is_active
    ) VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING 
      id,
      building_name AS "buildingName",
      floor,
      zone_name AS "zoneName",
      description,
      target_ap AS "targetAp",
      is_active AS "isActive",
      created_at AS "createdAt";
  `;

  const result = await query(sql, [
    buildingName,
    floor,
    zoneName,
    description,
    targetAp,
    isActive,
  ]);

  return result.rows[0];
}

export default {
  getAllLocations,
  getLocationById,
  createLocation,
};
