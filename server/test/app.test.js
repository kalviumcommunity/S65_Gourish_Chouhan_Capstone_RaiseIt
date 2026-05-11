const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const app = require('../server');

test('health endpoint responds', async () => {
  const res = await request(app).get('/');
  assert.equal(res.status, 200);
  assert.equal(res.text, 'API is running...');
});

test('unknown routes return json 404', async () => {
  const res = await request(app).get('/missing-route');
  assert.equal(res.status, 404);
  assert.equal(res.body.message, 'Route not found');
});
