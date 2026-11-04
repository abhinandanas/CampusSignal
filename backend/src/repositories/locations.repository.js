import { requirePool } from '../config/database.js';

export async function findAll(query = requirePool()) {
  const { rows } = await query.query(
    `SELECT id, building_name AS "buildingName", floor, zone_name AS "zoneName",
            description, target_ap AS "targetAp", is_active AS "isActive", created_at AS "createdAt"
     FROM locations WHERE is_active = true ORDER BY building_name, floor, zone_name`,
  );
  return rows;
}

export async function findById(id, query = requirePool()) {
  const { rows } = await query.query(
    `SELECT id, building_name AS "buildingName", floor, zone_name AS "zoneName",
            description, target_ap AS "targetAp", is_active AS "isActive", created_at AS "createdAt"
     FROM locations WHERE id = $1 AND is_active = true`, [id]);
  return rows[0] || null;
}
