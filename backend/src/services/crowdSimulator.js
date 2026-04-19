/**
 * Crowd Density Simulator
 * Generates realistic crowd density data that fluctuates over time
 */
const { crowdZones } = require('../data/seedData');

// Store current state for persistence between calls
let currentZones = JSON.parse(JSON.stringify(crowdZones));
let lastUpdate = Date.now();

/**
 * Calculate density level from percentage
 */
function getDensityLevel(percentage) {
  if (percentage >= 70) return 'high';
  if (percentage >= 40) return 'medium';
  return 'low';
}

/**
 * Simulate crowd movement - called periodically to update density
 * Uses sine wave + random noise for realistic patterns
 */
function simulateCrowdMovement() {
  const now = Date.now();
  const elapsed = (now - lastUpdate) / 1000; // seconds since last update

  currentZones = currentZones.map((zone) => {
    // Base oscillation using sine wave (period ~5 minutes for demo speed)
    const time = now / 1000;
    const sineComponent = Math.sin(time / 150 + zone.id.charCodeAt(zone.id.length - 1)) * 15;

    // Random noise (±5%)
    const noise = (Math.random() - 0.5) * 10;

    // Calculate new percentage
    let newPercentage = zone.percentage + sineComponent * 0.1 + noise * 0.3;

    // Clamp between 5 and 95
    newPercentage = Math.max(5, Math.min(95, newPercentage));

    // Round to nearest integer
    newPercentage = Math.round(newPercentage);

    return {
      ...zone,
      percentage: newPercentage,
      density: getDensityLevel(newPercentage),
      lastUpdated: new Date().toISOString(),
    };
  });

  lastUpdate = now;
  return currentZones;
}

/**
 * Get current crowd density data
 */
function getCrowdDensity() {
  return simulateCrowdMovement();
}

/**
 * Get density for a specific zone
 */
function getZoneDensity(zoneId) {
  const zones = getCrowdDensity();
  return zones.find((z) => z.id === zoneId) || null;
}

/**
 * Manually update a zone's density (admin)
 */
function updateZoneDensity(zoneId, percentage) {
  const zone = currentZones.find((z) => z.id === zoneId);
  if (!zone) return null;

  zone.percentage = Math.max(0, Math.min(100, percentage));
  zone.density = getDensityLevel(zone.percentage);
  zone.lastUpdated = new Date().toISOString();

  return zone;
}

/**
 * Get crowd summary stats
 */
function getCrowdSummary() {
  const zones = getCrowdDensity();
  const avgDensity = zones.reduce((sum, z) => sum + z.percentage, 0) / zones.length;

  return {
    averageDensity: Math.round(avgDensity),
    totalZones: zones.length,
    highDensityZones: zones.filter((z) => z.density === 'high').length,
    mediumDensityZones: zones.filter((z) => z.density === 'medium').length,
    lowDensityZones: zones.filter((z) => z.density === 'low').length,
    mostCrowded: zones.reduce((max, z) => (z.percentage > max.percentage ? z : max), zones[0]),
    leastCrowded: zones.reduce((min, z) => (z.percentage < min.percentage ? z : min), zones[0]),
  };
}

module.exports = {
  getCrowdDensity,
  getZoneDensity,
  updateZoneDensity,
  getCrowdSummary,
  getDensityLevel,
};
