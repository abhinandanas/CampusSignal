const SOURCES = new Set(['browser', 'demo']);
const STATUSES = new Set(['good', 'fair', 'weak']);

function finiteRange(value, field, max, errors) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > max) {
    errors.push(`${field} must be a finite number between 0 and ${max}`);
  }
}

export function validateCreateTest(body) {
  const errors = [];
  if (!body || typeof body !== 'object' || Array.isArray(body)) return { errors: ['Request body must be a JSON object'] };
  if (!Number.isSafeInteger(body.locationId) || body.locationId <= 0) errors.push('locationId must be a positive integer');
  finiteRange(body.downloadMbps, 'downloadMbps', 10000, errors);
  finiteRange(body.uploadMbps, 'uploadMbps', 10000, errors);
  finiteRange(body.latencyMs, 'latencyMs', 60000, errors);
  if (typeof body.latencyMs === 'number' && Number.isFinite(body.latencyMs) && !Number.isInteger(body.latencyMs)) errors.push('latencyMs must be a whole number because the database stores milliseconds as an integer');
  if (!SOURCES.has(body.measurementSource)) errors.push('measurementSource must be browser or demo');
  return { errors };
}

export function validateListFilters(query) {
  const errors = [];
  let locationId;
  let limit = 50;
  let offset = 0;
  if (query.locationId !== undefined) {
    if (!/^\d+$/.test(query.locationId) || !Number.isSafeInteger(Number(query.locationId)) || Number(query.locationId) < 1) errors.push('locationId must be a positive integer');
    else locationId = Number(query.locationId);
  }
  if (query.status !== undefined && !STATUSES.has(query.status)) errors.push('status must be one of: good, fair, weak');
  if (query.limit !== undefined) {
    if (!/^\d+$/.test(query.limit) || !Number.isSafeInteger(Number(query.limit)) || Number(query.limit) < 1 || Number(query.limit) > 500) errors.push('limit must be an integer between 1 and 500');
    else limit = Number(query.limit);
  }
  if (query.offset !== undefined) {
    if (!/^\d+$/.test(query.offset) || !Number.isSafeInteger(Number(query.offset))) errors.push('offset must be a nonnegative integer');
    else offset = Number(query.offset);
  }
  return { errors, filters: { locationId, status: query.status, limit, offset } };
}

export function validateId(value) {
  return /^\d+$/.test(value) && Number.isSafeInteger(Number(value)) && Number(value) > 0 ? Number(value) : null;
}

export function classifyStatus(downloadMbps) {
  if (downloadMbps >= 25) return 'good';
  if (downloadMbps >= 10) return 'fair';
  return 'weak';
}
