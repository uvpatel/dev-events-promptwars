/**
 * Backend API Tests - Queue Times
 */
const request = require('supertest');
const app = require('../src/app');

describe('Queue Times API', () => {
  test('GET /api/queue/times returns all queues', async () => {
    const res = await request(app).get('/api/queue/times');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  test('Queue entries have required fields', async () => {
    const res = await request(app).get('/api/queue/times');
    const queue = res.body.data[0];
    expect(queue).toHaveProperty('id');
    expect(queue).toHaveProperty('name');
    expect(queue).toHaveProperty('currentWaitMinutes');
    expect(queue).toHaveProperty('queueLength');
    expect(queue).toHaveProperty('status');
  });

  test('Wait times are positive numbers', async () => {
    const res = await request(app).get('/api/queue/times');
    res.body.data.forEach((queue) => {
      expect(queue.currentWaitMinutes).toBeGreaterThan(0);
      expect(queue.queueLength).toBeGreaterThan(0);
    });
  });

  test('Filter by food type', async () => {
    const res = await request(app).get('/api/queue/times?type=food');
    expect(res.status).toBe(200);
    res.body.data.forEach((q) => {
      expect(q.locationId).toMatch(/^loc-food/);
    });
  });

  test('Filter by washroom type', async () => {
    const res = await request(app).get('/api/queue/times?type=washroom');
    expect(res.status).toBe(200);
    res.body.data.forEach((q) => {
      expect(q.locationId).toMatch(/^loc-wash/);
    });
  });

  test('Results are sorted by wait time ascending', async () => {
    const res = await request(app).get('/api/queue/times');
    const times = res.body.data.map((q) => q.currentWaitMinutes);
    for (let i = 1; i < times.length; i++) {
      expect(times[i]).toBeGreaterThanOrEqual(times[i - 1]);
    }
  });

  test('Provides recommendation for shortest queue', async () => {
    const res = await request(app).get('/api/queue/times');
    expect(res.body.recommendation).toBeTruthy();
    expect(res.body.recommendation).toContain('Shortest wait');
  });
});
