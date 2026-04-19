import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useEvent } from '../context/EventContext';
import { adminCreateEvent, adminUpdateCrowd, adminCreateSession } from '../services/api';
import { Shield, Plus, Save, Activity, LayoutDashboard, Users, AlertCircle } from 'lucide-react';

export default function Admin() {
  const { isAdmin, loading: authLoading } = useAuth();
  const { event, crowdData, refreshData } = useEvent();
  
  const [activeTab, setActiveTab] = useState('crowd');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  // Form states
  const [crowdLevels, setCrowdLevels] = useState({});
  const [newSession, setNewSession] = useState({
    title: '', stage: '', speaker: '', startTime: '', endTime: '', description: ''
  });

  useEffect(() => {
    if (crowdData?.length > 0) {
      const levels = {};
      crowdData.forEach(z => levels[z.id] = z.percentage);
      setCrowdLevels(levels);
    }
  }, [crowdData]);

  if (authLoading) {
    return <div className="page-container flex items-center justify-center"><div className="w-8 h-8 border-4 border-t-primary-500 rounded-full animate-spin" /></div>;
  }

  if (!isAdmin) {
    return (
      <div className="page-container flex items-center justify-center h-[80vh]">
        <div className="glass-card p-10 text-center max-w-md">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold font-display mb-2">Access Denied</h2>
          <p className="text-dark-400">You must be an administrator to view this page.</p>
        </div>
      </div>
    );
  }

  const handleCrowdUpdate = async (zoneId) => {
    try {
      setIsSubmitting(true);
      await adminUpdateCrowd(zoneId, parseInt(crowdLevels[zoneId], 10));
      setMessage('Crowd density updated successfully');
      refreshData();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error updating density');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSessionSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await adminCreateSession(newSession);
      setMessage('Session created successfully');
      setNewSession({ title: '', stage: '', speaker: '', startTime: '', endTime: '', description: '' });
      refreshData();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Error creating session');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display mb-2 flex items-center gap-3">
          <Shield className="w-8 h-8 text-primary-400" />
          Admin Control Center
        </h1>
        <p className="text-dark-400">Manage event data, sessions, and override crowd control metrics.</p>
      </div>

      {message && (
        <div className="mb-6 p-4 rounded-xl bg-primary-500/20 border border-primary-500/30 text-primary-100 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {message}
        </div>
      )}

      <div className="flex gap-4 mb-6 border-b border-white/[0.06] overflow-x-auto pb-2 scrollbar-hide">
        <button 
          onClick={() => setActiveTab('crowd')}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium transition-colors whitespace-nowrap ${
            activeTab === 'crowd' ? 'border-primary-500 text-primary-400' : 'border-transparent text-dark-400 hover:text-white'
          }`}
        >
          <Activity className="w-4 h-4" /> Crowd Simulation Override
        </button>
        <button 
          onClick={() => setActiveTab('sessions')}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium transition-colors whitespace-nowrap ${
            activeTab === 'sessions' ? 'border-primary-500 text-primary-400' : 'border-transparent text-dark-400 hover:text-white'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" /> Manage Sessions
        </button>
      </div>

      <div>
        {activeTab === 'crowd' && (
          <div className="glass-card p-6">
            <div className="mb-6">
               <h2 className="text-xl font-semibold mb-2">Zone Density Controls</h2>
               <p className="text-sm text-dark-400">Manually override the AI crowd simulator percentages (0-100%). Modifying these values will immediately update the frontend map and AI assistant context.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {crowdData?.map(zone => (
                <div key={zone.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-medium text-white">{zone.zoneName}</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                      zone.density === 'low' ? 'bg-green-500/20 text-green-400' :
                      zone.density === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {zone.density}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={crowdLevels[zone.id] || 0}
                      onChange={(e) => setCrowdLevels(prev => ({ ...prev, [zone.id]: e.target.value }))}
                      className="flex-1 accent-primary-500"
                    />
                    <span className="w-12 text-right font-mono text-sm">{crowdLevels[zone.id] || 0}%</span>
                    <button 
                      onClick={() => handleCrowdUpdate(zone.id)}
                      disabled={isSubmitting || crowdLevels[zone.id] == zone.percentage}
                      className="p-2 ml-2 rounded-lg bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Save className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'sessions' && (
          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold mb-6">Create New Session</h2>
            <form onSubmit={handleSessionSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-1">Session Title</label>
                  <input type="text" required value={newSession.title} onChange={e => setNewSession({...newSession, title: e.target.value})} className="input-dark py-2" placeholder="e.g. Intro to ML" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-1">Speaker Name</label>
                  <input type="text" value={newSession.speaker} onChange={e => setNewSession({...newSession, speaker: e.target.value})} className="input-dark py-2" placeholder="Jane Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-1">Stage/Location</label>
                  <input type="text" required value={newSession.stage} onChange={e => setNewSession({...newSession, stage: e.target.value})} className="input-dark py-2" placeholder="Main Stage" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-dark-300 mb-1">Start Time</label>
                    <input type="datetime-local" required value={newSession.startTime} onChange={e => setNewSession({...newSession, startTime: e.target.value})} className="input-dark py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-300 mb-1">End Time</label>
                    <input type="datetime-local" required value={newSession.endTime} onChange={e => setNewSession({...newSession, endTime: e.target.value})} className="input-dark py-2" />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-1">Description</label>
                <textarea rows={3} value={newSession.description} onChange={e => setNewSession({...newSession, description: e.target.value})} className="input-dark" placeholder="Session details..." />
              </div>
              <button type="submit" disabled={isSubmitting} className="btn-gradient w-full py-3">
                <Plus className="w-5 h-5" /> Add Session
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
