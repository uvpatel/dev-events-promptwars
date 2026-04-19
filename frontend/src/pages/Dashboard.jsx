import { motion } from 'framer-motion';
import { useEvent } from '../context/EventContext';
import { Users, Activity, Coffee, Mic, Clock, Bell, ArrowRight, Zap, Navigation } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatTime, getDensityClass, getDensityLabel, getWaitTimeColor } from '../utils/helpers';

export default function Dashboard() {
  const { event, sessions, crowdSummary, queueTimes, announcements, loading } = useEvent();

  if (loading || !event) {
    return (
      <div className="page-container flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  // Get active/upcoming sessions
  const now = new Date();
  const upcomingSessions = [...sessions]
    .filter((s) => new Date(s.endTime) > now)
    .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
    .slice(0, 3);

  // Get shortest queues
  const shortestQueues = [...queueTimes]
    .sort((a, b) => a.currentWaitMinutes - b.currentWaitMinutes)
    .slice(0, 3);

  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display mb-2">
          Welcome to <span className="gradient-text">{event.name}</span>
        </h1>
        <p className="text-dark-400">Here's your live event overview and smart recommendations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Crowd Status Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-secondary flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-dark-100">Live Crowd Status</h2>
              <p className="text-sm text-dark-400">Venue average</p>
            </div>
          </div>
          
          <div className="flex items-end gap-3 mb-6">
            <div className="text-4xl font-bold font-display">
              {crowdSummary?.averageDensity || 0}%
            </div>
            <div className={`px-2.5 py-1 rounded-full text-xs font-semibold mb-1 ${
              (crowdSummary?.averageDensity || 0) < 50 ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 
              (crowdSummary?.averageDensity || 0) < 80 ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : 
              'bg-red-500/20 text-red-400 border border-red-500/30'
            }`}>
              { (crowdSummary?.averageDensity || 0) < 50 ? 'Low' : (crowdSummary?.averageDensity || 0) < 80 ? 'Medium' : 'High' } Crowd
            </div>
          </div>
          
          <div className="space-y-3 mt-4 pt-4 border-t border-white/[0.06]">
            <div className="flex justify-between items-center text-sm">
              <span className="text-dark-400">Least Crowded:</span>
              <span className="text-green-400 font-medium">{crowdSummary?.leastCrowded?.zoneName}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-dark-400">Most Crowded:</span>
              <span className="text-red-400 font-medium">{crowdSummary?.mostCrowded?.zoneName}</span>
            </div>
          </div>
          
          <Link to="/map" className="mt-6 flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-sm text-dark-200 transition-colors">
            <Navigation className="w-4 h-4" />
            View Map
          </Link>
        </motion.div>

        {/* Shortest Queues */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-warm flex items-center justify-center">
                <Coffee className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-lg font-semibold text-dark-100">Live Queues</h2>
            </div>
          </div>

          <div className="space-y-4">
            {shortestQueues.length > 0 ? (
              shortestQueues.map((q) => (
                <div key={q.id} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                  <div>
                    <h3 className="font-medium text-dark-100 text-sm">{q.name}</h3>
                    <p className="text-xs text-dark-400">{q.queueLength} people</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold bg-white/[0.05] border border-white/[0.05] ${getWaitTimeColor(q.currentWaitMinutes)}`}>
                    {q.currentWaitMinutes} min
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-dark-400 text-center py-4">No queue data available.</p>
            )}
          </div>
        </motion.div>

        {/* Announcements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 flex flex-col"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
              <Bell className="w-5 h-5 text-blue-400" />
            </div>
            <h2 className="text-lg font-semibold text-dark-100">Live Updates</h2>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            {announcements.length > 0 ? (
              announcements.slice(0, 4).map((ann, i) => (
                <div key={ann.id || i} className="flex gap-3 relative pl-4 border-l border-white/[0.1] pb-2">
                  <div className={`absolute left-[-5px] top-1 w-2 h-2 rounded-full ${
                    ann.priority === 'high' ? 'bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.6)]' :
                    ann.priority === 'medium' ? 'bg-yellow-400' : 'bg-blue-400'
                  }`} />
                  <div>
                    <p className="text-sm text-dark-200 line-clamp-2">{ann.text}</p>
                    <p className="text-xs text-dark-500 mt-1">{formatTime(ann.timestamp)}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-dark-400 text-center py-4">No announcements yet.</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Upcoming Sessions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
            <Clock className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-semibold font-display text-dark-100">Up Next</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {upcomingSessions.length > 0 ? (
            upcomingSessions.map((session) => (
              <div key={session.id} className="glass-card group p-6 border-l-4 border-l-primary-500">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-primary-400 text-sm font-semibold tracking-wider uppercase flex items-center gap-1.5">
                    <Mic className="w-4 h-4" />
                    {session.stage}
                  </span>
                  <span className="text-xs text-dark-400 bg-white/[0.05] px-2 py-1 rounded-md border border-white/[0.05]">
                    {formatTime(session.startTime)}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-dark-100 mb-2 line-clamp-2">{session.title}</h3>
                <p className="text-sm text-dark-400 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  {session.speaker || 'TBA'}
                </p>
              </div>
            ))
          ) : (
            <p className="text-dark-400">No upcoming sessions.</p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
