import test from 'node:test';
import assert from 'node:assert/strict';
import { createDashboardController } from '../src/controllers/dashboard.controller.js';
import { createHealthController } from '../src/controllers/health.controller.js';
import { createLocationsController } from '../src/controllers/locations.controller.js';
import { createTestsController } from '../src/controllers/tests.controller.js';
import { createNetworkTestService } from '../src/services/networkTest.service.js';
import * as testsRepository from '../src/repositories/tests.repository.js';
import { asyncHandler } from '../src/middleware/asyncHandler.js';
import { notFound } from '../src/middleware/notFound.js';
import { errorHandler } from '../src/middleware/errorHandler.js';
import { classifyStatus } from '../src/validators/test.validator.js';

function response() {
  return { statusCode: 200, body: undefined,
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; } };
}

test('classifies download thresholds on the server', () => {
  assert.equal(classifyStatus(25), 'good');
  assert.equal(classifyStatus(10), 'fair');
  assert.equal(classifyStatus(9.99), 'weak');
});

test('health reports connected and degraded database states', async () => {
  const ok = response();
  await createHealthController({ query: async () => ({ rows: [{ ok: 1 }] }) })({}, ok);
  assert.equal(ok.statusCode, 200);
  assert.equal(ok.body.data.database, 'connected');
  const degraded = response();
  await createHealthController({ query: async () => { throw new Error('private DB details'); } })({}, degraded);
  assert.equal(degraded.body.status, 'degraded');
  assert.equal(degraded.body.data.database, 'disconnected');
  assert.equal(JSON.stringify(degraded.body).includes('private DB details'), false);
  const unconfigured = response();
  await createHealthController(null)({}, unconfigured);
  assert.equal(unconfigured.body.data.database, 'disconnected');
});

test('locations use the standard data envelope', async () => {
  const res = response();
  await createLocationsController({ list: async () => [{ id: 1, name: 'Library' }] }).list({}, res);
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.count, 1);
  assert.equal(res.body.data[0].name, 'Library');
});

test('valid test is saved and returns 201 with server-calculated status', async () => {
  let saved;
  const service = createNetworkTestService({ create: async (input) => { saved = input; return { id: 7, ...input }; } }, { findById: async () => ({ id: 2 }) });
  const c = createTestsController(service);
  const res = response();
  await c.create({ body: { locationId: 2, downloadMbps: 25, uploadMbps: 3, latencyMs: 5, measurementSource: 'demo' } }, res);
  assert.equal(res.statusCode, 201);
  assert.equal(res.body.data.status, 'good');
  assert.equal(saved.status, 'good');
});

test('invalid input and missing locations are rejected', async () => {
  const c = createTestsController({ create: async () => null });
  const invalid = response();
  await c.create({ body: { locationId: 1, downloadMbps: -1, uploadMbps: 2, latencyMs: 2, measurementSource: 'other' } }, invalid);
  assert.equal(invalid.statusCode, 400);
  assert.equal(invalid.body.status, 'error');
  const missing = response();
  await c.create({ body: { locationId: 99, downloadMbps: 3, uploadMbps: 2, latencyMs: 2, measurementSource: 'browser' } }, missing);
  assert.equal(missing.statusCode, 404);
});

test('history validates filters and passes supported filters to service', async () => {
  let filters;
  const c = createTestsController({ list: async (value) => { filters = value; return [{ id: 1 }]; } });
  const res = response();
  await c.list({ query: { locationId: '2', status: 'weak', limit: '10', offset: '20' } }, res);
  assert.equal(res.statusCode, 200);
  assert.deepEqual(filters, { locationId: 2, status: 'weak', limit: 10, offset: 20 });
  const invalid = response();
  await c.list({ query: { status: 'great' } }, invalid);
  assert.equal(invalid.statusCode, 400);
});

test('test IDs, error responses, unknown routes, persistence failure, and empty dashboard totals are handled', async () => {
  const c = createTestsController({ create: async () => { throw new Error('db secret'); }, list: async () => [], get: async () => null });
  const badId = response();
  await c.get({ params: { id: 'nope' } }, badId);
  assert.equal(badId.statusCode, 400);
  const missingId = response();
  await c.get({ params: { id: '999' } }, missingId);
  assert.equal(missingId.statusCode, 404);
  const unknown = response();
  notFound({}, unknown);
  assert.equal(unknown.statusCode, 404);
  const failed = response();
  errorHandler(new Error('db secret'), {}, failed, () => {});
  assert.equal(failed.statusCode, 500);
  assert.equal(JSON.stringify(failed.body).includes('db secret'), false);
  const summary = response();
  await createDashboardController({ summary: async () => ({ total_tests: 0, total_locations: 0, good_count: 0, fair_count: 0, weak_count: 0, average_download_mbps: 0 }) }).summary({}, summary);
  assert.deepEqual(summary.body.data, { totalTests: 0, totalLocations: 0, goodCount: 0, fairCount: 0, weakCount: 0, averageDownloadMbps: 0 });
});

test('failed persistence does not return a created result', async () => {
  const c = createTestsController({ create: async () => { throw new Error('database offline'); } });
  await assert.rejects(() => c.create({ body: { locationId: 1, downloadMbps: 1, uploadMbps: 1, latencyMs: 1, measurementSource: 'browser' } }, response()), /database offline/);
});

test('history repository uses parameterized filters and newest-first ordering', async () => {
  let statement;
  let values;
  await testsRepository.findAll({ locationId: 4, status: 'weak', limit: 10, offset: 20 }, {
    query: async (sql, params) => { statement = sql; values = params; return { rows: [] }; },
  });
  assert.deepEqual(values, [4, 'weak', 10, 20]);
  assert.match(statement, /nt\.location_id = \$1/);
  assert.match(statement, /nt\.status = \$2/);
  assert.match(statement, /ORDER BY nt\.created_at DESC/);
  assert.equal(statement.includes("status = 'weak'"), false);
});

test('unknown locations do not reach persistence and async failures reach error middleware', async () => {
  let persisted = false;
  const service = createNetworkTestService({ create: async () => { persisted = true; } }, { findById: async () => null });
  assert.equal(await service.create({ locationId: 404, downloadMbps: 2 }), null);
  assert.equal(persisted, false);
  let forwarded;
  asyncHandler(async () => { throw new Error('database offline'); })({}, {}, (error) => { forwarded = error; });
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(forwarded.message, 'database offline');
});
