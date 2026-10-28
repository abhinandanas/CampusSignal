import { requirePool } from '../config/database.js';

export async function create({ locationId, downloadMbps, uploadMbps, latencyMs, status, measurementSource }, query = requirePool()) {
  const { rows } = await query.query(
    `INSERT INTO network_tests (location_id, download_mbps, upload_mbps, latency_ms, status, measurement_source)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, location_id, download_mbps, upload_mbps, latency_ms, status, measurement_source, created_at`,
    [locationId, downloadMbps, uploadMbps, latencyMs, status, measurementSource],
  );
  return rows[0];
}

export async function findAll({ locationId, status, limit = 50, offset = 0 } = {}, query = requirePool()) {
  const values = [];
  const conditions = [];
  if (locationId !== undefined) { values.push(locationId); conditions.push(`nt.location_id = $${values.length}`); }
  if (status !== undefined) { values.push(status); conditions.push(`nt.status = $${values.length}`); }
  values.push(limit); const limitParam = `$${values.length}`;
  values.push(offset); const offsetParam = `$${values.length}`;
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const { rows } = await query.query(
    `SELECT nt.id, nt.location_id, l.name AS location_name, nt.download_mbps, nt.upload_mbps,
            nt.latency_ms, nt.status, nt.measurement_source, nt.created_at
     FROM network_tests nt JOIN locations l ON l.id = nt.location_id
     ${where} ORDER BY nt.created_at DESC, nt.id DESC LIMIT ${limitParam} OFFSET ${offsetParam}`,
    values,
  );
  return rows;
}

export async function findById(id, query = requirePool()) {
  const { rows } = await query.query(
    `SELECT nt.id, nt.location_id, l.name AS location_name, nt.download_mbps, nt.upload_mbps,
            nt.latency_ms, nt.status, nt.measurement_source, nt.created_at
     FROM network_tests nt JOIN locations l ON l.id = nt.location_id WHERE nt.id = $1`, [id],
  );
  return rows[0] || null;
}

export async function getSummary(query = requirePool()) {
  const [tests, locations] = await Promise.all([
    query.query(`SELECT COUNT(*)::int AS total_tests,
      COUNT(*) FILTER (WHERE status = 'good')::int AS good_count,
      COUNT(*) FILTER (WHERE status = 'fair')::int AS fair_count,
      COUNT(*) FILTER (WHERE status = 'weak')::int AS weak_count,
      COALESCE(AVG(download_mbps), 0)::float AS average_download_mbps
      FROM network_tests`),
    query.query('SELECT COUNT(*)::int AS total_locations FROM locations'),
  ]);
  return { ...tests.rows[0], total_locations: locations.rows[0].total_locations };
}
