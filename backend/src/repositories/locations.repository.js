import { requirePool } from '../config/database.js';

/**
 * Retrieve all active campus locations with optional filters.
 * Joined with lateral subquery on network_tests to surface real Wi-Fi status when available.
 * Fully parameterized SQL queries to prevent SQL injection.
 *
 * @param {Object} [filters] - Filter options: { building, floor, search }
 * @param {Object} [query] - Database client or pool (defaults to configured pg pool)
 * @returns {Promise<Array>} List of location records
 */
export async function findAll(filters = {}, query = requirePool()) {
  // Support both findAll(filters, query) and findAll(query) for backwards compatibility
  const isFirstArgQuery = filters && typeof filters.query === 'function';
  const activeQuery = isFirstArgQuery ? filters : query;
  const activeFilters = isFirstArgQuery ? {} : (filters || {});

  const { building, floor, search } = activeFilters;
  const conditions = ['l.is_active = true'];
  const values = [];

  if (building !== undefined && building !== null && String(building).trim() !== '') {
    values.push(String(building).trim());
    conditions.push(`LOWER(l.building_name) = LOWER($${values.length})`);
  }

  if (floor !== undefined && floor !== null && String(floor).trim() !== '') {
    const parsedFloor = Number.parseInt(floor, 10);
    if (!Number.isNaN(parsedFloor)) {
      values.push(parsedFloor);
      conditions.push(`l.floor = $${values.length}`);
    }
  }

  if (search !== undefined && search !== null && String(search).trim() !== '') {
    values.push(`%${String(search).trim()}%`);
    const paramIndex = `$${values.length}`;
    conditions.push(`(l.zone_name ILIKE ${paramIndex} OR l.building_name ILIKE ${paramIndex} OR COALESCE(l.description, '') ILIKE ${paramIndex})`);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const sql = `
    SELECT 
      l.id,
      l.building_name AS "buildingName",
      l.floor,
      l.zone_name AS "zoneName",
      l.description,
      l.target_ap AS "targetAp",
      l.is_active AS "isActive",
      l.created_at AS "createdAt",
      latest_test.quality_category AS "qualityCategory",
      CASE latest_test.quality_category
        WHEN 'Good' THEN 'good'
        WHEN 'Moderate' THEN 'fair'
        WHEN 'Poor' THEN 'weak'
        ELSE NULL
      END AS status,
      latest_test.download_speed_mbps AS "downloadSpeedMbps",
      latest_test.latency_ms AS "latencyMs",
      latest_test.recorded_at AS "lastTestedAt"
    FROM locations l
    LEFT JOIN LATERAL (
      SELECT quality_category, download_speed_mbps, latency_ms, recorded_at
      FROM network_tests nt
      WHERE nt.location_id = l.id
      ORDER BY nt.recorded_at DESC
      LIMIT 1
    ) latest_test ON true
    ${whereClause}
    ORDER BY l.building_name ASC, l.floor ASC, l.zone_name ASC
  `;

  const { rows } = await activeQuery.query(sql, values);
  return rows;
}

/**
 * Retrieve a single location record by its UUID.
 *
 * @param {string} id - UUID of the location
 * @param {Object} [query] - Database client or pool
 * @returns {Promise<Object|null>} Location record or null if not found
 */
export async function findById(id, query = requirePool()) {
  const { rows } = await query.query(
    `SELECT 
       l.id,
       l.building_name AS "buildingName",
       l.floor,
       l.zone_name AS "zoneName",
       l.description,
       l.target_ap AS "targetAp",
       l.is_active AS "isActive",
       l.created_at AS "createdAt",
       latest_test.quality_category AS "qualityCategory",
       CASE latest_test.quality_category
         WHEN 'Good' THEN 'good'
         WHEN 'Moderate' THEN 'fair'
         WHEN 'Poor' THEN 'weak'
         ELSE NULL
       END AS status,
       latest_test.download_speed_mbps AS "downloadSpeedMbps",
       latest_test.latency_ms AS "latencyMs",
       latest_test.recorded_at AS "lastTestedAt"
     FROM locations l
     LEFT JOIN LATERAL (
       SELECT quality_category, download_speed_mbps, latency_ms, recorded_at
       FROM network_tests nt
       WHERE nt.location_id = l.id
       ORDER BY nt.recorded_at DESC
       LIMIT 1
     ) latest_test ON true
     WHERE l.id = $1 AND l.is_active = true`,
    [id],
  );
  return rows[0] || null;
}
