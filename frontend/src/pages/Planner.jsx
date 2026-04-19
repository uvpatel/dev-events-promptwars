import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useEvent } from '../context/EventContext';
import { getUserPlan, saveToPlan, removeFromPlan } from '../services/api';
import { Calendar, BookmarkCheck, Heart, Clock, LogIn, Check, Trash2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatTime } from '../utils/helpers';

export default function Planner() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { sessions, booths, loading: eventLoading } = useEvent();
  const [plan, setPlan] = useState({ savedSessions: [], bookmarkedBooths: [] });
  const [loading, setLoading] = useState(true);

  // Fetch plan
  useEffect(() => {
    if (isAuthenticated) {
      getUserPlan()
        .then(res => setPlan(res.data))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const handleRemoveSession = async (id) => {
    try {
      await removeFromPlan('session', id);
      setPlan(prev => ({ ...prev, savedSessions: prev.savedSessions.filter(s => s !== id) }));
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemoveBooth = async (id) => {
    try {
      await removeFromPlan('booth', id);
      setPlan(prev => ({ ...prev, bookmarkedBooths: prev.bookmarkedBooths.filter(b => b !== id) }));
    } catch (error) {
      console.error(error);
    }
  };

  if (authLoading || eventLoading || loading) {
    return (
      <div className="page-container flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="page-container flex items-center justify-center min-h-[80vh]">
        <div className="glass-card p-10 text-center max-w-md w-full">
          <Calendar className="w-16 h-16 text-primary-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold font-display mb-3">Sync Your Plan</h2>
          <p className="text-dark-400 mb-8 leading-relaxed">Sign in to save sessions to your agenda, bookmark interesting booths, and get personalized event reminders.</p>
          <Link to="/login" className="btn-gradient w-full justify-center py-3">
            <LogIn className="w-5 h-5" />
            Sign In to Access Planner
          </Link>
        </div>
      </div>
    );
  }

  // Filter full objects from IDs
  const mySessions = sessions
    .filter(s => plan.savedSessions.includes(s.id))
    .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
    
  const myBooths = booths.filter(b => plan.bookmarkedBooths.includes(b.id));

  return (
    <div className="page-container">
      <div className="mb-10">
        <h1 className="text-3xl font-bold font-display mb-2 gradient-text">My Planner</h1>
        <p className="text-dark-400">Your personalized schedule and bookmarked locations.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Schedule Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-primary-400" />
            <h2 className="text-xl font-semibold text-white">My Schedule</h2>
          </div>

          <div className="glass-card p-6 min-h-[400px]">
            {mySessions.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <div className="w-16 h-16 rounded-full bg-white/[0.05] flex items-center justify-center mb-4">
                  <Calendar className="w-6 h-6 text-dark-500" />
                </div>
                <p className="text-dark-300 font-medium mb-1">Your schedule is empty</p>
                <p className="text-dark-500 text-sm mb-6">Ask the AI assistant to recommend some sessions.</p>
              </div>
            ) : (
              <div className="relative pl-6 space-y-8 before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-primary-500/20 before:to-primary-500/0">
                {mySessions.map((session, index) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    key={session.id} 
                    className="relative"
                  >
                    <div className="absolute left-[-30px] w-3 h-3 bg-primary-500 rounded-full border-4 border-[#0f172a] shadow-[0_0_10px_rgba(139,92,246,0.6)]" />
                    
                    <div className="bg-white/[0.03] border border-white/[0.05] rounded-xl p-5 hover:bg-white/[0.05] transition-colors group">
                      <div className="flex flex-wrap justify-between items-start gap-4 mb-3">
                        <div>
                          <p className="text-sm text-primary-400 font-medium mb-1 flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
                            {formatTime(session.startTime)} - {formatTime(session.endTime)}
                          </p>
                          <h3 className="text-lg font-semibold text-white group-hover:text-primary-300 transition-colors">{session.title}</h3>
                        </div>
                        <button 
                          onClick={() => handleRemoveSession(session.id)}
                          className="p-2 text-dark-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Remove from schedule"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        {session.tags?.map(tag => (
                          <span key={tag} className="px-2 py-0.5 rounded text-xs bg-white/[0.05] border border-white/[0.1] text-dark-300">
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <div className="text-sm text-dark-400 flex items-center gap-4 border-t border-white/[0.05] pt-3 mt-3">
                        <span className="flex items-center gap-1.5">
                          <strong className="text-dark-200">Stage:</strong> {session.stage}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <strong className="text-dark-200">Speaker:</strong> {session.speaker}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bookmarked Booths */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <BookmarkCheck className="w-5 h-5 text-accent-400" />
            <h2 className="text-xl font-semibold text-white">Saved Locations</h2>
          </div>

          <div className="glass-card p-6">
             {myBooths.length === 0 ? (
               <div className="text-center py-8">
                 <p className="text-dark-400 text-sm mb-4">No locations saved yet.</p>
                 <Link to="/map" className="text-accent-400 text-sm font-medium hover:text-accent-300 inline-flex items-center gap-1">
                   Explore Map <ArrowRight className="w-4 h-4" />
                 </Link>
               </div>
             ) : (
               <div className="space-y-4">
                 {myBooths.map(booth => (
                   <div key={booth.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] flex gap-4">
                     <div className="w-10 h-10 rounded-lg bg-accent-500/20 text-accent-400 flex items-center justify-center shrink-0">
                       <span className="text-xl">{booth.icon || '📍'}</span>
                     </div>
                     <div className="flex-1">
                       <div className="flex justify-between items-start">
                         <h3 className="font-medium text-white text-sm mb-1">{booth.name}</h3>
                         <button 
                           onClick={() => handleRemoveBooth(booth.id)}
                           className="text-dark-500 hover:text-red-400"
                         >
                           <X className="w-4 h-4" />
                         </button>
                       </div>
                       <p className="text-xs text-dark-400 line-clamp-2 mb-2">{booth.description}</p>
                       <Link to="/map" className="text-xs text-accent-400 hover:text-accent-300 font-medium">Show on map</Link>
                     </div>
                   </div>
                 ))}
               </div>
             )}
          </div>

          {/* Tips Card */}
          <div className="glass-card p-6 bg-gradient-to-br from-primary-900/40 to-transparent border-primary-500/20">
            <h3 className="font-semibold text-primary-300 mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Pro Tip
            </h3>
            <p className="text-sm text-dark-300 leading-relaxed">
              Ask the EventFlow AI Assistant to automatically save relevant sessions and locations to your planner during your conversation!
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

// Ensure Sparkles component is imported
import { Sparkles, X } from 'lucide-react';
