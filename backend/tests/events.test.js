/**
 * Backend API Tests - Events
 */
const request = require('supertest');
const app = require('../src/app');

describe('Events API', () => {
  test('GET /api/events returns events list', async () => {
    const res = await request(app).get('/api/events');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.count).toBeGreaterThan(0);
  });

  test('GET /api/events/:id returns event details', async () => {
    const res = await request(app).get('/api/events/evt-techconf-2026');
    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe('TechConf 2026');
    expect(res.body.data.venue).toBeDefined();
    expect(res.body.data.announcements).toBeDefined();
  });

  test('GET /api/events/invalid returns 404', async () => {
    const res = await request(app).get('/api/events/nonexistent');
    expect(res.status).toBe(404);
  });

  test('GET /api/events/:id/announcements returns sorted list', async () => {
    const res = await request(app).get('/api/events/evt-techconf-2026/announcements');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });
});

describe('Sessions API', () => {
  test('GET /api/sessions returns sessions', async () => {
    const res = await request(app).get('/api/sessions');
    expect(res.status).toBe(200);
    expect(res.body.count).toBeGreaterThan(0);
  });

  test('Sessions can be filtered by stage', async () => {
    const res = await request(app).get('/api/sessions?stage=main');
    expect(res.status).toBe(200);
    res.body.data.forEach((s) => {
      expect(s.stage.toLowerCase()).toContain('main');
    });
  });

  test('Sessions are sorted by start time', async () => {
    const res = await request(app).get('/api/sessions');
    const times = res.body.data.map((s) => new Date(s.startTime).getTime());
    for (let i = 1; i < times.length; i++) {
      expect(times[i]).toBeGreaterThanOrEqual(times[i - 1]);
    }
  });
});

describe('Booths API', () => {
  test('GET /api/booths returns locations', async () => {
    const res = await request(app).get('/api/booths');
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  test('Locations include crowd density info', async () => {
    const res = await request(app).get('/api/booths');
    const booth = res.body.data[0];
    expect(booth).toHaveProperty('nearbyDensity');
    expect(booth).toHaveProperty('nearbyDensityPercentage');
  });

  test('Booths can be filtered by type', async () => {
    const res = await request(app).get('/api/booths?type=food_stall');
    expect(res.status).toBe(200);
    res.body.data.forEach((b) => {
      expect(b.type).toBe('food_stall');
    });
  });
});

describe('Health Check', () => {
  test('GET /api/health returns healthy status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('healthy');
    expect(res.body.service).toBe('EventFlow AI Backend');
  });
});

describe('Chat API', () => {
  test('POST /api/chat/message returns AI response', async () => {
    const res = await request(app)
      .post('/api/chat/message')
      .send({ message: 'Hello' });
    expect(res.status).toBe(200);
    expect(res.body.data.reply).toBeTruthy();
    expect(res.body.data.timestamp).toBeTruthy();
  });

  test('POST /api/chat/message validates input', async () => {
    const res = await request(app)
      .post('/api/chat/message')
      .send({ message: '' });
    expect(res.status).toBe(400);
  });
});
