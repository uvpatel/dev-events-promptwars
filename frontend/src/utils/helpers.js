/**
 * Utility helpers and constants
 */

// Venue center coordinates (Ahmedabad Convention Centre)
export const VENUE_CENTER = { lat: 23.0300, lng: 72.5168 };

// Map marker icon configs
export const MARKER_ICONS = {
  stage: { emoji: '🎤', color: '#8b5cf6', label: 'Stage' },
  booth: { emoji: '🏪', color: '#06b6d4', label: 'Booth' },
  food_stall: { emoji: '🍔', color: '#f59e0b', label: 'Food' },
  washroom: { emoji: '🚻', color: '#64748b', label: 'Washroom' },
  entry_gate: { emoji: '🚪', color: '#22c55e', label: 'Gate' },
  exit: { emoji: '🚶', color: '#ef4444', label: 'Exit' },
};

// Crowd density colors
export const DENSITY_COLORS = {
  low: { bg: 'rgba(34, 197, 94, 0.25)', border: '#22c55e', text: '#4ade80' },
  medium: { bg: 'rgba(234, 179, 8, 0.25)', border: '#eab308', text: '#facc15' },
  high: { bg: 'rgba(239, 68, 68, 0.25)', border: '#ef4444', text: '#f87171' },
};

// Format time for display
export function formatTime(dateString) {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

// Format date for display
export function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

// Get density badge class
export function getDensityClass(density) {
  switch (density) {
    case 'low': return 'density-low';
    case 'medium': return 'density-medium';
    case 'high': return 'density-high';
    default: return '';
  }
}

// Get density label
export function getDensityLabel(density) {
  switch (density) {
    case 'low': return '🟢 Low';
    case 'medium': return '🟡 Medium';
    case 'high': return '🔴 High';
    default: return 'Unknown';
  }
}

// Get wait time color
export function getWaitTimeColor(minutes) {
  if (minutes <= 5) return 'text-green-400';
  if (minutes <= 15) return 'text-yellow-400';
  return 'text-red-400';
}

// Truncate text
export function truncate(text, maxLength = 100) {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

// Time until session starts
export function getTimeUntil(dateString) {
  const now = new Date();
  const target = new Date(dateString);
  const diff = target - now;

  if (diff < 0) return 'Started';
  if (diff < 60000) return 'Starting now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)} min`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ${Math.floor((diff % 3600000) / 60000)}m`;
  return `${Math.floor(diff / 86400000)} days`;
}

// Dark mode Google Maps style
export const DARK_MAP_STYLE = [
  { elementType: 'geometry', stylers: [{ color: '#1a1a2e' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0a0a0f' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#6b7280' }] },
  { featureType: 'administrative', elementType: 'geometry', stylers: [{ color: '#334155' }] },
  { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#1e293b' }] },
  { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#6b7280' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#1a2e1a' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#2a2a3e' }] },
  { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#94a3b8' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#3b3b5c' }] },
  { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#1e293b' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0c1222' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#475569' }] },
];
