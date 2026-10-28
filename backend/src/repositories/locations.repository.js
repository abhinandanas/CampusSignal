import { requirePool } from '../config/database.js';

export async function findAll(query = requirePool()) {
  const { rows } = await query.query(
    `SELECT id, name, description, created_at FROM locations ORDER BY name ASC`,
  );
  return rows;
}

export async function findById(id, query = requirePool()) {
  const { rows } = await query.query('SELECT id, name, description, created_at FROM locations WHERE id = $1', [id]);
  return rows[0] || null;
}
