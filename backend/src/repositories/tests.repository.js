import { requirePool } from '../config/database.js';

export async function create({ locationId, downloadMbps, uploadMbps, latencyMs, status, measurementSource }, query = requirePool()) {
  const qualityCategory = ({ good: 'Good', fair: 'Moderate', weak: 'Poor' })[status];
  const { rows } = await query.query(
    `INSERT INTO network_tests (location_id, download_speed_mbps, upload_speed_mbps, latency_ms, quality_category, client_device, measurement_source)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id, location_id, download_speed_mbps AS download_mbps,
       upload_speed_mbps AS upload_mbps, latency_ms,
       LOWER(quality_category) AS quality_category,
       CASE quality_category WHEN 'Good' THEN 'good' WHEN 'Moderate' THEN 'fair' ELSE 'weak' END AS status,
       measurement_source, recorded_at AS created_at`,
    [locationId, downloadMbps, uploadMbps, latencyMs, qualityCategory, measurementSource, measurementSource],
  );
  return rows[0];
}

export async function findAll({ locationId, status, limit = 50, offset = 0 } = {}, query = requirePool()) {
  const values = [];
  const conditions = [];
  if (locationId !== undefined) { values.push(locationId); conditions.push(`nt.location_id = $${values.length}`); }
  if (status !== undefined) {
    values.push(({ good: 'Good', fair: 'Moderate', weak: 'Poor' })[status]);
    conditions.push(`nt.quality_category = $${values.length}`);
  }
  values.push(limit); const limitParam = `$${values.length}`;
  values.push(offset); const offsetParam = `$${values.length}`;
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const { rows } = await query.query(
    `SELECT nt.id, nt.location_id, l.building_name || ' - ' || l.zone_name AS location_name,
            nt.download_speed_mbps AS download_mbps, nt.upload_speed_mbps AS upload_mbps,
            nt.latency_ms, LOWER(nt.quality_category) AS quality_category,
            CASE nt.quality_category WHEN 'Good' THEN 'good' WHEN 'Moderate' THEN 'fair' ELSE 'weak' END AS status,
            nt.measurement_source, nt.recorded_at AS created_at
     FROM network_tests nt JOIN locations l ON l.id = nt.location_id
     ${where} ORDER BY nt.recorded_at DESC, nt.id DESC LIMIT ${limitParam} OFFSET ${offsetParam}`,
    values,
  );
  return rows;
}

export async function findById(id, query = requirePool()) {
  const { rows } = await query.query(
    `SELECT nt.id, nt.location_id, l.building_name || ' - ' || l.zone_name AS location_name,
            nt.download_speed_mbps AS download_mbps, nt.upload_speed_mbps AS upload_mbps,
            nt.latency_ms, LOWER(nt.quality_category) AS quality_category,
            CASE nt.quality_category WHEN 'Good' THEN 'good' WHEN 'Moderate' THEN 'fair' ELSE 'weak' END AS status,
            nt.measurement_source, nt.recorded_at AS created_at
     FROM network_tests nt JOIN locations l ON l.id = nt.location_id WHERE nt.id = $1`, [id],
  );
  return rows[0] || null;
}

export async function getSummary(query = requirePool()) {
  const [tests, locations] = await Promise.all([
    query.query(`SELECT COUNT(*)::int AS total_tests,
      COUNT(*) FILTER (WHERE quality_category = 'Good')::int AS good_count,
      COUNT(*) FILTER (WHERE quality_category = 'Moderate')::int AS fair_count,
      COUNT(*) FILTER (WHERE quality_category = 'Poor')::int AS weak_count,
      COALESCE(AVG(download_speed_mbps), 0)::float AS average_download_mbps,
      COALESCE(AVG(upload_speed_mbps), 0)::float AS average_upload_mbps,
      COALESCE(AVG(latency_ms), 0)::float AS average_latency_ms
      FROM network_tests`),
    query.query('SELECT COUNT(*)::int AS total_locations FROM locations'),
  ]);
  return { ...tests.rows[0], total_locations: locations.rows[0].total_locations };
}
