/**
 * Backend API Tests - Crowd Density
 */
const request = require('supertest');
const app = require('../src/app');

describe('Crowd Density API', () => {
  test('GET /api/crowd/density returns all zones', async () => {
    const res = await request(app).get('/api/crowd/density');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  test('Each zone has required fields', async () => {
    const res = await request(app).get('/api/crowd/density');
    const zone = res.body.data[0];
    expect(zone).toHaveProperty('id');
    expect(zone).toHaveProperty('zoneName');
    expect(zone).toHaveProperty('density');
    expect(zone).toHaveProperty('percentage');
    expect(zone).toHaveProperty('coordinates');
  });

  test('Density levels are valid values', async () => {
    const res = await request(app).get('/api/crowd/density');
    const validLevels = ['low', 'medium', 'high'];
    res.body.data.forEach((zone) => {
      expect(validLevels).toContain(zone.density);
      expect(zone.percentage).toBeGreaterThanOrEqual(0);
      expect(zone.percentage).toBeLessThanOrEqual(100);
    });
  });

  test('GET /api/crowd/summary returns stats', async () => {
    const res = await request(app).get('/api/crowd/summary');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('averageDensity');
    expect(res.body.data).toHaveProperty('totalZones');
    expect(res.body.data).toHaveProperty('highDensityZones');
    expect(res.body.data).toHaveProperty('mostCrowded');
    expect(res.body.data).toHaveProperty('leastCrowded');
  });

  test('GET /api/crowd/density/:zoneId returns specific zone', async () => {
    const res = await request(app).get('/api/crowd/density/zone-1');
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe('zone-1');
  });

  test('GET /api/crowd/density/invalid returns 404', async () => {
    const res = await request(app).get('/api/crowd/density/nonexistent');
    expect(res.status).toBe(404);
  });
});
