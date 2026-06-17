import React, { useState, useEffect } from 'react';
import EapReferenceModal from '../components/EapReferenceModal';

import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import { HeartPulse, Plus, Search, Filter } from 'lucide-react';

export default function WellnessCoordinatorDashboard() {
  const { setApiError, setSuccessMsg, refreshTrigger, setRefreshTrigger } = useAuth();

  const [programs, setPrograms] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [challenges, setChallenges] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All');
  // New states for EAP workflow
  const [eapSessions, setEapSessions] = useState<any[]>([]);
  const [selectedSession, setSelectedSession] = useState<any | null>(null);
  const [showReferenceModal, setShowReferenceModal] = useState(false);

  const [newProgram, setNewProgram] = useState({
    name: '',
    theme: 'Fitness',
    startDate: '',
    endDate: '',
    pointsOnOffer: 500,
    targetParticipation: 80
  });

  const [newChallenge, setNewChallenge] = useState({
    programID: 0,
    challengeName: '',
    activityType: 'Steps',
    dailyTarget: 10000,
    duration: 7,
    pointsPerCompletion: 100
  });

  useEffect(() => {
    async function loadWellnessData() {
      try {
        const [progList, logList, challList, sessionList] = await Promise.all([
          api.getWellnessPrograms().catch(() => []),
          api.getAllActivityLogs().catch(() => []),
          api.getAllChallenges().catch(() => []),
          api.getAllSessions().catch(() => [])
        ]);
        setPrograms(progList);
        setLogs(logList);
        setChallenges(challList);
        setEapSessions(sessionList);

        if (progList.length > 0 && !newChallenge.programID) {
          setNewChallenge(prev => ({ ...prev, programID: progList[0].programID }));
        }
      } catch (err: any) {
        console.error('Failed to load wellness admin details:', err);
      }
    }
    loadWellnessData();
  }, [refreshTrigger]);

  const handleCreateProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    setSuccessMsg(null);

    try {
      await api.createWellnessProgram({
        name: newProgram.name,
        theme: newProgram.theme,
        startDate: new Date(newProgram.startDate).toISOString(),
        endDate: new Date(newProgram.endDate).toISOString(),
        pointsOnOffer: newProgram.pointsOnOffer,
        targetParticipation: newProgram.targetParticipation
      });

      setSuccessMsg(`Wellness Program "${newProgram.name}" created successfully!`);
      setNewProgram({
        name: '',
        theme: 'Fitness',
        startDate: '',
        endDate: '',
        pointsOnOffer: 500,
        targetParticipation: 80
      });
      setRefreshTrigger(prev => prev + 1);
    } catch (err: any) {
      setApiError(err.message || 'Failed to create program.');
    }
  };

  const handleCreateChallenge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChallenge.programID) {
      setApiError('Please select a program campaign.');
      return;
    }
    setApiError(null);
    setSuccessMsg(null);

    try {
      await api.createChallenge({
        ...newChallenge,
        status: 'Pending'
      });
      setSuccessMsg(`Challenge task "${newChallenge.challengeName}" configured! It is pending approval by the Finance Executive.`);
      setNewChallenge({
        programID: programs[0]?.programID || 0,
        challengeName: '',
        activityType: 'Steps',
        dailyTarget: 10000,
        duration: 7,
        pointsPerCompletion: 100
      });
      setRefreshTrigger(prev => prev + 1);
    } catch (err: any) {
      setApiError(err.message || 'Failed to create challenge.');
    }
  };

  const filteredLogs = logs.filter(l => {
    const matchesSearch = l.employeeName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      l.challengeName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'All' || l.activityType === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome banner */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl flex justify-between items-center">
        <div>
          <span className="text-[10px] uppercase bg-emerald-500 text-white font-extrabold px-3 py-1 rounded-full tracking-widest">Wellness Coordinator</span>
          <h2 className="text-2xl font-black mt-3">Campaigns & Fitness Challenges</h2>
          <p className="text-xs text-slate-300 font-semibold mt-1">Configure active health tasks, reward steps logs, and audit team participations.</p>
        </div>
        <HeartPulse className="text-emerald-500 w-12 h-12 shrink-0 hidden sm:block" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Creators */}
        <div className="lg:col-span-5 space-y-8">
      {/* New Section: Pending EAP Sessions */}
      <div className="groww-card p-6 bg-white mt-8">
        <h3 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2">
          <HeartPulse className="w-5 h-5 text-indigo-500" /> Pending EAP Sessions
        </h3>
        {eapSessions.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">No pending EAP sessions.</p>
        ) : (
          <div className="space-y-4 max-h-[300px] overflow-y-auto">
            {eapSessions.filter(s => s.status === 'Pending').map(s => (
              <div key={s.sessionID} className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex justify-between items-center">
                <div>
                  <p className="font-semibold text-slate-800">{s.serviceName}</p>
                  <p className="text-xs text-slate-500">Requested by: {s.employeeName}</p>
                </div>
                <button
                  className="px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-white text-xs rounded"
                  onClick={() => {
                    setSelectedSession(s);
                    setShowReferenceModal(true);
                  }}
                >
                  Assign Reference
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
          
          {/* Create Program */}
          <div className="groww-card p-6 bg-white">
            <h3 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-emerald-500" /> Create Wellness Campaign
            </h3>
            <form onSubmit={handleCreateProgram} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Campaign Name</label>
                <input 
                  type="text" 
                  required 
                  placeholder="Q3 Step Up Challenge"
                  value={newProgram.name}
                  onChange={(e) => setNewProgram({ ...newProgram, name: e.target.value })}
                  className="custom-input" 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Theme Category</label>
                  <select 
                    value={newProgram.theme}
                    onChange={(e) => setNewProgram({ ...newProgram, theme: e.target.value })}
                    className="custom-select"
                  >
                    <option value="Fitness">Fitness / Walking</option>
                    <option value="MentalWellbeing">Mental Calmness</option>
                    <option value="Hydration">Hydration & Nutrition</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Participation Goal (%)</label>
                  <input 
                    type="number" 
                    required 
                    value={newProgram.targetParticipation}
                    onChange={(e) => setNewProgram({ ...newProgram, targetParticipation: parseInt(e.target.value) })}
                    className="custom-input" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Start Date</label>
                  <input 
                    type="date" 
                    required 
                    value={newProgram.startDate}
                    onChange={(e) => setNewProgram({ ...newProgram, startDate: e.target.value })}
                    className="custom-input" 
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">End Date</label>
                  <input 
                    type="date" 
                    required 
                    value={newProgram.endDate}
                    onChange={(e) => setNewProgram({ ...newProgram, endDate: e.target.value })}
                    className="custom-input" 
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Points Cap On Offer</label>
                <input 
                  type="number" 
                  required 
                  value={newProgram.pointsOnOffer}
                  onChange={(e) => setNewProgram({ ...newProgram, pointsOnOffer: parseInt(e.target.value) })}
                  className="custom-input" 
                />
              </div>

              <button 
                type="submit"
                className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs transition cursor-pointer"
              >
                Launch Campaign
              </button>
            </form>
          </div>

          {/* Create Challenge */}
          <div className="groww-card p-6 bg-white">
            <h3 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-indigo-500" /> Configure Challenge Task
            </h3>
            <form onSubmit={handleCreateChallenge} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Campaign Association</label>
                <select 
                  value={newChallenge.programID} 
                  onChange={(e) => setNewChallenge({ ...newChallenge, programID: parseInt(e.target.value) })}
                  className="custom-select"
                >
                  {programs.map(p => (
                    <option key={p.programID} value={p.programID}>{p.name} ({p.status})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Task Title</label>
                <input 
                  type="text" 
                  required 
                  placeholder="Walk 10,000 steps daily"
                  value={newChallenge.challengeName}
                  onChange={(e) => setNewChallenge({ ...newChallenge, challengeName: e.target.value })}
                  className="custom-input" 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Activity Type</label>
                  <select 
                    value={newChallenge.activityType}
                    onChange={(e) => setNewChallenge({ ...newChallenge, activityType: e.target.value })}
                    className="custom-select"
                  >
                    <option value="Steps">Steps / Walking</option>
                    <option value="Water">Water Intake</option>
                    <option value="Sleep">Sleep Tracker</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Target Metrics</label>
                  <input 
                    type="number" 
                    required 
                    value={newChallenge.dailyTarget}
                    onChange={(e) => setNewChallenge({ ...newChallenge, dailyTarget: parseInt(e.target.value) })}
                    className="custom-input" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Duration Days</label>
                  <input 
                    type="number" 
                    required 
                    value={newChallenge.duration}
                    onChange={(e) => setNewChallenge({ ...newChallenge, duration: parseInt(e.target.value) })}
                    className="custom-input" 
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Reward Points</label>
                  <input 
                    type="number" 
                    required 
                    value={newChallenge.pointsPerCompletion}
                    onChange={(e) => setNewChallenge({ ...newChallenge, pointsPerCompletion: parseInt(e.target.value) })}
                    className="custom-input" 
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition cursor-pointer"
              >
                Schedule Challenge Task
              </button>
            </form>
          </div>

        </div>

        {/* Right Column: Global activity audit logs search */}
        <div className="lg:col-span-7 space-y-8">
            {/* EAP Reference Modal */}
            {showReferenceModal && selectedSession && (
              <EapReferenceModal
                session={selectedSession}
                onClose={() => setShowReferenceModal(false)}
                onSave={async (ref) => {
                  try {
                    await api.updateSessionStatus(selectedSession.sessionID, 'Approved', ref);
                    setSuccessMsg('Reference assigned and session approved.');
                    setRefreshTrigger(prev => prev + 1);
                  } catch (err: any) {
                    setApiError(err.message || 'Failed to assign reference.');
                  } finally {
                    setShowReferenceModal(false);
                  }
                }}
              />
            )}
          
          {/* Challenges Status Catalog */}
          <div className="groww-card p-6 bg-white">
            <h3 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2">
              <HeartPulse className="w-5 h-5 text-indigo-500" /> Challenge Tasks Catalog
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[300px] overflow-y-auto pr-1">
              {challenges.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center col-span-2">No challenge tasks configured yet.</p>
              ) : (
                challenges.map(ch => (
                  <div key={ch.challengeID} className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col justify-between hover:border-slate-300 transition-all duration-200">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-[9px] bg-slate-200 text-slate-600 font-extrabold px-2 py-0.5 rounded uppercase">{ch.activityType}</span>
                        <span className={`badge ${ch.status === 'Active' ? 'badge-active' : ch.status === 'Pending' ? 'badge-pending' : 'badge-error'}`}>
                          {ch.status === 'Pending' ? 'Pending Approval' : ch.status}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-700 text-sm mt-2">{ch.challengeName}</h4>
                      <p className="text-[10px] text-slate-400 font-medium mt-1">Daily Target: {ch.dailyTarget.toLocaleString()}</p>
                    </div>
                    <span className="text-[10px] text-emerald-500 font-extrabold mt-3 block text-right">+{ch.pointsPerCompletion} pts</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="groww-card p-6 bg-white">
            <h3 className="font-bold text-slate-800 text-lg mb-4">Employee Activity Log Audit</h3>
            
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="Search teammate or challenge name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="custom-input pl-9" 
                />
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Filter className="w-4 h-4 text-slate-400" />
                <select 
                  value={filterType} 
                  onChange={(e) => setFilterType(e.target.value)}
                  className="custom-select max-w-[150px]"
                >
                  <option value="All">All Categories</option>
                  <option value="Steps">Steps / Walking</option>
                  <option value="Water">Water Intake</option>
                  <option value="Sleep">Sleep Tracker</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-400 uppercase font-bold border-b border-slate-200">
                    <th className="p-3">Log ID</th>
                    <th className="p-3">Employee Name</th>
                    <th className="p-3">Challenge Details</th>
                    <th className="p-3">Logged Value</th>
                    <th className="p-3">Points Earned</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  {filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-6 text-center text-slate-400">No matching activities found on record.</td>
                    </tr>
                  ) : (
                    filteredLogs.map(log => (
                      <tr key={log.logID}>
                        <td className="p-3 font-bold text-slate-800">#{log.logID}</td>
                        <td className="p-3 font-semibold text-slate-700 capitalize">{log.employeeName}</td>
                        <td className="p-3">
                          <span className="font-semibold block">{log.challengeName}</span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{log.activityType}</span>
                        </td>
                        <td className="p-3 font-semibold text-slate-700">{log.activityValue.toLocaleString()}</td>
                        <td className="p-3 font-extrabold text-emerald-500">+{log.pointsEarned} pts</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
