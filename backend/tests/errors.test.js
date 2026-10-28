// backend/tests/errors.test.js
const { describe, it, before, after } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const express = require('express');
const app = require('../src/app');
const env = require('../src/config/env');
const notFound = require('../src/middleware/notFound');
const errorHandler = require('../src/middleware/errorHandler');

describe('Centralized Error Handling & 404 Not Found', () => {
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

  it('should return 404 with standard error envelope for non-existent GET route', async () => {
    const res = await fetch(`${baseUrl}/api/non-existent-endpoint`);
    assert.equal(res.status, 404);

    const body = await res.json();
    assert.equal(body.status, 'error');
    assert.equal(body.error.status, 404);
    assert.ok(body.error.message.includes('Resource not found: GET /api/non-existent-endpoint'));
    assert.equal(body.message, body.error.message);
  });

  it('should return 404 for non-existent POST route', async () => {
    const res = await fetch(`${baseUrl}/api/unknown-post`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ test: 123 })
    });
    assert.equal(res.status, 404);

    const body = await res.json();
    assert.equal(body.status, 'error');
    assert.equal(body.error.status, 404);
    assert.ok(body.error.message.includes('Resource not found: POST /api/unknown-post'));
  });

  it('should return 400 when invalid/malformed JSON is submitted in request body', async () => {
    const res = await fetch(`${baseUrl}/api/tests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{"invalidJson": unquoted_value, '
    });
    assert.equal(res.status, 400);

    const body = await res.json();
    assert.equal(body.status, 'error');
    assert.equal(body.error.status, 400);
    assert.ok(body.message.includes('Invalid JSON payload'));
  });

  it('should catch unhandled runtime errors in central error middleware and return 500', async () => {
    // Spin up a small isolated Express app using our central error handler
    const testApp = express();
    testApp.use(express.json());
    testApp.get('/test-error', (req, res, next) => {
      next(new Error('Simulated runtime error'));
    });
    testApp.use(notFound);
    testApp.use(errorHandler);

    const testServer = http.createServer(testApp);
    await new Promise((resolve) => testServer.listen(0, resolve));
    const testPort = testServer.address().port;

    try {
      const res = await fetch(`http://127.0.0.1:${testPort}/test-error`);
      assert.equal(res.status, 500);

      const body = await res.json();
      assert.equal(body.status, 'error');
      assert.equal(body.error.status, 500);
      assert.ok(body.message);
    } finally {
      await new Promise((resolve) => testServer.close(resolve));
    }
  });

  it('should never expose stack traces or internal details when NODE_ENV is production', async () => {
    const originalEnv = env.NODE_ENV;
    env.NODE_ENV = 'production';

    const testApp = express();
    testApp.get('/test-prod-error', (req, res, next) => {
      const sensitiveErr = new Error('Sensitive internal database query syntax error at line 42');
      sensitiveErr.details = { table: 'secret_users', column: 'secret_hash' };
      next(sensitiveErr);
    });
    testApp.use(errorHandler);

    const testServer = http.createServer(testApp);
    await new Promise((resolve) => testServer.listen(0, resolve));
    const testPort = testServer.address().port;

    try {
      const res = await fetch(`http://127.0.0.1:${testPort}/test-prod-error`);
      assert.equal(res.status, 500);

      const body = await res.json();
      assert.equal(body.status, 'error');
      assert.equal(body.message, 'Internal server error');
      assert.equal(body.details, null, 'Details must be null in production');

      const rawText = await res.text();
      assert.equal(rawText.includes('secret_users'), false, 'Must not leak database table names');
      assert.equal(rawText.includes('stack'), false, 'Must not leak stack traces in production');
    } finally {
      env.NODE_ENV = originalEnv;
      await new Promise((resolve) => testServer.close(resolve));
    }
  });

  it('should handle database connection failure (ECONNREFUSED) with HTTP 503', async () => {
    const testApp = express();
    testApp.get('/test-db-error', (req, res, next) => {
      const dbErr = new Error('connect ECONNREFUSED 127.0.0.1:5432');
      dbErr.code = 'ECONNREFUSED';
      next(dbErr);
    });
    testApp.use(errorHandler);

    const testServer = http.createServer(testApp);
    await new Promise((resolve) => testServer.listen(0, resolve));
    const testPort = testServer.address().port;

    try {
      const res = await fetch(`http://127.0.0.1:${testPort}/test-db-error`);
      assert.equal(res.status, 503);

      const body = await res.json();
      assert.equal(body.status, 'error');
      assert.equal(body.error.status, 503);
      assert.equal(body.message, 'Database service is temporarily unavailable');

      const rawText = await res.text();
      assert.equal(rawText.includes('127.0.0.1:5432'), false, 'Must not leak IP or port in error response');
    } finally {
      await new Promise((resolve) => testServer.close(resolve));
    }
  });
});
