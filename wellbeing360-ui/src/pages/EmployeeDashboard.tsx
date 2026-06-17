import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import type { User } from '../context/AuthContext';
import { api } from '../api';
import { LineChart, DonutChart, BarChart } from '../components/CustomChart';
import Dialog from '../components/Dialog';
import { 
  Heart, Calendar, Activity, Trophy, Gift, Plus, Trash2, HeartPulse, 
  MessageSquare, UserPlus, Award, ShoppingBag, Eye, Send, Sparkles, MessageCircle, X
} from 'lucide-react';

export default function EmployeeDashboard() {
  const { currentUser, setApiError, setSuccessMsg, refreshTrigger, setRefreshTrigger } = useAuth();

  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Shared states
  const [plans, setPlans] = useState<any[]>([]);
  const [myEnrolments, setMyEnrolments] = useState<any[]>([]);
  const [currentWindow, setCurrentWindow] = useState<any | null>(null);
  const [myDependents, setMyDependents] = useState<any[]>([]);
  const [wellnessPrograms, setWellnessPrograms] = useState<any[]>([]);
  const [challenges, setChallenges] = useState<any[]>([]);
  const [myActivityLogs, setMyActivityLogs] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [eapServices, setEapServices] = useState<any[]>([]);
  const [mySessions, setMySessions] = useState<any[]>([]);
  const [pointsBalance, setPointsBalance] = useState<any | null>(null);
  const [catalogItems, setCatalogItems] = useState<any[]>([]);
  const [comparedPlans, setComparedPlans] = useState<any[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  // Selected entities for actions
  const [selectedPlanForEnrol, setSelectedPlanForEnrol] = useState<any | null>(null);
  const [coverageOption, setCoverageOption] = useState<string>('EmployeeOnly');
  const [dependentsInput, setDependentsInput] = useState<{ name: string; relationship: string; dob: string }[]>([]);
  const [activeProgId, setActiveProgId] = useState<number | null>(null);
  const [logActivityInput, setLogActivityInput] = useState({ challengeID: 0, val: 0 });
  const [bookingEapId, setBookingEapId] = useState<number>(0);
  const [bookingDate, setBookingDate] = useState<string>('');

  // Reward / Peer Nomination form
  const [nominationInput, setNominationInput] = useState({
    recipientID: 0,
    category: 'PeerRecognition',
    badgeName: 'Collaborator Champion',
    points: 100,
    message: ''
  });

  // AI Assistant chatbot states
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<{ sender: 'user' | 'bot'; text: string }[]>([
    { sender: 'bot', text: 'Hello! I am your WellBeing360 Wellness Assistant. Ask me about your flex benefits, counseling services, or wellness challenges!' }
  ]);

  // Load all Employee data
  useEffect(() => {
    async function loadData() {
      if (!currentUser) return;
      try {
        const [
          allPlans,
          enrolments,
          windowObj,
          deps,
          programs,
          sessionList,
          points,
          catalog
        ] = await Promise.all([
          api.getPlans().catch(() => []),
          api.getMyEnrolments().catch(() => []),
          api.getCurrentWindow().catch(() => null),
          api.getMyDependents().catch(() => []),
          api.getWellnessPrograms().catch(() => []),
          api.getMySessions().catch(() => []),
          api.getMyPoints().catch(() => null),
          api.getCatalog().catch(() => [])
        ]);

        setPlans(allPlans);
        setMyEnrolments(enrolments);
        setCurrentWindow(windowObj);
        setMyDependents(deps);
        setWellnessPrograms(programs);
        setMySessions(sessionList);
        setPointsBalance(points);
        setCatalogItems(catalog);

        const activeProg = programs.find((p: any) => p.status === 'Active');
        if (activeProg) {
          setActiveProgId(activeProg.programID);
          const [ch, lb, logs] = await Promise.all([
            api.getChallenges(activeProg.programID).catch(() => []),
            api.getLeaderboard(activeProg.programID).catch(() => []),
            api.getMyLogs().catch(() => [])
          ]);
          setChallenges(ch);
          setLeaderboard(lb);
          setMyActivityLogs(logs);
        }

        const eap = await api.getEapServices().catch(() => []);
        setEapServices(eap);
        if (eap.length > 0) {
          setBookingEapId(eap[0].serviceID);
        }
      } catch (err: any) {
        console.error('Failed to load employee portal details:', err);
      }
    };
    loadData();
  }, [currentUser, refreshTrigger]);

  const handleEnrol = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlanForEnrol) return;
    setApiError(null);
    setSuccessMsg(null);

    // Double check restriction
    const alreadyEnrolled = myEnrolments.some(en => en.planID === selectedPlanForEnrol.planID && en.status !== 'Rejected');
    if (alreadyEnrolled) {
      setApiError('You have already enrolled or requested enrollment in this benefit plan.');
      return;
    }

    try {
      // Create dependents if required
      if (coverageOption !== 'EmployeeOnly' && dependentsInput.length > 0) {
        for (const dep of dependentsInput) {
          await api.addDependent({
            name: dep.name,
            relationship: dep.relationship,
            dateOfBirth: dep.dob
          });
        }
      }

      await api.enrol({
        planID: selectedPlanForEnrol.planID,
        windowID: currentWindow?.windowID || 0,
        coverageOption,
        dependents: coverageOption === 'EmployeeOnly' ? [] : dependentsInput.map(d => ({
          name: d.name,
          relationship: d.relationship,
          dateOfBirth: d.dob
        }))
      });

      setSuccessMsg(`Enrolled in "${selectedPlanForEnrol.planName}" successfully! Submitted for Financial approval.`);
      setSelectedPlanForEnrol(null);
      setDependentsInput([]);
      setRefreshTrigger(prev => prev + 1);
    } catch (err: any) {
      setApiError(err.message || 'Enrollment request failed.');
    }
  };

  const addDependentInputRow = () => {
    setDependentsInput([...dependentsInput, { name: '', relationship: 'Spouse', dob: '' }]);
  };

  const removeDependentInputRow = (index: number) => {
    setDependentsInput(dependentsInput.filter((_, idx) => idx !== index));
  };

  const updateDependentInputRow = (index: number, field: string, val: string) => {
    const updated = dependentsInput.map((row, idx) => {
      if (idx === index) {
        return { ...row, [field]: val };
      }
      return row;
    });
    setDependentsInput(updated);
  };

  const handleLogActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!logActivityInput.challengeID || !logActivityInput.val) {
      setApiError('Please select a challenge and input your activity log value.');
      return;
    }
    setApiError(null);
    setSuccessMsg(null);

    try {
      const result = await api.logActivity({
        challengeID: logActivityInput.challengeID,
        activityValue: logActivityInput.val,
        logDate: new Date().toISOString().split('T')[0]
      });

      setSuccessMsg(`Activity logged! Earned ${result.pointsEarned} reward points.`);
      setLogActivityInput({ challengeID: 0, val: 0 });
      setRefreshTrigger(prev => prev + 1);
    } catch (err: any) {
      setApiError(err.message || 'Failed to submit wellness log.');
    }
  };

  const handleBookEap = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingEapId || !bookingDate) {
      setApiError('Please select a service and picking date/time.');
      return;
    }
    setApiError(null);
    setSuccessMsg(null);

    try {
      await api.bookSession({
        serviceID: bookingEapId,
        requestedDate: new Date(bookingDate).toISOString()
      });

      setSuccessMsg('Counseling session requested successfully!');
      setBookingDate('');
      setRefreshTrigger(prev => prev + 1);
    } catch (err: any) {
      setApiError(err.message || 'Session request failed.');
    }
  };

  const handleNomination = async (e: React.FormEvent) => {
    e.preventDefault();
    const recipient = parseInt(nominationInput.recipientID.toString());
    if (!recipient) {
      setApiError('Please choose a colleague for nomination.');
      return;
    }
    setApiError(null);
    setSuccessMsg(null);

    try {
      await api.nominateAward({
        recipientID: recipient,
        category: nominationInput.category,
        badgeName: nominationInput.badgeName,
        pointsAwarded: nominationInput.points,
        message: nominationInput.message
      });

      setSuccessMsg('Colleague nominated successfully! Nomination logged for Manager audit.');
      setNominationInput({
        recipientID: 0,
        category: 'PeerRecognition',
        badgeName: 'Collaborator Champion',
        points: 100,
        message: ''
      });
      setRefreshTrigger(prev => prev + 1);
    } catch (err: any) {
      setApiError(err.message || 'Nomination failed.');
    }
  };

  const handleRedeem = async (itemId: number, itemName: string) => {
    setApiError(null);
    setSuccessMsg(null);
    try {
      await api.redeemItem(itemId);
      setSuccessMsg(`Redeemed "${itemName}" successfully!`);
      setRefreshTrigger(prev => prev + 1);
    } catch (err: any) {
      setApiError(err.message || 'Redemption failed.');
    }
  };

  const handleAskAssistant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    setChatMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setChatInput('');

    setTimeout(() => {
      let botResponse = "I'm not sure about that. Try asking about 'insurance', 'steps', 'counsellor', or 'awards'!";
      const text = userMsg.toLowerCase();
      if (text.includes('benefit') || text.includes('insurance') || text.includes('plan')) {
        botResponse = `Currently, there are ${plans.filter(p => p.status === 'Active').length} active benefits plans. You can configure enrolments in the 'Benefits' tab.`;
      } else if (text.includes('steps') || text.includes('walk') || text.includes('wellness') || text.includes('challenge')) {
        botResponse = `Check the 'Wellness' tab! You can log your parameters to complete tasks and earn points.`;
      } else if (text.includes('counsell') || text.includes('eap') || text.includes('session')) {
        botResponse = `Our EAP calendar is open in the 'Counselling' tab. Pick an advisor and book a confidential session.`;
      } else if (text.includes('points') || text.includes('redeem') || text.includes('catalog')) {
        botResponse = `You have ${pointsBalance?.balance || 0} active reward points. Redeeming items is available under the 'Rewards' tab catalog.`;
      }
      setChatMessages(prev => [...prev, { sender: 'bot', text: botResponse }]);
    }, 800);
  };

  // Setup sample steps chart data
  const stepsLogsChartData = myActivityLogs.map(l => ({
    label: new Date(l.logDate).toLocaleDateString(undefined, { weekday: 'short' }),
    value: l.activityValue
  })).slice(-7);

  // Filter plans to show ONLY active plans approved by the Finance Manager
  const activePlans = plans.filter(p => p.status === 'Active');

  // Filter challenges to show ONLY active challenges approved by the Finance Executive
  const activeChallenges = challenges.filter(c => c.status === 'Active');

  return (
    <div className="space-y-8 animate-fade-in relative pb-16">
      
      {/* Welcome & Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-slate-900 text-white p-6 rounded-2xl shadow-xl shadow-slate-900/10">
        <div>
          <span className="text-[10px] uppercase bg-emerald-500 text-white font-extrabold px-3 py-1 rounded-full tracking-widest">Employee Portal</span>
          <h2 className="text-2xl sm:text-3xl font-black mt-3">Welcome Back, <span className="text-emerald-400">{currentUser?.name}</span></h2>
          <p className="text-xs text-slate-300 font-medium mt-1">
            Grade: <span className="text-white font-bold">{currentUser?.gradeID}</span> | Dept: <span className="text-white font-bold">{currentUser?.departmentID}</span> | Email: <span className="text-white font-bold">{currentUser?.email}</span>
          </p>
        </div>

        <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4 pr-6 shrink-0">
          <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
            <Gift className="text-white w-6 h-6" />
          </div>
          <div>
            <span className="text-[9px] text-slate-300 font-bold uppercase tracking-wider block">Wallet Balance</span>
            <p className="text-2xl font-black text-emerald-400 mt-0.5">{pointsBalance?.balance || 0} <span className="text-xs text-slate-300 font-medium">pts</span></p>
          </div>
        </div>
      </div>

      {/* Tabs list */}
      <div className="flex gap-2 border-b border-slate-200 pb-0.5 overflow-x-auto scrollbar-none">
        {['dashboard', 'benefits', 'wellness', 'counselling', 'rewards'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-3 font-bold text-sm capitalize border-b-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === tab 
                ? 'border-emerald-500 text-emerald-500' 
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* TAB 1: General Dashboard */}
      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Left Side: Widgets and Graph */}
          <div className="lg:col-span-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Flex Benefits Summary Card */}
              <div className="groww-card p-6 bg-white flex flex-col justify-between">
                <div>
                  <Heart className="w-8 h-8 text-rose-500 mb-4" />
                  <h3 className="font-bold text-slate-800 text-base">Enrolled Benefits</h3>
                  <div className="mt-3 space-y-2">
                    {myEnrolments.length === 0 ? (
                      <p className="text-xs text-slate-400">No active enrolments found.</p>
                    ) : (
                      myEnrolments.map(e => (
                        <div key={e.enrolmentID} className="flex justify-between items-center text-[11px] bg-slate-50 p-2 rounded-lg border border-slate-100">
                          <span className="text-slate-600 font-semibold truncate max-w-[100px]">Plan #{e.planID}</span>
                          <span className="badge badge-active py-0.5 px-2 text-[9px]">{e.status}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Counselling session Card */}
              <div className="groww-card p-6 bg-white flex flex-col justify-between">
                <div>
                  <Calendar className="w-8 h-8 text-indigo-500 mb-4" />
                  <h3 className="font-bold text-slate-800 text-base">EAP Advisories</h3>
                  <div className="mt-3 space-y-2">
                    {mySessions.filter(s => s.status !== 'Cancelled').length === 0 ? (
                      <p className="text-xs text-slate-400">No session requests booked.</p>
                    ) : (
                      mySessions.filter(s => s.status !== 'Cancelled').slice(0, 2).map(s => (
                        <div key={s.sessionID} className="text-[11px] bg-slate-50 p-2 rounded-lg border border-slate-100 flex flex-col gap-1">
                          <div className="flex justify-between items-center">
                            <span className="text-slate-700 font-bold truncate">Advisor Ref #{s.sessionID}</span>
                            <span className="badge badge-pending py-0.5 px-2 text-[9px]">{s.status}</span>
                          </div>
                          <span className="text-slate-400">{new Date(s.sessionDate).toLocaleDateString()}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Wellness Logging card */}
              <div className="groww-card p-6 bg-white flex flex-col justify-between">
                <div>
                  <Activity className="w-8 h-8 text-emerald-500 mb-4" />
                  <h3 className="font-bold text-slate-800 text-base">Wellness Wallet</h3>
                  <div className="mt-3 space-y-2">
                    {myActivityLogs.length === 0 ? (
                      <p className="text-xs text-slate-400">No logged items on record.</p>
                    ) : (
                      myActivityLogs.slice(0, 2).map(l => (
                        <div key={l.logID} className="flex justify-between items-center text-[11px] bg-slate-50 p-2 rounded-lg border border-slate-100">
                          <span className="text-slate-500">Log #{l.logID}</span>
                          <span className="text-emerald-500 font-bold">+{l.pointsEarned} pts</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

            </div>

            {/* Sparkline Graph */}
            <div className="groww-card p-6 bg-white">
              <h3 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2">
                <HeartPulse className="w-5 h-5 text-emerald-500" /> Wellness Step Logging Trend
              </h3>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <LineChart data={stepsLogsChartData.length > 0 ? stepsLogsChartData : [
                  { label: 'Mon', value: 4000 },
                  { label: 'Tue', value: 6500 },
                  { label: 'Wed', value: 5000 },
                  { label: 'Thu', value: 9200 },
                  { label: 'Fri', value: 8000 },
                  { label: 'Sat', value: 11000 },
                  { label: 'Sun', value: 7500 },
                ]} />
              </div>
            </div>

          </div>

          {/* Right Side Sidebar widgets: Leaderboard */}
          <div className="lg:col-span-4 space-y-8">
            <div className="groww-card p-6 bg-white">
              <h3 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2">
                <Trophy className="text-amber-500 w-5 h-5" /> Challenge Standings
              </h3>
              <div className="space-y-3">
                {leaderboard.length === 0 ? (
                  <p className="text-xs text-slate-400 py-6 text-center">No participants recorded yet.</p>
                ) : (
                  leaderboard.slice(0, 4).map((entry, index) => (
                    <div key={entry.employeeID} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl">
                      <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                          index === 0 ? 'bg-amber-100 text-amber-600' : 'bg-slate-200 text-slate-600'
                        }`}>{index + 1}</span>
                        <span className="text-sm font-bold text-slate-700">{entry.employeeName}</span>
                      </div>
                      <span className="text-sm text-emerald-500 font-extrabold">{entry.totalPoints} pts</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: Flexible Benefits Wizard */}
      {activeTab === 'benefits' && (
        <div className="space-y-8">
          {currentWindow ? (
            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex justify-between items-center gap-4 animate-fade-in">
              <div>
                <h3 className="font-bold text-slate-800 text-base">Flexible Benefit Open Enrollment Window is Active!</h3>
                <p className="text-xs text-slate-500">Plan Year: {currentWindow.planYear} | Enrollment Close: {new Date(currentWindow.closeDate).toLocaleDateString()}</p>
              </div>
              <span className="badge badge-active shrink-0">Open Enrolment</span>
            </div>
          ) : (
            <div className="p-5 bg-slate-100 border border-slate-200 rounded-2xl text-slate-500 text-sm">
              The flexible benefit enrollment window is currently closed. If you require manual plan adjustments, please contact an HR Benefits administrator.
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Eligible plans */}
            <div className="lg:col-span-7 space-y-4">
              <h3 className="font-black text-slate-900 text-lg mb-2">Available Benefit Offerings</h3>
              <div className="space-y-4">
                {activePlans.length === 0 ? (
                  <p className="text-xs text-slate-400 py-6 text-center bg-white border border-slate-200 rounded-2xl">No active benefit plans available at this time.</p>
                ) : (
                  activePlans.map(plan => {
                    const isEligible = plan.eligibilityGrade === 'All' || plan.eligibilityGrade.split(',').includes(currentUser?.gradeID || '');
                    const isChecked = comparedPlans.some(p => p.planID === plan.planID);
                    
                    // Enrollment restriction logic
                    const alreadyEnrolled = myEnrolments.some(en => en.planID === plan.planID && en.status !== 'Rejected');

                    return (
                      <div key={plan.planID} className={`p-6 bg-white border rounded-2xl groww-card ${
                        selectedPlanForEnrol?.planID === plan.planID ? 'border-emerald-500 ring-2 ring-emerald-500/10' : 'border-slate-200'
                      }`}>
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <span className="text-[9px] bg-slate-100 text-slate-500 font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">{plan.planType}</span>
                            <h4 className="font-bold text-slate-800 text-base mt-2">{plan.planName}</h4>
                          </div>
                          <div className="flex flex-col items-end gap-2 shrink-0">
                            {alreadyEnrolled ? (
                              <span className="badge bg-emerald-50 text-emerald-600 font-bold text-[10px]">Enrolled</span>
                            ) : (
                              <span className={`badge ${isEligible ? 'badge-active' : 'badge-error'}`}>{isEligible ? 'Eligible' : `Grade Ineligible (${plan.eligibilityGrade})`}</span>
                            )}
                            
                            {!alreadyEnrolled && (
                              <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-slate-400 hover:text-slate-600 mt-1">
                                <input 
                                  type="checkbox"
                                  checked={isChecked}
                                  disabled={!isEligible}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      if (comparedPlans.length >= 3) {
                                        setApiError('You can compare a maximum of 3 plans at a time.');
                                        return;
                                      }
                                      setComparedPlans([...comparedPlans, plan]);
                                    } else {
                                      setComparedPlans(comparedPlans.filter(p => p.planID !== plan.planID));
                                    }
                                  }}
                                  className="w-4 h-4 accent-emerald-500 rounded border-slate-300"
                                />
                                <span>Compare</span>
                              </label>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 mt-4 text-xs">
                          <div>
                            <span className="text-slate-400 block font-semibold">Employee Share</span>
                            <span className="text-slate-700 font-bold">${plan.employeeContribution}/mo</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block font-semibold">Employer Share</span>
                            <span className="text-slate-700 font-bold">${plan.employerContribution}/mo</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block font-semibold">Coverage Cap</span>
                            <span className="text-slate-700 font-bold">${plan.coverageLimit.toLocaleString()}</span>
                          </div>
                        </div>

                        {currentWindow && isEligible && !alreadyEnrolled && (
                          <button 
                            onClick={() => setSelectedPlanForEnrol(plan)}
                            className="mt-5 w-full py-2.5 bg-slate-900 text-white hover:bg-slate-800 font-semibold rounded-xl text-xs transition cursor-pointer"
                          >
                            Select & Checkout Enrolment
                          </button>
                        )}
                        {alreadyEnrolled && (
                          <button 
                            disabled
                            className="mt-5 w-full py-2.5 bg-slate-100 text-slate-400 font-semibold rounded-xl text-xs transition cursor-not-allowed border border-slate-200"
                          >
                            Already Enrolled (Cannot Re-enroll)
                          </button>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right Column: Checkout panel */}
            <div className="lg:col-span-5">
              <div className="groww-card p-6 bg-white sticky top-20">
                <h3 className="font-bold text-slate-800 text-lg mb-4">Enrollment Checkout</h3>
                
                {selectedPlanForEnrol ? (
                  <form onSubmit={handleEnrol} className="space-y-5">
                    <div>
                      <label className="text-xs font-bold text-slate-400 block mb-1">Selected Plan</label>
                      <input type="text" readOnly value={selectedPlanForEnrol.planName} className="custom-input" />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-400 block mb-1">Coverage Scope</label>
                      <select 
                        value={coverageOption} 
                        onChange={(e) => setCoverageOption(e.target.value)} 
                        className="custom-select"
                      >
                        <option value="EmployeeOnly">Self Only</option>
                        <option value="EmployeeSpouse">Self + Spouse</option>
                        <option value="Family">Full Family (Spouse/Children)</option>
                      </select>
                    </div>

                    {/* Dependents list */}
                    {coverageOption !== 'EmployeeOnly' && (
                      <div className="space-y-3 pt-3 border-t border-slate-100">
                        <div className="flex justify-between items-center">
                          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Dependent Information</h4>
                          <button 
                            type="button" 
                            onClick={addDependentInputRow} 
                            className="text-xs text-emerald-500 font-bold flex items-center gap-1 hover:text-emerald-600"
                          >
                            <Plus className="w-3.5 h-3.5" /> Add
                          </button>
                        </div>

                        {dependentsInput.length === 0 ? (
                          <p className="text-xs text-slate-400 text-center py-4 bg-slate-50 border border-slate-100 rounded-xl">No dependents entered. Click add to register a family member.</p>
                        ) : (
                          <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                            {dependentsInput.map((dep, idx) => (
                              <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-col gap-2 relative">
                                <button 
                                  type="button" 
                                  onClick={() => removeDependentInputRow(idx)}
                                  className="absolute top-2 right-2 text-rose-500 hover:text-rose-700 cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                                
                                <div>
                                  <input 
                                    type="text" 
                                    placeholder="Full Name" 
                                    required 
                                    value={dep.name} 
                                    onChange={(e) => updateDependentInputRow(idx, 'name', e.target.value)}
                                    className="custom-input py-1.5 text-xs bg-white" 
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  <select 
                                    value={dep.relationship} 
                                    onChange={(e) => updateDependentInputRow(idx, 'relationship', e.target.value)}
                                    className="custom-select py-1 text-xs bg-white"
                                  >
                                    <option value="Spouse">Spouse</option>
                                    <option value="Child">Child</option>
                                    <option value="Parent">Parent</option>
                                  </select>
                                  <input 
                                    type="date" 
                                    required 
                                    value={dep.dob} 
                                    onChange={(e) => updateDependentInputRow(idx, 'dob', e.target.value)}
                                    className="custom-input py-1 text-xs bg-white" 
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    <button 
                      type="submit" 
                      className="w-full py-3 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 transition shadow-lg shadow-emerald-500/20 cursor-pointer text-sm"
                    >
                      Submit Enrollment Request
                    </button>
                  </form>
                ) : (
                  <p className="text-sm text-slate-400 py-6 text-center">Please choose one of the eligible plans from the list to begin checkout.</p>
                )}
              </div>
            </div>

          </div>

          {/* Compare Modal popups */}
          {comparedPlans.length > 0 && (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900 border border-slate-800 p-4 flex items-center justify-between gap-6 shadow-2xl rounded-2xl w-full max-w-2xl text-white animate-fade-in">
              <div className="flex items-center gap-3 overflow-x-auto">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Compare ({comparedPlans.length}):</span>
                <div className="flex gap-2">
                  {comparedPlans.map(p => (
                    <span key={p.planID} className="text-[10px] bg-slate-800 border border-slate-700 px-2.5 py-1 rounded-full font-bold text-slate-200">{p.planName}</span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button 
                  onClick={() => setShowCompareModal(true)} 
                  className="py-1.5 px-4 bg-emerald-500 hover:bg-emerald-600 text-xs font-bold text-white rounded-lg cursor-pointer"
                >
                  Compare Now
                </button>
                <button 
                  onClick={() => setComparedPlans([])} 
                  className="text-xs text-slate-400 hover:text-white px-2 py-1 cursor-pointer"
                >
                  Clear
                </button>
              </div>
            </div>
          )}

          <Dialog isOpen={showCompareModal} onClose={() => setShowCompareModal(false)} title="Plan Comparison Analysis">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-400 uppercase font-bold border-b border-slate-200">
                    <th className="p-3">Attributes</th>
                    {comparedPlans.map(p => (
                      <th key={p.planID} className="p-3 text-center text-slate-800 font-bold">{p.planName}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  <tr>
                    <td className="p-3 font-semibold">Plan Type</td>
                    {comparedPlans.map(p => (
                      <td key={p.planID} className="p-3 text-center font-bold text-emerald-500 uppercase tracking-wider">{p.planType}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">Employee Premium</td>
                    {comparedPlans.map(p => (
                      <td key={p.planID} className="p-3 text-center font-extrabold text-slate-800">${p.employeeContribution}/mo</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">Employer Premium</td>
                    {comparedPlans.map(p => (
                      <td key={p.planID} className="p-3 text-center font-extrabold text-slate-800">${p.employerContribution}/mo</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">Premium Split Chart</td>
                    {comparedPlans.map(p => (
                      <td key={p.planID} className="p-2 justify-center flex">
                        <DonutChart employee={p.employeeContribution} employer={p.employerContribution} />
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">Coverage Limit</td>
                    {comparedPlans.map(p => (
                      <td key={p.planID} className="p-3 text-center font-extrabold text-indigo-600 text-sm">${p.coverageLimit.toLocaleString()}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">Eligible Grade</td>
                    {comparedPlans.map(p => (
                      <td key={p.planID} className="p-3 text-center font-bold">{p.eligibilityGrade}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </Dialog>

        </div>
      )}

      {/* TAB 3: Wellness logs & programs */}
      {activeTab === 'wellness' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Programs selection list */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="font-bold text-slate-800 text-lg">Wellness Campaigns</h3>
            <div className="space-y-3">
              {wellnessPrograms.map(p => (
                <button
                  key={p.programID}
                  onClick={() => {
                    setActiveProgId(p.programID);
                    api.getChallenges(p.programID).then(setChallenges);
                    api.getLeaderboard(p.programID).then(setLeaderboard);
                  }}
                  className={`w-full text-left p-4 bg-white border rounded-2xl flex flex-col gap-2 transition duration-200 cursor-pointer ${
                    activeProgId === p.programID 
                      ? 'border-emerald-500 ring-2 ring-emerald-500/10' 
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex justify-between items-center w-full">
                    <h4 className="font-bold text-slate-800 text-sm">{p.name}</h4>
                    <span className={`badge ${p.status === 'Active' ? 'badge-active' : 'badge-pending'}`}>{p.status}</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-400 font-semibold w-full">
                    <span>Points: {p.pointsOnOffer} max</span>
                    <span>Target: {p.targetParticipation}%</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Challenges & activity submission */}
          <div className="lg:col-span-8 space-y-6">
            <h3 className="font-bold text-slate-800 text-lg">Active Challenge Tasks</h3>
            
            {activeChallenges.length === 0 ? (
              <p className="text-xs text-slate-400 py-8 bg-white border border-slate-200 rounded-2xl text-center">No active/approved challenges configured for the selected campaign.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeChallenges.map(ch => (
                  <div key={ch.challengeID} className="p-5 bg-white border border-slate-200 rounded-2xl flex flex-col justify-between groww-card">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-slate-800 text-base">{ch.challengeName}</h4>
                        <span className="badge badge-active">{ch.status}</span>
                      </div>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-2">Activity Type: {ch.activityType}</p>
                      
                      <div className="grid grid-cols-2 gap-2 mt-4 text-xs font-semibold text-slate-500">
                        <span>Daily Target: <strong className="text-slate-800">{ch.dailyTarget.toLocaleString()}</strong></span>
                        <span>Points Offered: <strong className="text-emerald-500">+{ch.pointsPerCompletion}</strong></span>
                      </div>
                    </div>

                    <button 
                      onClick={() => setLogActivityInput({ challengeID: ch.challengeID, val: ch.dailyTarget })}
                      className="mt-5 py-2.5 bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-600 font-bold border border-slate-200 hover:border-emerald-200 rounded-xl text-xs transition cursor-pointer text-center"
                    >
                      Log Workout Done
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Custom logging form */}
            {logActivityInput.challengeID > 0 && (
              <div className="p-6 bg-slate-900 text-white rounded-2xl animate-fade-in shadow-xl shadow-slate-900/10">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold text-base">Submit Challenge Completion Logs</h4>
                  <button 
                    onClick={() => setLogActivityInput({ challengeID: 0, val: 0 })}
                    className="text-slate-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <form onSubmit={handleLogActivity} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">Challenge ID</label>
                      <input type="text" readOnly value={`Challenge #${logActivityInput.challengeID}`} className="custom-input bg-white/5 border-white/10 text-white" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">Work Value (e.g. Steps Count)</label>
                      <input 
                        type="number" 
                        required 
                        value={logActivityInput.val} 
                        onChange={(e) => setLogActivityInput({ ...logActivityInput, val: parseInt(e.target.value) })}
                        className="custom-input bg-white/5 border-white/10 text-white focus:bg-slate-800" 
                      />
                    </div>
                  </div>
                  <button 
                    type="submit" 
                    className="w-full py-2.5 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 transition cursor-pointer text-xs"
                  >
                    Sync Log File
                  </button>
                </form>
              </div>
            )}
          </div>

        </div>
      )}

      {/* TAB 4: Counselling EAP booking */}
      {activeTab === 'counselling' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Services catalogue list */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="font-bold text-slate-800 text-lg">Confidential Advisory Options</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {eapServices.map(srv => (
                <div key={srv.serviceID} className={`p-5 bg-white border rounded-2xl flex flex-col justify-between groww-card ${
                  bookingEapId === srv.serviceID ? 'border-emerald-500 ring-2 ring-emerald-500/10' : 'border-slate-200'
                }`}>
                  <div>
                    <span className="text-[9px] bg-slate-100 text-slate-500 font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">{srv.category}</span>
                    <h4 className="font-bold text-slate-800 text-base mt-2">{srv.serviceName}</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{srv.description}</p>
                  </div>
                  <button 
                    onClick={() => setBookingEapId(srv.serviceID)}
                    className="mt-5 w-full py-2 bg-slate-50 border border-slate-200 text-slate-700 font-bold rounded-xl text-xs hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition cursor-pointer"
                  >
                    Select Service
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Booking slot calendar */}
          <div className="lg:col-span-5">
            <div className="groww-card p-6 bg-white sticky top-20">
              <h3 className="font-bold text-slate-800 text-lg mb-4">Request Advisory Session</h3>
              <form onSubmit={handleBookEap} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Assigned Advisory Service</label>
                  <select 
                    value={bookingEapId} 
                    onChange={(e) => setBookingEapId(parseInt(e.target.value))} 
                    className="custom-select"
                  >
                    {eapServices.map(s => (
                      <option key={s.serviceID} value={s.serviceID}>{s.serviceName} ({s.category})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Pick Date & Time</label>
                  <input 
                    type="datetime-local" 
                    required 
                    value={bookingDate} 
                    onChange={(e) => setBookingDate(e.target.value)} 
                    className="custom-input" 
                  />
                </div>

                <button 
                  type="submit" 
                  className="w-full py-3 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 transition shadow-lg shadow-emerald-500/20 cursor-pointer text-sm"
                >
                  Book Private Slot
                </button>
              </form>
            </div>
          </div>

        </div>
      )}

      {/* TAB 5: Rewards & Nomination Form */}
      {activeTab === 'rewards' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
          
          {/* Peer Nomination Form */}
          <div className="lg:col-span-7 space-y-8">
            
            <div className="groww-card p-6 bg-white">
              <h3 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" /> Nominate a Peer
              </h3>
              <form onSubmit={handleNomination} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-400 block mb-1">Select Teammate</label>
                    <select 
                      value={nominationInput.recipientID}
                      onChange={(e) => setNominationInput({ ...nominationInput, recipientID: parseInt(e.target.value) })}
                      className="custom-select"
                    >
                      <option value="0">Choose Colleague...</option>
                      <option value="2">dharshan (HRBenefitsAdmin)</option>
                      <option value="3">Vignesh (Finance)</option>
                      <option value="4">Nishanth (WellnessCoordinator)</option>
                      <option value="5">pradeep (RecognitionManager)</option>
                      <option value="6">Madhav (Admin)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 block mb-1">Badge Category</label>
                    <select 
                      value={nominationInput.badgeName}
                      onChange={(e) => setNominationInput({ ...nominationInput, badgeName: e.target.value })}
                      className="custom-select"
                    >
                      <option value="Collaborator Champion">Collaborator Champion</option>
                      <option value="Customer Obsession">Customer Obsession</option>
                      <option value="Excellence Driver">Excellence Driver</option>
                      <option value="Innovation Pioneer">Innovation Pioneer</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-400 block mb-1">Award Points Allocation</label>
                    <input 
                      type="number" 
                      min="50" 
                      max="500" 
                      value={nominationInput.points} 
                      onChange={(e) => setNominationInput({ ...nominationInput, points: parseInt(e.target.value) })}
                      className="custom-input" 
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 block mb-1">Nomination Type</label>
                    <select 
                      value={nominationInput.category}
                      onChange={(e) => setNominationInput({ ...nominationInput, category: e.target.value })}
                      className="custom-select"
                    >
                      <option value="PeerRecognition">Peer Recognition</option>
                      <option value="MilestoneAward">Milestone Celebration</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Message Description</label>
                  <textarea 
                    rows={2}
                    required
                    placeholder="Thanks for going above and beyond to support the project launch!"
                    value={nominationInput.message}
                    onChange={(e) => setNominationInput({ ...nominationInput, message: e.target.value })}
                    className="custom-textarea"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-2.5 bg-emerald-500 text-white font-bold rounded-xl text-xs hover:bg-emerald-600 transition cursor-pointer"
                >
                  Send Nomination
                </button>
              </form>
            </div>

          </div>

          {/* Catalog items redemptions */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="font-bold text-slate-800 text-lg">Redemption Catalog</h3>
            <div className="space-y-3">
              {catalogItems.map(item => (
                <div key={item.itemID} className="p-4 bg-white border border-slate-200 rounded-2xl flex justify-between items-center gap-4 groww-card">
                  <div className="min-w-0">
                    <span className="text-[9px] bg-indigo-50 text-indigo-600 font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">{item.category}</span>
                    <h4 className="font-bold text-slate-800 text-sm mt-1.5 truncate">{item.itemName}</h4>
                    <span className="text-xs text-slate-400 font-semibold block mt-0.5">Required: <strong className="text-emerald-500 font-bold">{item.pointsRequired} pts</strong></span>
                  </div>

                  <button 
                    onClick={() => handleRedeem(item.itemID, item.itemName)}
                    disabled={(pointsBalance?.balance || 0) < item.pointsRequired}
                    className="py-2 px-4 bg-emerald-500 text-white font-bold rounded-xl text-xs hover:bg-emerald-600 disabled:bg-slate-100 disabled:text-slate-400 transition cursor-pointer disabled:cursor-not-allowed shrink-0"
                  >
                    Redeem
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Floating chatbot assistant toggler widget */}
      <div className="fixed bottom-6 right-6 z-40">
        <button 
          onClick={() => setAssistantOpen(!assistantOpen)}
          className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-105 hover:bg-emerald-500 transition cursor-pointer"
        >
          {assistantOpen ? <X className="w-5 h-5" /> : <MessageCircle className="w-6 h-6" />}
        </button>

        {assistantOpen && (
          <div className="absolute bottom-16 right-0 w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[400px] animate-fade-in">
            {/* AI header */}
            <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold uppercase tracking-wider">Wellness AI Assistant</span>
              </div>
            </div>

            {/* AI message list */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-64">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-3 rounded-2xl text-xs max-w-[85%] leading-relaxed ${
                    msg.sender === 'user' ? 'bg-emerald-500 text-white rounded-tr-none' : 'bg-slate-100 text-slate-700 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* AI input text */}
            <form onSubmit={handleAskAssistant} className="p-3 border-t border-slate-100 flex gap-2">
              <input 
                type="text" 
                placeholder="Ask wellness AI..." 
                value={chatInput} 
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs outline-none focus:border-emerald-500" 
              />
              <button type="submit" className="p-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 cursor-pointer">
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}
      </div>

    </div>
  );
}
