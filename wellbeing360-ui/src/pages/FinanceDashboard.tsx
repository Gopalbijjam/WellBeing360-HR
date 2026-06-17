import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import { LineChart, DonutChart, BarChart } from '../components/CustomChart';
import { 
  DollarSign, FileSpreadsheet, Plus, TrendingUp, CheckCircle2, XCircle, 
  Users, Activity, Heart, ShieldAlert, FileText, Check, X 
} from 'lucide-react';

export default function FinanceDashboard() {
  const { setApiError, setSuccessMsg, refreshTrigger, setRefreshTrigger } = useAuth();

  const [activeTab, setActiveTab] = useState<'analytics' | 'enrolments' | 'plans' | 'challenges' | 'claims'>('analytics');
  
  // Analytics State
  const [reports, setReports] = useState<any[]>([]);
  const [financeQuarter, setFinanceQuarter] = useState<'Q1' | 'Q2' | 'Q3' | 'Q4'>('Q4');
  const [selectedReport, setSelectedReport] = useState<any | null>(null);

  // Approvals & Directory State
  const [benefitPlans, setBenefitPlans] = useState<any[]>([]);
  const [enrolments, setEnrolments] = useState<any[]>([]);
  const [challenges, setChallenges] = useState<any[]>([]);

  // Mock Reimbursement Claims State (persisted locally)
  const [reimbursementClaims, setReimbursementClaims] = useState<any[]>(() => {
    try {
      const stored = localStorage.getItem('wellbeing360_claims');
      return stored ? JSON.parse(stored) : [
        { claimID: 101, employeeName: 'balaji', claimType: 'Gym Membership Reimbursement', amount: 150.00, receiptRef: 'REC-9081', status: 'Pending' },
        { claimID: 102, employeeName: 'arun', claimType: 'Prescription Glasses Reimb.', amount: 200.00, receiptRef: 'REC-1122', status: 'Pending' },
        { claimID: 103, employeeName: 'divya', claimType: 'Mental Health Advisor Session', amount: 120.00, receiptRef: 'REC-3044', status: 'Approved' }
      ];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    async function loadFinanceData() {
      try {
        const [repList, plansList, enrolsList, challsList] = await Promise.all([
          api.getReports().catch(() => []),
          api.getPlans().catch(() => []),
          api.getAllEnrolments().catch(() => []),
          api.getAllChallenges().catch(() => [])
        ]);
        setReports(repList);
        setBenefitPlans(plansList);
        setEnrolments(enrolsList);
        setChallenges(challsList);

        if (repList.length > 0 && !selectedReport) {
          setSelectedReport(repList[0]);
        }
      } catch (err: any) {
        console.error('Failed to load finance reports/approvals details:', err);
      }
    }
    loadFinanceData();
  }, [refreshTrigger]);

  const handleGenerateReport = async () => {
    setApiError(null);
    setSuccessMsg(null);
    try {
      const newRep = await api.generateReport(financeQuarter);
      setSuccessMsg(`Financial report generated for scope: ${financeQuarter}!`);
      setSelectedReport(newRep);
      setRefreshTrigger(prev => prev + 1);
    } catch (err: any) {
      setApiError(err.message || 'Report generation failed.');
    }
  };

  const handleApprovePlan = async (planId: number, status: 'Active' | 'Rejected') => {
    setApiError(null);
    setSuccessMsg(null);
    try {
      await api.updatePlanStatus(planId, status);
      setSuccessMsg(`Benefit Plan #${planId} status updated to: ${status}!`);
      setRefreshTrigger(prev => prev + 1);
    } catch (err: any) {
      setApiError(err.message || 'Failed to update plan approval status.');
    }
  };

  const handleApproveChallenge = async (challengeId: number, status: 'Active' | 'Rejected') => {
    setApiError(null);
    setSuccessMsg(null);
    try {
      await api.updateChallengeStatus(challengeId, status);
      setSuccessMsg(`Wellness Challenge #${challengeId} status updated to: ${status}!`);
      setRefreshTrigger(prev => prev + 1);
    } catch (err: any) {
      setApiError(err.message || 'Failed to update challenge approval status.');
    }
  };

  const handleApproveEnrolment = async (enrolmentId: number, status: 'Approved' | 'Rejected') => {
    setApiError(null);
    setSuccessMsg(null);
    try {
      await api.updateEnrolmentStatus(enrolmentId, status);
      setSuccessMsg(`Employee Enrolment Request #${enrolmentId} has been ${status}!`);
      setRefreshTrigger(prev => prev + 1);
    } catch (err: any) {
      setApiError(err.message || 'Failed to update enrolment status.');
    }
  };

  const handleUpdateClaimStatus = (claimId: number, status: 'Approved' | 'Rejected') => {
    setReimbursementClaims(prev => {
      const updated = prev.map(c => c.claimID === claimId ? { ...c, status } : c);
      localStorage.setItem('wellbeing360_claims', JSON.stringify(updated));
      return updated;
    });
    setSuccessMsg(`Reimbursement claim #${claimId} status updated to ${status}!`);
  };

  // Calculations & Analytics metrics
  const defaultEmpShare = selectedReport?.totalEmployeeContribution || 14500;
  const defaultErShare = selectedReport?.totalEmployerContribution || 42000;

  // Filter queues
  const pendingPlans = benefitPlans.filter(p => p.status === 'Pending');
  const pendingChallenges = challenges.filter(c => c.status === 'Pending');
  
  // Enrolments matching Submitted/Pending checkout requests
  const pendingEnrolments = enrolments.filter(e => e.status === 'Submitted' || e.status === 'Pending');
  
  // Enrolments matching Approved/Active contexts
  const approvedEnrolments = enrolments.filter(e => e.status === 'Approved' || e.status === 'Active');

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      
      {/* Welcome banner */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl flex justify-between items-center shadow-slate-900/10">
        <div>
          <span className="text-[10px] uppercase bg-emerald-500 text-white font-extrabold px-3 py-1 rounded-full tracking-widest">Finance Executive</span>
          <h2 className="text-2xl font-black mt-3">Benefits Cost & approvals Hub</h2>
          <p className="text-xs text-slate-300 font-semibold mt-1">Audit premium distributions, configure eligibility splits, and process benefits approvals.</p>
        </div>
        <DollarSign className="text-emerald-500 w-12 h-12 shrink-0 hidden sm:block animate-pulse" />
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-0.5 overflow-x-auto scrollbar-none">
        {[
          { id: 'analytics', label: 'Reports & Budget' },
          { id: 'enrolments', label: 'Enrolments & Directory' },
          { id: 'plans', label: 'Benefit Plans approvals' },
          { id: 'challenges', label: 'Wellness Approvals' },
          { id: 'claims', label: 'Reimbursement Claims' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-5 py-3 font-bold text-sm capitalize border-b-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === tab.id 
                ? 'border-emerald-500 text-emerald-500' 
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: Analytics and compile reports */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Generate report controls & lists */}
          <div className="lg:col-span-5 space-y-8">
            <div className="groww-card p-6 bg-white">
              <h3 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-500" /> Compile Compliance Sheet
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Select Accounting Quarter</label>
                  <select 
                    value={financeQuarter}
                    onChange={(e) => setFinanceQuarter(e.target.value as any)}
                    className="custom-select"
                  >
                    <option value="Q1">Q1 Financials</option>
                    <option value="Q2">Q2 Financials</option>
                    <option value="Q3">Q3 Financials</option>
                    <option value="Q4">Q4 Financials</option>
                  </select>
                </div>

                <button 
                  onClick={handleGenerateReport}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs transition cursor-pointer shadow-lg shadow-emerald-500/10"
                >
                  Compile Report
                </button>
              </div>
            </div>

            <div className="groww-card p-6 bg-white">
              <h3 className="font-bold text-slate-800 text-lg mb-4">Generated Analytics Files</h3>
              <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
                {reports.length === 0 ? (
                  <p className="text-xs text-slate-400 py-6 text-center">No reports compiled yet.</p>
                ) : (
                  reports.map(rep => (
                    <button
                      key={rep.reportID}
                      onClick={() => setSelectedReport(rep)}
                      className={`w-full text-left p-3.5 border rounded-2xl flex flex-col gap-1 transition duration-200 cursor-pointer ${
                        selectedReport?.reportID === rep.reportID ? 'border-emerald-500 ring-2 ring-emerald-500/10 bg-emerald-50/10' : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex justify-between w-full font-bold text-slate-800 text-xs">
                        <span>Report #{rep.reportID}</span>
                        <span className="text-emerald-500">{rep.scope} scope</span>
                      </div>
                      <div className="flex justify-between w-full text-[10px] text-slate-400 font-semibold mt-1">
                        <span>Active Enrolments: {rep.activeEnrolmentCount}</span>
                        <span>Compiled: {new Date(rep.generatedDate).toLocaleDateString()}</span>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Analytics display */}
          <div className="lg:col-span-7 space-y-8">
            <div className="groww-card p-6 bg-white">
              <h3 className="font-bold text-slate-800 text-lg mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-500" /> Premium Allocation Snapshot
              </h3>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Active Enrolments</span>
                  <p className="text-2xl font-black text-slate-800 mt-1">{selectedReport?.activeEnrolmentCount || 0}</p>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Claims Utilization</span>
                  <p className="text-2xl font-black text-slate-800 mt-1">
                    ${reimbursementClaims.filter(c => c.status === 'Approved').reduce((acc, c) => acc + c.amount, 0).toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl mb-6">
                <h4 className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider">Quarterly Premium Shares</h4>
                <DonutChart employee={defaultEmpShare} employer={defaultErShare} />
              </div>

              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                <h4 className="text-xs font-bold text-slate-500 mb-4 uppercase tracking-wider">Dept Expense Breakdown</h4>
                <BarChart data={[
                  { label: 'Engineering & IT', value: 35000, color: '#00d09c' },
                  { label: 'Human Resources', value: 12000, color: '#5367ff' },
                  { label: 'Finance & Execs', value: 9500, color: '#eab308' },
                ]} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Enrolments approvals queue & Enrolled benefits directory */}
      {activeTab === 'enrolments' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Approvals list */}
          <div className="lg:col-span-5 space-y-6">
            <div className="groww-card p-6 bg-white">
              <h3 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Pending Enrolments approvals
              </h3>
              
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                {pendingEnrolments.length === 0 ? (
                  <p className="text-xs text-slate-400 py-8 text-center bg-slate-50 border border-slate-100 rounded-2xl">All submitted enrolments checkouts processed.</p>
                ) : (
                  pendingEnrolments.map(enrol => (
                    <div key={enrol.enrolmentID} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[9px] bg-slate-200 text-slate-600 font-extrabold px-2 py-0.5 rounded tracking-wide uppercase">Request #{enrol.enrolmentID}</span>
                          <h4 className="font-bold text-slate-800 text-sm mt-1.5 capitalize">User Context: ID {enrol.employeeID}</h4>
                        </div>
                        <span className="badge badge-pending">{enrol.status}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 font-semibold">
                        <span>Plan ID: <strong>Plan #{enrol.planID}</strong></span>
                        <span>Coverage: <strong>{enrol.coverageOption}</strong></span>
                        <span className="col-span-2">Effective Date: <strong>{new Date(enrol.effectiveDate).toLocaleDateString()}</strong></span>
                      </div>

                      <div className="flex gap-2 pt-2 border-t border-slate-200/60">
                        <button
                          onClick={() => handleApproveEnrolment(enrol.enrolmentID, 'Approved')}
                          className="flex-1 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg text-xs transition cursor-pointer flex items-center justify-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" /> Approve
                        </button>
                        <button
                          onClick={() => handleApproveEnrolment(enrol.enrolmentID, 'Rejected')}
                          className="flex-1 py-1.5 bg-slate-200 hover:bg-rose-50 hover:text-rose-600 border border-slate-300 hover:border-rose-200 text-slate-600 font-bold rounded-lg text-xs transition cursor-pointer flex items-center justify-center gap-1"
                        >
                          <X className="w-3.5 h-3.5" /> Reject
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Global enrolled directory */}
          <div className="lg:col-span-7 space-y-6">
            <div className="groww-card p-6 bg-white">
              <h3 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-500" /> Enrolled Benefits Directory
              </h3>
              
              <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-400 uppercase font-bold border-b border-slate-200 sticky top-0 z-10">
                      <th className="p-3">Teammate context</th>
                      <th className="p-3">Benefit Plan</th>
                      <th className="p-3">Deduction EE</th>
                      <th className="p-3">Option</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-600">
                    {approvedEnrolments.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-6 text-center text-slate-400 bg-slate-50">No enrolled directories active on catalog.</td>
                      </tr>
                    ) : (
                      approvedEnrolments.map(enrol => (
                        <tr key={enrol.enrolmentID}>
                          <td className="p-3 font-bold text-slate-800">User ID #{enrol.employeeID}</td>
                          <td className="p-3 font-semibold text-slate-700">Plan #{enrol.planID}</td>
                          <td className="p-3 font-extrabold text-slate-800">${enrol.employeeContributionAmount}/mo</td>
                          <td className="p-3 font-bold uppercase">{enrol.coverageOption}</td>
                          <td className="p-3">
                            <span className="badge badge-active">{enrol.status}</span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB 3: Benefit Plans approvals */}
      {activeTab === 'plans' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-8 space-y-6">
            <div className="groww-card p-6 bg-white">
              <h3 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-500" /> Benefit Plan approval Queue
              </h3>
              
              <div className="space-y-4">
                {pendingPlans.length === 0 ? (
                  <p className="text-xs text-slate-400 py-8 text-center bg-slate-50 border border-slate-100 rounded-2xl">No benefit plans currently pending financial approvals.</p>
                ) : (
                  pendingPlans.map(plan => (
                    <div key={plan.planID} className="p-5 border border-slate-200 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-slate-50 hover:border-slate-300 transition-all duration-200">
                      <div>
                        <span className="text-[9px] bg-slate-200 text-slate-600 font-extrabold px-2 py-0.5 rounded tracking-wide uppercase">{plan.planType}</span>
                        <h4 className="font-black text-slate-800 text-base mt-2">{plan.planName}</h4>
                        <div className="grid grid-cols-3 gap-4 mt-3 text-xs text-slate-500 font-semibold">
                          <span>Limit: <strong className="text-slate-800">${plan.coverageLimit.toLocaleString()}</strong></span>
                          <span>EE Cost: <strong className="text-slate-800">${plan.employeeContribution}/mo</strong></span>
                          <span>ER Split: <strong className="text-slate-800">${plan.employerContribution}/mo</strong></span>
                        </div>
                      </div>

                      <div className="flex gap-2 w-full md:w-auto shrink-0">
                        <button
                          onClick={() => handleApprovePlan(plan.planID, 'Active')}
                          className="flex-1 md:flex-none py-2 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs transition cursor-pointer flex items-center gap-1.5"
                        >
                          <Check className="w-4 h-4" /> Approve & Activate
                        </button>
                        <button
                          onClick={() => handleApprovePlan(plan.planID, 'Rejected')}
                          className="flex-1 md:flex-none py-2 px-4 bg-slate-200 hover:bg-rose-50 hover:text-rose-600 border border-slate-300 hover:border-rose-200 text-slate-600 font-bold rounded-xl text-xs transition cursor-pointer flex items-center gap-1.5"
                        >
                          <X className="w-4 h-4" /> Reject
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="groww-card p-6 bg-white">
              <h3 className="font-bold text-slate-800 text-base mb-4 flex items-center gap-1.5 text-slate-500">
                <ShieldAlert className="w-4 h-4 text-amber-500" /> Financial controls
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                New benefit insurance templates configured by HR Benefits Admin are compiled in this queue. Approving a plan automatically shifts its catalog status to <strong>Active</strong>, instantly launching it to all grade-eligible employees.
              </p>
            </div>
          </div>

        </div>
      )}

      {/* TAB 4: Wellness challenges approvals */}
      {activeTab === 'challenges' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-8 space-y-6">
            <div className="groww-card p-6 bg-white">
              <h3 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-500" /> Coordinator Challenge approvals
              </h3>
              
              <div className="space-y-4">
                {pendingChallenges.length === 0 ? (
                  <p className="text-xs text-slate-400 py-8 text-center bg-slate-50 border border-slate-100 rounded-2xl">No wellness challenges currently pending executive approvals.</p>
                ) : (
                  pendingChallenges.map(ch => (
                    <div key={ch.challengeID} className="p-5 border border-slate-200 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-slate-50 hover:border-slate-300 transition-all duration-200">
                      <div>
                        <span className="text-[9px] bg-slate-200 text-slate-600 font-extrabold px-2 py-0.5 rounded tracking-wide uppercase">{ch.activityType}</span>
                        <h4 className="font-black text-slate-800 text-base mt-2">{ch.challengeName}</h4>
                        <div className="grid grid-cols-3 gap-4 mt-3 text-xs text-slate-500 font-semibold">
                          <span>Target: <strong className="text-slate-800">{ch.dailyTarget.toLocaleString()}</strong></span>
                          <span>Duration: <strong className="text-slate-800">{ch.duration} days</strong></span>
                          <span>Wallet Reward: <strong className="text-emerald-500">+{ch.pointsPerCompletion} pts</strong></span>
                        </div>
                      </div>

                      <div className="flex gap-2 w-full md:w-auto shrink-0">
                        <button
                          onClick={() => handleApproveChallenge(ch.challengeID, 'Active')}
                          className="flex-1 md:flex-none py-2 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs transition cursor-pointer flex items-center gap-1.5"
                        >
                          <Check className="w-4 h-4" /> Approve
                        </button>
                        <button
                          onClick={() => handleApproveChallenge(ch.challengeID, 'Rejected')}
                          className="flex-1 md:flex-none py-2 px-4 bg-slate-200 hover:bg-rose-50 hover:text-rose-600 border border-slate-300 hover:border-rose-200 text-slate-600 font-bold rounded-xl text-xs transition cursor-pointer flex items-center gap-1.5"
                        >
                          <X className="w-4 h-4" /> Reject
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="groww-card p-6 bg-white">
              <h3 className="font-bold text-slate-800 text-base mb-4 flex items-center gap-1.5 text-slate-500">
                <ShieldAlert className="w-4 h-4 text-amber-500" /> Wellness Audit Notes
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Wellness challenges created by coordinators default to <strong>Pending</strong>. Review their daily metric targets and loyalty point values here. Approving a challenge schedules it for all employee logs dashboard instantly.
              </p>
            </div>
          </div>

        </div>
      )}

      {/* TAB 5: Reimbursement claims approvals */}
      {activeTab === 'claims' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-8 space-y-6">
            <div className="groww-card p-6 bg-white">
              <h3 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-500" /> Reimbursement Claim requests
              </h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-400 uppercase font-bold border-b border-slate-200">
                      <th className="p-3">Claim ID</th>
                      <th className="p-3">Employee Name</th>
                      <th className="p-3">Claim Details</th>
                      <th className="p-3">Value</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-600">
                    {reimbursementClaims.map(claim => (
                      <tr key={claim.claimID}>
                        <td className="p-3 font-bold text-slate-800">#{claim.claimID}</td>
                        <td className="p-3 font-semibold capitalize text-slate-700">{claim.employeeName}</td>
                        <td className="p-3">
                          <span className="font-semibold block">{claim.claimType}</span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase">Receipt: {claim.receiptRef}</span>
                        </td>
                        <td className="p-3 font-extrabold text-slate-800">${claim.amount.toFixed(2)}</td>
                        <td className="p-3">
                          <span className={`badge ${
                            claim.status === 'Approved' ? 'badge-active' : claim.status === 'Pending' ? 'badge-pending' : 'badge-error'
                          }`}>{claim.status}</span>
                        </td>
                        <td className="p-3 text-right">
                          {claim.status === 'Pending' ? (
                            <div className="flex justify-end gap-1.5">
                              <button
                                onClick={() => handleUpdateClaimStatus(claim.claimID, 'Approved')}
                                className="p-1 bg-emerald-50 text-emerald-500 hover:bg-emerald-500 hover:text-white border border-emerald-200 rounded-lg transition cursor-pointer"
                                title="Approve Claim"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleUpdateClaimStatus(claim.claimID, 'Rejected')}
                                className="p-1 bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white border border-rose-200 rounded-lg transition cursor-pointer"
                                title="Reject Claim"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-bold uppercase italic">Processed</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="groww-card p-6 bg-white">
              <h3 className="font-bold text-slate-800 text-base mb-4 flex items-center gap-1.5 text-slate-500">
                <ShieldAlert className="w-4 h-4 text-amber-500" /> Reimbursements Policy
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Employees can submit expense claims for third-party wellness merchandise or counselling. Approving a claim deducts from the general benefits budget and issues a notification to the employee.
              </p>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
