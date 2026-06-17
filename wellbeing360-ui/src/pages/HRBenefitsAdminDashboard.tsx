import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import { ShieldCheck, Plus, CheckCircle2, ListFilter, ClipboardCheck } from 'lucide-react';

export default function HRBenefitsAdminDashboard() {
  const { setApiError, setSuccessMsg, refreshTrigger, setRefreshTrigger } = useAuth();

  const [allEnrolments, setAllEnrolments] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [allChallenges, setAllChallenges] = useState<any[]>([]);

  const [newPlan, setNewPlan] = useState({
    planName: '',
    planType: 'GroupHealthInsurance',
    eligibilityGrade: 'All',
    employeeContribution: 50,
    employerContribution: 200,
    coverageLimit: 5000,
    status: 'Pending' // Starts as Pending approval by the Finance Manager
  });

  const [newWindow, setNewWindow] = useState({
    planYear: 2026,
    openDate: '',
    closeDate: '',
    eligibleGrades: 'All'
  });

  useEffect(() => {
    async function loadAdminData() {
      try {
        const [enrols, plList, chList] = await Promise.all([
          api.getAllEnrolments().catch(() => []),
          api.getPlans().catch(() => []),
          api.getAllChallenges().catch(() => [])
        ]);
        setAllEnrolments(enrols);
        setPlans(plList);
        setAllChallenges(chList);
      } catch (err: any) {
        console.error('Failed to load HR admin details:', err);
      }
    }
    loadAdminData();
  }, [refreshTrigger]);

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    setSuccessMsg(null);

    try {
      await api.createPlan({
        ...newPlan,
        status: 'Pending' // Force Pending approval by Finance Manager
      });
      setSuccessMsg(`Plan "${newPlan.planName}" created successfully! It is pending approval from the Finance Manager.`);
      setNewPlan({
        planName: '',
        planType: 'GroupHealthInsurance',
        eligibilityGrade: 'All',
        employeeContribution: 50,
        employerContribution: 200,
        coverageLimit: 5000,
        status: 'Pending'
      });
      setRefreshTrigger(prev => prev + 1);
    } catch (err: any) {
      setApiError(err.message || 'Failed to create plan.');
    }
  };

  const handleCreateWindow = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    setSuccessMsg(null);

    try {
      await api.createWindow({
        planYear: newWindow.planYear,
        openDate: new Date(newWindow.openDate).toISOString(),
        closeDate: new Date(newWindow.closeDate).toISOString(),
        eligibleGrades: newWindow.eligibleGrades
      });
      setSuccessMsg('Benefits enrollment window scheduled successfully!');
      setNewWindow({
        planYear: 2026,
        openDate: '',
        closeDate: '',
        eligibleGrades: 'All'
      });
      setRefreshTrigger(prev => prev + 1);
    } catch (err: any) {
      setApiError(err.message || 'Failed to schedule enrollment window.');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header banner */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl flex justify-between items-center">
        <div>
          <span className="text-[10px] uppercase bg-emerald-500 text-white font-extrabold px-3 py-1 rounded-full tracking-widest">HR Admin Console</span>
          <h2 className="text-2xl font-black mt-3">Benefits & Plans Control</h2>
          <p className="text-xs text-slate-300 font-semibold mt-1">Configure flexible options, adjust grades eligibility, and audit active directories.</p>
        </div>
        <ShieldCheck className="text-emerald-500 w-12 h-12 shrink-0 hidden sm:block" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Create forms */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Plan Form */}
          <div className="groww-card p-6 bg-white">
            <h3 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-emerald-500" /> Create Benefit Plan
            </h3>
            <form onSubmit={handleCreatePlan} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Plan Name</label>
                <input 
                  type="text" 
                  required 
                  placeholder="Platinum Health Plus"
                  value={newPlan.planName}
                  onChange={(e) => setNewPlan({ ...newPlan, planName: e.target.value })}
                  className="custom-input" 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Plan Category</label>
                  <select 
                    value={newPlan.planType}
                    onChange={(e) => setNewPlan({ ...newPlan, planType: e.target.value })}
                    className="custom-select"
                  >
                    <option value="GroupHealthInsurance">Health Insurance</option>
                    <option value="FlexibleWellnessWallet">Wellness Wallet</option>
                    <option value="DentalVisionCover">Dental & Vision</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Eligible Grades</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="G1,G2,G3 (or All)"
                    value={newPlan.eligibilityGrade}
                    onChange={(e) => setNewPlan({ ...newPlan, eligibilityGrade: e.target.value })}
                    className="custom-input" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">EE Pay ($)</label>
                  <input 
                    type="number" 
                    required 
                    value={newPlan.employeeContribution}
                    onChange={(e) => setNewPlan({ ...newPlan, employeeContribution: parseInt(e.target.value) })}
                    className="custom-input" 
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">ER Pay ($)</label>
                  <input 
                    type="number" 
                    required 
                    value={newPlan.employerContribution}
                    onChange={(e) => setNewPlan({ ...newPlan, employerContribution: parseInt(e.target.value) })}
                    className="custom-input" 
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Limit ($)</label>
                  <input 
                    type="number" 
                    required 
                    value={newPlan.coverageLimit}
                    onChange={(e) => setNewPlan({ ...newPlan, coverageLimit: parseInt(e.target.value) })}
                    className="custom-input" 
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs transition cursor-pointer"
              >
                Add Plan (Requires Finance Approval)
              </button>
            </form>
          </div>

          {/* Window Form */}
          <div className="groww-card p-6 bg-white">
            <h3 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-indigo-500" /> Schedule Open Enrolment
            </h3>
            <form onSubmit={handleCreateWindow} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Plan Year</label>
                  <input 
                    type="number" 
                    required 
                    value={newWindow.planYear}
                    onChange={(e) => setNewWindow({ ...newWindow, planYear: parseInt(e.target.value) })}
                    className="custom-input" 
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Grades Scope</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="All"
                    value={newWindow.eligibleGrades}
                    onChange={(e) => setNewWindow({ ...newWindow, eligibleGrades: e.target.value })}
                    className="custom-input" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Open Date</label>
                  <input 
                    type="date" 
                    required 
                    value={newWindow.openDate}
                    onChange={(e) => setNewWindow({ ...newWindow, openDate: e.target.value })}
                    className="custom-input" 
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Close Date</label>
                  <input 
                    type="date" 
                    required 
                    value={newWindow.closeDate}
                    onChange={(e) => setNewWindow({ ...newWindow, closeDate: e.target.value })}
                    className="custom-input" 
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition cursor-pointer"
              >
                Schedule Open Window
              </button>
            </form>
          </div>

        </div>

        {/* Right Column: Plans status & Enrolled Benefits Directory */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Benefit Plans Directory */}
          <div className="groww-card p-6 bg-white">
            <h3 className="font-bold text-slate-800 text-base mb-4">Benefit Catalog Approvals Status</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-400 uppercase font-bold border-b border-slate-200">
                    <th className="p-3">Plan Name</th>
                    <th className="p-3">Plan Category</th>
                    <th className="p-3">Limit</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  {plans.map(p => (
                    <tr key={p.planID}>
                      <td className="p-3 font-bold text-slate-800">{p.planName}</td>
                      <td className="p-3 font-semibold uppercase">{p.planType}</td>
                      <td className="p-3">${p.coverageLimit.toLocaleString()}</td>
                      <td className="p-3">
                        <span className={`badge ${
                          p.status === 'Active' ? 'badge-active' : p.status === 'Pending' ? 'badge-pending' : 'badge-error'
                        }`}>
                          {p.status === 'Pending' ? 'Pending Finance Approval' : p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Enrolled Benefits Directory */}
          <div className="groww-card p-6 bg-white">
            <h3 className="font-bold text-slate-800 text-base mb-4 flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-emerald-500" /> Global Enrolled Benefits Directory
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-400 uppercase font-bold border-b border-slate-200">
                    <th className="p-3">Enrolment ID</th>
                    <th className="p-3">Employee Context</th>
                    <th className="p-3">Plan ID</th>
                    <th className="p-3">Option</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  {allEnrolments.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-6 text-center text-slate-400">No employee enrolments registered in the directory.</td>
                    </tr>
                  ) : (
                    allEnrolments.map(enrol => (
                      <tr key={enrol.enrolmentID}>
                        <td className="p-3 font-bold text-slate-800">#{enrol.enrolmentID}</td>
                        <td className="p-3 font-semibold capitalize text-slate-700">User Context: ID {enrol.employeeID}</td>
                        <td className="p-3 font-semibold text-slate-600">Plan #{enrol.planID}</td>
                        <td className="p-3 font-bold uppercase">{enrol.coverageOption}</td>
                        <td className="p-3">
                          <span className={`badge ${
                            enrol.status === 'Approved' ? 'badge-active' : enrol.status === 'Pending' ? 'badge-pending' : 'badge-error'
                          }`}>{enrol.status}</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Challenges View */}
          <div className="groww-card p-6 bg-white">
            <h3 className="font-bold text-slate-800 text-base mb-4">Wellness Challenge Templates</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {allChallenges.map(c => (
                <div key={c.challengeID} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <span className="text-[9px] bg-indigo-50 text-indigo-600 font-extrabold px-2 py-0.5 rounded uppercase">{c.activityType}</span>
                      <span className={`badge ${c.status === 'Active' ? 'badge-active' : 'badge-pending'}`}>{c.status}</span>
                    </div>
                    <h4 className="font-bold text-slate-800 text-sm mt-2">{c.challengeName}</h4>
                    <p className="text-[10px] text-slate-400 mt-1">Daily Target: {c.dailyTarget.toLocaleString()} | Award: +{c.pointsPerCompletion} pts</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
