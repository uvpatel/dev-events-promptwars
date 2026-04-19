/**
 * Event Context - provides event data throughout the app
 */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getEvents, getSessions, getBooths, getCrowdDensity, getCrowdSummary, getQueueTimes, getAnnouncements } from '../services/api';

const EventContext = createContext(null);

export function EventProvider({ children }) {
  const [event, setEvent] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [booths, setBooths] = useState([]);
  const [crowdData, setCrowdData] = useState([]);
  const [crowdSummary, setCrowdSummary] = useState(null);
  const [queueTimes, setQueueTimes] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all initial data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [eventsRes, sessionsRes, boothsRes, crowdRes, summaryRes, queueRes] = await Promise.all([
        getEvents(),
        getSessions(),
        getBooths(),
        getCrowdDensity(),
        getCrowdSummary(),
        getQueueTimes(),
      ]);

      const mainEvent = eventsRes.data[0];
      setEvent(mainEvent);
      setSessions(sessionsRes.data);
      setBooths(boothsRes.data);
      setCrowdData(crowdRes.data);
      setCrowdSummary(summaryRes.data);
      setQueueTimes(queueRes.data);

      // Fetch announcements for main event
      if (mainEvent) {
        const annRes = await getAnnouncements(mainEvent.id);
        setAnnouncements(annRes.data);
      }

      setError(null);
    } catch (err) {
      console.error('Failed to fetch event data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Poll crowd data every 15 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const [crowdRes, summaryRes, queueRes] = await Promise.all([
          getCrowdDensity(),
          getCrowdSummary(),
          getQueueTimes(),
        ]);
        setCrowdData(crowdRes.data);
        setCrowdSummary(summaryRes.data);
        setQueueTimes(queueRes.data);
      } catch (err) {
        // Silent fail for polling
      }
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const refreshData = useCallback(() => fetchData(), [fetchData]);

  const value = {
    event,
    sessions,
    booths,
    crowdData,
    crowdSummary,
    queueTimes,
    announcements,
    loading,
    error,
    refreshData,
  };

  return (
    <EventContext.Provider value={value}>
      {children}
    </EventContext.Provider>
  );
}

export function useEvent() {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvent must be used within an EventProvider');
  }
  return context;
}

export default EventContext;
