import test from 'node:test';
import assert from 'node:assert/strict';
import { createLocationsController } from '../src/controllers/locations.controller.js';
import { createLocationsService } from '../src/services/locations.service.js';
import * as locationsRepository from '../src/repositories/locations.repository.js';

const VALID_LOCATION_ID = '550e8400-e29b-41d4-a716-446655440000';

function createMockResponse() {
  return {
    statusCode: 200,
    body: undefined,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };
}

test('locations controller returns success envelope with items', async () => {
  const res = createMockResponse();
  const mockService = {
    list: async () => [
      { id: VALID_LOCATION_ID, buildingName: 'Engineering Block', floor: 2, zoneName: 'ISE Lab' },
    ],
  };
  const controller = createLocationsController(mockService);

  await controller.list({}, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.success, true);
  assert.equal(res.body.status, 'success');
  assert.equal(res.body.count, 1);
  assert.equal(res.body.data[0].buildingName, 'Engineering Block');
});

test('locations controller passes building, floor, and search query filters to service', async () => {
  let capturedFilters;
  const mockService = {
    list: async (filters) => {
      capturedFilters = filters;
      return [];
    },
  };
  const controller = createLocationsController(mockService);
  const res = createMockResponse();

  await controller.list({ query: { building: 'Engineering Block', floor: '3', search: 'Lab' } }, res);

  assert.equal(res.statusCode, 200);
  assert.deepEqual(capturedFilters, {
    building: 'Engineering Block',
    floor: '3',
    search: 'Lab',
  });
});

test('locations controller rejects non-integer floor with 400 Bad Request', async () => {
  const controller = createLocationsController();
  const res = createMockResponse();

  await controller.list({ query: { floor: 'not-a-floor' } }, res);

  assert.equal(res.statusCode, 400);
  assert.equal(res.body.success, false);
  assert.equal(res.body.status, 'error');
  assert.match(res.body.details[0], /floor must be a valid integer/);
});

test('locations controller get handles valid UUID and unknown ID', async () => {
  const mockService = {
    get: async (id) => (id === VALID_LOCATION_ID ? { id, buildingName: 'Library' } : null),
  };
  const controller = createLocationsController(mockService);

  // Valid ID exists
  const okRes = createMockResponse();
  await controller.get({ params: { id: VALID_LOCATION_ID } }, okRes);
  assert.equal(okRes.statusCode, 200);
  assert.equal(okRes.body.success, true);
  assert.equal(okRes.body.data.buildingName, 'Library');

  // Valid UUID format but not found
  const notFoundRes = createMockResponse();
  await controller.get({ params: { id: '11111111-2222-4333-8444-555555555555' } }, notFoundRes);
  assert.equal(notFoundRes.statusCode, 404);
  assert.equal(notFoundRes.body.success, false);

  // Malformed ID
  const badRes = createMockResponse();
  await controller.get({ params: { id: 'invalid-uuid-string' } }, badRes);
  assert.equal(badRes.statusCode, 400);
  assert.equal(badRes.body.success, false);
});

test('locations service sanitizes and validates filters', async () => {
  let repoFilters;
  const mockRepo = {
    findAll: async (filters) => {
      repoFilters = filters;
      return [];
    },
  };
  const service = createLocationsService(mockRepo);

  await service.list({
    building: '  Science Centre  ',
    floor: ' 1 ',
    search: '  Seminar  ',
  });

  assert.deepEqual(repoFilters, {
    building: 'Science Centre',
    floor: 1,
    search: 'Seminar',
  });
});

test('locations repository generates parameterized queries avoiding SQL injection', async () => {
  let executedSql;
  let executedParams;
  const mockQuery = {
    query: async (sql, params) => {
      executedSql = sql;
      executedParams = params;
      return { rows: [] };
    },
  };

  await locationsRepository.findAll(
    { building: "Engineering'; DROP TABLE locations;--", floor: 2, search: "Lab' OR '1'='1" },
    mockQuery,
  );

  // Assert inputs are placed inside parameterized values array, not concatenated into SQL
  assert.equal(executedParams[0], "Engineering'; DROP TABLE locations;--");
  assert.equal(executedParams[1], 2);
  assert.equal(executedParams[2], "%Lab' OR '1'='1%");

  assert.match(executedSql, /LOWER\(l\.building_name\) = LOWER\(\$1\)/);
  assert.match(executedSql, /l\.floor = \$2/);
  assert.match(executedSql, /ILIKE \$3/);
  assert.equal(executedSql.includes('DROP TABLE'), false);
});
