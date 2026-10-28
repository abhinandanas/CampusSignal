// backend/tests/health.test.js
const { describe, it, before, after } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const app = require('../src/app');
const database = require('../src/config/database');

describe('Health-Check API (GET /api/health)', () => {
  let server;
  let baseUrl;

  before(async () => {
    server = http.createServer(app);
    await new Promise((resolve) => server.listen(0, resolve));
    const port = server.address().port;
    baseUrl = `http://127.0.0.1:${port}`;
  });

  after(async () => {
    await new Promise((resolve) => server.close(resolve));
  });

  it('should return 200 OK and expected structure when API is healthy', async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    assert.equal(res.status, 200);

    const body = await res.json();
    assert.equal(body.status, 'success');
    assert.ok(body.data, 'Response should contain a data object');
    assert.equal(body.data.name, 'CampusSignal');
    assert.equal(body.data.service, 'CampusSignal API');
    assert.equal(body.data.api, 'healthy');
    assert.equal(typeof body.data.uptime, 'number');
    assert.equal(typeof body.data.timestamp, 'string');
    assert.ok(!isNaN(Date.parse(body.data.timestamp)), 'Timestamp must be a valid ISO date');
    assert.ok(['not_configured', 'connected'].includes(body.data.database), 'Database status must be reported');
  });

  it('should not leak database credentials, passwords, or secret info', async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    const rawText = await res.text();

    assert.equal(rawText.includes('password'), false, 'Response must not leak password fields');
    assert.equal(rawText.includes('DB_PASSWORD'), false, 'Response must not leak DB_PASSWORD');
    assert.equal(rawText.includes('postgres://'), false, 'Response must not leak connection string');
  });

  it('should return 503 and report degraded status when database connection fails', async () => {
    const originalCheck = database.checkConnection;
    // Simulate database disconnection
    database.checkConnection = async () => ({ connected: false, status: 'disconnected' });

    try {
      const res = await fetch(`${baseUrl}/api/health`);
      assert.equal(res.status, 503);

      const body = await res.json();
      assert.equal(body.status, 'error');
      assert.equal(body.message, 'Database service unavailable');
      assert.equal(body.data.name, 'CampusSignal');
      assert.equal(body.data.database, 'disconnected');
      assert.equal(body.data.api, 'healthy');
    } finally {
      // Restore original implementation
      database.checkConnection = originalCheck;
    }
  });

  it('should handle simulated database error exception safely', async () => {
    const originalCheck = database.checkConnection;
    // Simulate checkConnection throwing an unhandled exception
    database.checkConnection = async () => {
      const err = new Error('Database socket timed out');
      err.code = 'ETIMEDOUT';
      throw err;
    };

    try {
      const res = await fetch(`${baseUrl}/api/health`);
      // Should be caught by centralized error handler
      assert.equal(res.status, 503);

      const body = await res.json();
      assert.equal(body.status, 'error');
      assert.equal(body.message, 'Database service is temporarily unavailable');
    } finally {
      database.checkConnection = originalCheck;
    }
  });
});
