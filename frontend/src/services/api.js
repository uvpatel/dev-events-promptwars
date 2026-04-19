/**
 * API Service - handles all backend API calls
 */
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    console.error('API Error:', message);
    return Promise.reject({ message, status: error.response?.status });
  }
);

// ─── Events ───────────────────────────────────────────────────
export const getEvents = () => api.get('/events');
export const getEvent = (id) => api.get(`/events/${id}`);
export const getAnnouncements = (eventId) => api.get(`/events/${eventId}/announcements`);

// ─── Sessions ─────────────────────────────────────────────────
export const getSessions = (params) => api.get('/sessions', { params });
export const getSession = (id) => api.get(`/sessions/${id}`);

// ─── Booths & Locations ───────────────────────────────────────
export const getBooths = (params) => api.get('/booths', { params });
export const getBooth = (id) => api.get(`/booths/${id}`);

// ─── Crowd ────────────────────────────────────────────────────
export const getCrowdDensity = () => api.get('/crowd/density');
export const getCrowdSummary = () => api.get('/crowd/summary');
export const getZoneDensity = (zoneId) => api.get(`/crowd/density/${zoneId}`);

// ─── Queue ────────────────────────────────────────────────────
export const getQueueTimes = (type) => api.get('/queue/times', { params: { type } });
export const getQueueTime = (locationId) => api.get(`/queue/times/${locationId}`);

// ─── Chat ─────────────────────────────────────────────────────
export const sendChatMessage = (message, history) =>
  api.post('/chat/message', { message, history });

// ─── Planner ──────────────────────────────────────────────────
export const getUserPlan = () => api.get('/planner');
export const saveToPlan = (type, itemId) => api.post('/planner/save', { type, itemId });
export const removeFromPlan = (type, itemId) => api.delete('/planner/remove', { data: { type, itemId } });

// ─── Admin ────────────────────────────────────────────────────
export const adminCreateEvent = (data) => api.post('/admin/events', data);
export const adminUpdateEvent = (id, data) => api.put(`/admin/events/${id}`, data);
export const adminCreateBooth = (data) => api.post('/admin/booths', data);
export const adminUpdateBooth = (id, data) => api.put(`/admin/booths/${id}`, data);
export const adminCreateSession = (data) => api.post('/admin/sessions', data);
export const adminUpdateCrowd = (zoneId, percentage) => api.put('/admin/crowd', { zoneId, percentage });

export default api;
