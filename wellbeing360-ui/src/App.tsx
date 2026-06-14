import React, { useState, useEffect } from 'react';
import { 
  User as UserIcon, Users, Shield, Heart, Award, DollarSign, Activity, 
  Calendar, Bell, Plus, Trash2, Check, Trophy, ShoppingBag, Gift, 
  FileText, Layers, RefreshCw, Star, MessageSquare, Search, Filter
} from 'lucide-react';
import { api, setCurrentUserId, getCurrentUserId, setAuthToken, getAuthToken } from './api';

// Interface types reflecting Core Entities
interface User {
  userID: number;
  employeeID: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  gradeID: string;
  departmentID: string;
  status: string;
}

interface BenefitPlan {
  planID: number;
  planName: string;
  planType: string;
  eligibilityGrade: string;
  employeeContribution: number;
  employerContribution: number;
  coverageLimit: number;
  effectiveDate: string;
  status: string;
}

interface FlexBenefitBucket {
  bucketID: number;
  planID: number;
  bucketName: string;
  annualAllowance: number;
  carryForwardAllowed: boolean;
  status: string;
}

interface EnrolmentWindow {
  windowID: number;
  planYear: number;
  openDate: string;
  closeDate: string;
  eligibleGrades: string;
  status: string;
}

interface BenefitEnrolment {
  enrolmentID: number;
  employeeID: number;
  planID: number;
  windowID: number;
  coverageOption: string;
  dependentsIncluded: boolean;
  employeeContributionAmount: number;
  effectiveDate: string;
  status: string;
}

interface Dependent {
  dependentID: number;
  employeeID: number;
  name: string;
  relationship: string;
  dateOfBirth: string;
  status: string;
}

interface WellnessProgram {
  programID: number;
  name: string;
  theme: string;
  startDate: string;
  endDate: string;
  pointsOnOffer: number;
  targetParticipation: number;
  status: string;
}

interface WellnessChallenge {
  challengeID: number;
  programID: number;
  challengeName: string;
  activityType: string;
  dailyTarget: number;
  duration: number;
  pointsPerCompletion: number;
  status: string;
}

interface ActivityLog {
  logID: number;
  challengeID: number;
  employeeID: number;
  logDate: string;
  activityValue: number;
  pointsEarned: number;
  status: string;
}

interface CoordinatorActivityLog {
  logID: number;
  employeeID: number;
  employeeName: string;
  challengeName: string;
  activityType: string;
  activityValue: number;
  pointsEarned: number;
  logDate: string;
  status: string;
}

interface EAPService {
  serviceID: number;
  serviceName: string;
  category: string;
  sessionsAllowedPerEmployee: number;
  status: string;
}

interface EAPSession {
  sessionID: number;
  employeeID: number;
  serviceID: number;
  requestedDate: string;
  sessionDate: string;
  counsellorRef: string;
  status: string;
}

interface RecognitionAward {
  awardID: number;
  nominatorID: number;
  recipientID: number;
  category: string;
  badgeName: string;
  pointsAwarded: number;
  message: string;
  awardDate: string;
  status: string;
}

interface RewardPoints {
  pointsID: number;
  employeeID: number;
  totalEarned: number;
  totalRedeemed: number;
  balance: number;
  lastUpdated: string;
}

interface RecognitionAwardResponse {
  awardID: number;
  nominatorName: string;
  recipientName: string;
  category: string;
  badgeName: string;
  pointsAwarded: number;
  message: string;
  awardDate: string;
  status: string;
}

interface EmployeePoints {
  pointsID: number;
  employeeID: number;
  employeeName: string;
  totalEarned: number;
  totalRedeemed: number;
  balance: number;
  lastUpdated: string;
}

interface RedemptionCatalog {
  itemID: number;
  itemName: string;
  category: string;
  pointsRequired: number;
  availableQuantity: number;
  status: string;
}

interface BenefitsReport {
  reportID: number;
  scope: string;
  metrics: string;
  generatedDate: string;
}

interface Notification {
  notificationID: number;
  userID: number;
  message: string;
  category: string;
  status: string;
  createdDate: string;
}

interface AuditLog {
  auditID: number;
  userID: number;
  action: string;
  module: string;
  timestamp: string;
}

// Confetti Effect Helper
const triggerConfetti = () => {
  // Disabled click animation effect as per request
};

export default function App() {
  // Global States
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  
  // Auth & View States
  const [view, setView] = useState<'app' | 'login' | 'register'>('login');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regRole, setRegRole] = useState('Employee');
  const [regGrade, setRegGrade] = useState('G3');
  const [regDept, setRegDept] = useState('IT');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [calcSteps, setCalcSteps] = useState(10000);

  // New Interactive Feature States
  const [comparedPlans, setComparedPlans] = useState<BenefitPlan[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ sender: 'user' | 'bot'; text: string }[]>([
    { sender: 'bot', text: 'Hello! I am your WellBeing360 Wellness Assistant. Ask me about your benefits, counselling, or reward points!' }
  ]);
  const [awardReactions, setAwardReactions] = useState<{
    [awardId: number]: { likes: number; claps: number; stars: number; userClicked: { [emoji: string]: boolean } }
  }>({});
  const [financeQuarter, setFinanceQuarter] = useState<'Q1' | 'Q2' | 'Q3' | 'Q4'>('Q4');

  // Employee Portal States
  const [plans, setPlans] = useState<BenefitPlan[]>([]);
  const [myEnrolments, setMyEnrolments] = useState<BenefitEnrolment[]>([]);
  const [currentWindow, setCurrentWindow] = useState<EnrolmentWindow | null>(null);
  const [selectedPlanForEnrol, setSelectedPlanForEnrol] = useState<BenefitPlan | null>(null);
  const [coverageOption, setCoverageOption] = useState<string>('EmployeeOnly');
  const [dependentsInput, setDependentsInput] = useState<{name: string, relationship: string, dob: string}[]>([]);
  const [myDependents, setMyDependents] = useState<Dependent[]>([]);
  
  const [wellnessPrograms, setWellnessPrograms] = useState<WellnessProgram[]>([]);
  const [activeProgId, setActiveProgId] = useState<number | null>(null);
  const [challenges, setChallenges] = useState<WellnessChallenge[]>([]);
  const [myActivityLogs, setMyActivityLogs] = useState<ActivityLog[]>([]);
  const [logActivityInput, setLogActivityInput] = useState<{challengeID: number, val: number}>({challengeID: 0, val: 0});
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  const [eapServices, setEapServices] = useState<EAPService[]>([]);
  const [mySessions, setMySessions] = useState<EAPSession[]>([]);
  const [bookingEapId, setBookingEapId] = useState<number>(0);
  const [bookingDate, setBookingDate] = useState<string>('');

  const [awardsReceived, setAwardsReceived] = useState<RecognitionAward[]>([]);
  const [pointsBalance, setPointsBalance] = useState<RewardPoints | null>(null);
  const [nominationInput, setNominationInput] = useState({recipientID: 0, category: 'PeerRecognition', badgeName: 'Collaborator Champion', points: 100, message: ''});
  const [catalogItems, setCatalogItems] = useState<RedemptionCatalog[]>([]);

  // HR Benefits Admin States
  const [newPlan, setNewPlan] = useState({planName: '', planType: 'GroupHealthInsurance', eligibilityGrade: 'All', employeeContribution: 50, employerContribution: 200, coverageLimit: 5000});
  const [newWindow, setNewWindow] = useState({planYear: 2026, openDate: '', closeDate: '', eligibleGrades: 'All'});

  // Wellness Coordinator States
  const [newProgram, setNewProgram] = useState({name: '', theme: 'Fitness', startDate: '', endDate: '', pointsOnOffer: 500, targetParticipation: 80});
  const [newChallenge, setNewChallenge] = useState({programID: 0, challengeName: '', activityType: 'Steps', dailyTarget: 10000, duration: 7, pointsPerCompletion: 100});
  const [allActivityLogs, setAllActivityLogs] = useState<CoordinatorActivityLog[]>([]);
  const [activitySearchQuery, setActivitySearchQuery] = useState('');
  const [activityTypeFilter, setActivityTypeFilter] = useState('All');

  // Finance Executive States
  const [allSessions, setAllSessions] = useState<EAPSession[]>([]);
  const [reports, setReports] = useState<BenefitsReport[]>([]);
  const [selectedReportMetrics, setSelectedReportMetrics] = useState<any | null>(null);

  // Recognition Manager States
  const [newCatalogItem, setNewCatalogItem] = useState({itemName: '', category: 'Voucher', pointsRequired: 500, availableQuantity: 50});
  const [allAwards, setAllAwards] = useState<RecognitionAwardResponse[]>([]);
  const [allPoints, setAllPoints] = useState<EmployeePoints[]>([]);
  const [recognitionTab, setRecognitionTab] = useState<'awards' | 'points' | 'catalog'>('awards');
  const [awardsSearchQuery, setAwardsSearchQuery] = useState('');
  const [awardsCategoryFilter, setAwardsCategoryFilter] = useState('All');
  const [pointsSearchQuery, setPointsSearchQuery] = useState('');
  const [catalogSearchQuery, setCatalogSearchQuery] = useState('');
  const [catalogFilter, setCatalogFilter] = useState('All');

  // Admin Control Center States
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [newUserForm, setNewUserForm] = useState({name: '', employeeID: '', email: '', role: 'Employee', gradeID: 'G3', departmentID: 'IT', phone: ''});

  // Load Initial Configuration and Demo Users
  useEffect(() => {
    async function loadDemoUsers() {
      try {
        const userList = await api.getUsers();
        setUsers(userList);
        
        // Restore session from localStorage
        const storedToken = localStorage.getItem('wellbeing360_token');
        const storedUserJson = localStorage.getItem('wellbeing360_user');
        if (storedToken && storedUserJson) {
          const user = JSON.parse(storedUserJson);
          setAuthToken(storedToken);
          setCurrentUser(user);
          setCurrentUserId(user.userID);
          setView('app');
        } else {
          setView('login');
        }
      } catch (err: any) {
        setApiError('Error connecting to backend API. Please make sure the .NET service is running on http://localhost:5201.');
      }
    }
    loadDemoUsers();
  }, []);

  // Sync state whenever the current user changes or triggers refresh
  useEffect(() => {
    if (!currentUser) return;
    setCurrentUserId(currentUser.userID);

    async function loadUserData() {
      try {
        setApiError(null);
        // Load in-app notifications
        const notes = await api.getNotifications();
        setNotifications(notes);

        // Portals data based on current user
        if (currentUser.role === 'Employee') {
          const plansList = await api.getPlans();
          setPlans(plansList);

          const myEnrols = await api.getMyEnrolments();
          setMyEnrolments(myEnrols);

          const windowObj = await api.getCurrentWindow().catch(() => null);
          setCurrentWindow(windowObj);

          const deps = await api.getMyDependents();
          setMyDependents(deps);

          const progs = await api.getWellnessPrograms();
          setWellnessPrograms(progs);
          const activeProg = progs.find(p => p.status === 'Active');
          if (activeProg) {
            setActiveProgId(activeProg.programID);
            const ch = await api.getChallenges(activeProg.programID);
            setChallenges(ch);
            const lb = await api.getLeaderboard(activeProg.programID);
            setLeaderboard(lb);
          }

          const logs = await api.getMyLogs();
          setMyActivityLogs(logs);

          const eap = await api.getEapServices();
          setEapServices(eap);

          const mySess = await api.getMySessions();
          setMySessions(mySess);

          const awards = await api.getMyAwardsReceived();
          setAwardsReceived(awards);

          const points = await api.getMyPoints();
          setPointsBalance(points);

          const cat = await api.getCatalog();
          setCatalogItems(cat);
        } else if (currentUser.role === 'HRBenefitsAdmin') {
          const plansList = await api.getPlans();
          setPlans(plansList);
          const windowsList = await api.getWindows();
          setEnrolmentWindows(windowsList);
        } else if (currentUser.role === 'WellnessCoordinator') {
          const progs = await api.getWellnessPrograms();
          setWellnessPrograms(progs);
          const logs = await api.getAllActivityLogs();
          setAllActivityLogs(logs);
        } else if (currentUser.role === 'Finance') {
          const sessList = await api.getAllSessions();
          setAllSessions(sessList);
          const repList = await api.getReports();
          setReports(repList);
          if (repList.length > 0) {
            try {
              setSelectedReportMetrics(JSON.parse(repList[0].metrics));
            } catch {}
          }
        } else if (currentUser.role === 'RecognitionManager') {
          const cat = await api.getCatalog();
          setCatalogItems(cat);
          const awList = await api.getAllAwards();
          setAllAwards(awList);
          const ptsList = await api.getAllPointsBalances();
          setAllPoints(ptsList);
        } else if (currentUser.role === 'Admin') {
          // Audit log list
          const uList = await api.getUsers();
          setAllUsers(uList);
          
          // Let's fetch some audit logs or create one
          const auditList = await requestRaw('reports/audit').catch(() => []);
          setAuditLogs(auditList);
        }
      } catch (err: any) {
        console.error(err);
      }
    }

    loadUserData();
  }, [currentUser, refreshTrigger]);

  const [enrolmentWindows, setEnrolmentWindows] = useState<EnrolmentWindow[]>([]);

  // Simple raw helper to fetch audit logs directly from db context via a report endpoint
  async function requestRaw(path: string) {
    const token = getAuthToken();
    const headers: Record<string, string> = {
      'X-User-Id': getCurrentUserId().toString()
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const res = await fetch(`http://localhost:5201/api/${path}`, {
      headers
    });
    if (!res.ok) return [];
    return res.json();
  }

  // Handle Switch User (Demo switcher)
  const handleUserChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = users.find(u => u.userID === parseInt(e.target.value));
    if (selected) {
      try {
        setApiError(null);
        const response = await api.login({ email: selected.email, password: 'password' });
        setAuthToken(response.token);
        localStorage.setItem('wellbeing360_user', JSON.stringify(response));
        setCurrentUser(response);
        setCurrentUserId(response.userID);
        setActiveTab('dashboard');
        showSuccess(`Switched session to ${response.name} (${response.role})`);
        triggerConfetti();
      } catch (err: any) {
        setApiError(err.message || 'Failed to switch user.');
      }
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setApiError(null);
      const response = await api.login({ email: loginEmail, password: loginPassword });
      setAuthToken(response.token);
      localStorage.setItem('wellbeing360_user', JSON.stringify(response));
      setCurrentUser(response);
      setCurrentUserId(response.userID);
      setView('app');
      showSuccess(`Logged in successfully as ${response.name}!`);
      triggerConfetti();
    } catch (err: any) {
      setApiError(err.message || 'Login failed.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setApiError(null);
      await api.register({
        name: regName,
        email: regEmail,
        password: regPassword,
        phone: regPhone,
        role: regRole,
        gradeID: regGrade,
        departmentID: regDept
      });
      showSuccess('Registration successful! You can now log in.');
      setView('login');
      setRegName('');
      setRegEmail('');
      setRegPassword('');
      setRegPhone('');
    } catch (err: any) {
      setApiError(err.message || 'Registration failed.');
    }
  };

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const triggerRefresh = () => setRefreshTrigger(prev => prev + 1);

  // Reaction handler for awards received
  const handleReact = (awardId: number, emoji: 'likes' | 'claps' | 'stars') => {
    setAwardReactions(prev => {
      const current = prev[awardId] || { likes: Math.abs(awardId % 5) + 3, claps: Math.abs(awardId % 3) + 1, stars: Math.abs(awardId % 4), userClicked: {} };
      const hasClicked = current.userClicked[emoji];
      return {
        ...prev,
        [awardId]: {
          ...current,
          [emoji]: hasClicked ? current[emoji] - 1 : current[emoji] + 1,
          userClicked: {
            ...current.userClicked,
            [emoji]: !hasClicked
          }
        }
      };
    });
    triggerConfetti();
  };

  // Dynamically calculate metrics based on selected finance quarter
  const getQuarterMetrics = () => {
    if (!selectedReportMetrics) return null;
    let multiplier = 1.0;
    if (financeQuarter === 'Q1') multiplier = 0.58;
    if (financeQuarter === 'Q2') multiplier = 0.72;
    if (financeQuarter === 'Q3') multiplier = 0.88;
    if (financeQuarter === 'Q4') multiplier = 1.0;

    return {
      enrolmentRate: Math.round(selectedReportMetrics.enrolmentRate * (multiplier * 0.95 + 0.05)),
      premiumCost: Math.round(selectedReportMetrics.premiumCost * multiplier),
      eapUtilisation: Math.round(selectedReportMetrics.eapUtilisation * multiplier),
      wellnessParticipation: Math.round(selectedReportMetrics.wellnessParticipation * multiplier),
      pointsRedeemed: Math.round(selectedReportMetrics.pointsRedeemed * multiplier),
    };
  };

  // Employee: Add dependent input row
  const addDependentInputRow = () => {
    setDependentsInput([...dependentsInput, { name: '', relationship: 'Spouse', dob: '' }]);
  };

  const removeDependentInputRow = (index: number) => {
    setDependentsInput(dependentsInput.filter((_, i) => i !== index));
  };

  const updateDependentInputRow = (index: number, field: string, value: string) => {
    const updated = [...dependentsInput];
    updated[index] = { ...updated[index], [field]: value };
    setDependentsInput(updated);
  };

  // Employee: Submit enrolment
  const handleEnrol = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlanForEnrol || !currentWindow) return;

    try {
      setApiError(null);
      await api.enrol({
        planID: selectedPlanForEnrol.planID,
        windowID: currentWindow.windowID,
        coverageOption,
        dependents: dependentsInput.map(d => ({
          name: d.name,
          relationship: d.relationship,
          dateOfBirth: new Date(d.dob).toISOString()
        }))
      });
      showSuccess(`Enrolment request for '${selectedPlanForEnrol.planName}' submitted!`);
      triggerConfetti();
      setSelectedPlanForEnrol(null);
      setDependentsInput([]);
      triggerRefresh();
    } catch (err: any) {
      setApiError(err.message);
    }
  };

  // Employee: Log Activity
  const handleLogActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!logActivityInput.challengeID || logActivityInput.val <= 0) {
      setApiError('Please select a challenge and input a valid target value.');
      return;
    }

    try {
      setApiError(null);
      await api.logActivity({
        challengeID: logActivityInput.challengeID,
        activityValue: logActivityInput.val,
        logDate: new Date().toISOString()
      });
      showSuccess('Wellness activity logged! Points updated.');
      triggerConfetti();
      setLogActivityInput({ challengeID: 0, val: 0 });
      triggerRefresh();
    } catch (err: any) {
      setApiError(err.message);
    }
  };

  // Employee: Book EAP counselling
  const handleBookEap = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingEapId || !bookingDate) {
      setApiError('Please select a service and session date.');
      return;
    }

    try {
      setApiError(null);
      await api.bookSession({
        serviceID: bookingEapId,
        sessionDate: new Date(bookingDate).toISOString()
      });
      showSuccess('Counselling session booked successfully.');
      triggerConfetti();
      setBookingDate('');
      triggerRefresh();
    } catch (err: any) {
      setApiError(err.message);
    }
  };

  // Employee: Nominate Peer
  const handleNominate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nominationInput.recipientID || !nominationInput.message) {
      setApiError('Please select a colleague and enter a nomination message.');
      return;
    }

    try {
      setApiError(null);
      await api.nominateAward({
        recipientID: nominationInput.recipientID,
        category: nominationInput.category,
        badgeName: nominationInput.badgeName,
        pointsAwarded: nominationInput.points,
        message: nominationInput.message
      });
      showSuccess('Nomination submitted! Your colleague has been rewarded.');
      triggerConfetti();
      setNominationInput({ recipientID: 0, category: 'PeerRecognition', badgeName: 'Collaborator Champion', points: 100, message: '' });
      triggerRefresh();
    } catch (err: any) {
      setApiError(err.message);
    }
  };

  // Employee: Redeem Item
  const handleRedeem = async (itemId: number) => {
    try {
      setApiError(null);
      await api.redeemItem(itemId);
      showSuccess('Item redeemed successfully! Notification sent.');
      triggerConfetti();
      triggerRefresh();
    } catch (err: any) {
      setApiError(err.message);
    }
  };

  // HR Benefits: Create Plan
  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setApiError(null);
      await api.createPlan({
        ...newPlan,
        effectiveDate: new Date().toISOString(),
        status: 'Active'
      });
      showSuccess(`Benefit Plan '${newPlan.planName}' configured successfully.`);
      setNewPlan({ planName: '', planType: 'GroupHealthInsurance', eligibilityGrade: 'All', employeeContribution: 50, employerContribution: 200, coverageLimit: 5000 });
      triggerRefresh();
    } catch (err: any) {
      setApiError(err.message);
    }
  };

  // HR Benefits: Create Window
  const handleCreateWindow = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setApiError(null);
      await api.createWindow({
        planYear: newWindow.planYear,
        openDate: new Date(newWindow.openDate).toISOString(),
        closeDate: new Date(newWindow.closeDate).toISOString(),
        eligibleGrades: newWindow.eligibleGrades,
        status: 'Open'
      });
      showSuccess('New Enrolment Window opened successfully.');
      setNewWindow({ planYear: 2026, openDate: '', closeDate: '', eligibleGrades: 'All' });
      triggerRefresh();
    } catch (err: any) {
      setApiError(err.message);
    }
  };

  // Wellness Coordinator: Create Program
  const handleCreateProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setApiError(null);
      await api.createWellnessProgram({
        ...newProgram,
        startDate: new Date(newProgram.startDate).toISOString(),
        endDate: new Date(newProgram.endDate).toISOString(),
        status: 'Active'
      });
      showSuccess(`Wellness program '${newProgram.name}' created.`);
      setNewProgram({ name: '', theme: 'Fitness', startDate: '', endDate: '', pointsOnOffer: 500, targetParticipation: 80 });
      triggerRefresh();
    } catch (err: any) {
      setApiError(err.message);
    }
  };

  // Wellness Coordinator: Create Challenge
  const handleCreateChallenge = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setApiError(null);
      await api.createChallenge({
        ...newChallenge,
        status: 'Active'
      });
      showSuccess(`Challenge '${newChallenge.challengeName}' added.`);
      setNewChallenge({ programID: 0, challengeName: '', activityType: 'Steps', dailyTarget: 10000, duration: 7, pointsPerCompletion: 100 });
      triggerRefresh();
    } catch (err: any) {
      setApiError(err.message);
    }
  };

  // Recognition Manager: Create Reward Item
  const handleCreateCatalogItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setApiError(null);
      await api.createCatalogItem({
        ...newCatalogItem,
        status: 'Available'
      });
      showSuccess(`Catalog Item '${newCatalogItem.itemName}' added.`);
      setNewCatalogItem({ itemName: '', category: 'Voucher', pointsRequired: 500, availableQuantity: 50 });
      triggerRefresh();
    } catch (err: any) {
      setApiError(err.message);
    }
  };

  // Finance Executive: Approve/Schedule Session
  const handleUpdateSession = async (sessionId: number, status: string, counsellor: string) => {
    try {
      setApiError(null);
      await api.updateSessionStatus(sessionId, status, counsellor);
      showSuccess(`Session status updated to ${status}.`);
      triggerRefresh();
    } catch (err: any) {
      setApiError(err.message);
    }
  };

  // Finance Executive: Generate Report
  const handleGenerateReport = async () => {
    try {
      setApiError(null);
      const rep = await api.generateReport('Company');
      showSuccess('System utilization and coverage report generated.');
      setReports([rep, ...reports]);
      setSelectedReportMetrics(JSON.parse(rep.metrics));
    } catch (err: any) {
      setApiError(err.message);
    }
  };

  // Admin Control Center: Create User
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setApiError(null);
      await api.createUser({
        ...newUserForm,
        status: 'Active'
      });
      showSuccess(`User profile for '${newUserForm.name}' created successfully.`);
      setNewUserForm({ name: '', employeeID: '', email: '', role: 'Employee', gradeID: 'G3', departmentID: 'IT', phone: '' });
      triggerRefresh();
    } catch (err: any) {
      setApiError(err.message);
    }
  };

  // Dismiss notification
  const handleReadNotification = async (id: number) => {
    try {
      await api.markNotificationRead(id);
      setNotifications(notifications.filter(n => n.notificationID !== id));
    } catch {}
  };

  if (view === 'login') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-app px-4 relative overflow-hidden">
        
        
        <div className="max-w-md w-full glass-panel p-8 border-glass relative z-10 animate-fade-in">
          {/* Logo Section */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-black border border-glass flex items-center justify-center mx-auto mb-4">
              <Layers className="text-white w-6 h-6" />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-black font-heading">
              WellBeing<span className="text-secondary">360</span>
            </h1>
            <p className="text-xs uppercase tracking-widest text-foreground-dim font-bold mt-1">Benefits & Wellness Portal</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-5">
            {apiError && (
              <div className="p-3  border border-error bg-error/15 text-error text-xs">
                {apiError}
              </div>
            )}
            {successMsg && (
              <div className="p-3  border border-success bg-success/15 text-success text-xs">
                {successMsg}
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-foreground-muted block mb-1">Email Address</label>
              <input 
                type="email" 
                required 
                placeholder="name@wellbeing360.com" 
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="custom-input"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground-muted block mb-1">Password</label>
              <input 
                type="password" 
                required 
                placeholder="••••••••" 
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="custom-input"
              />
            </div>



            <button type="submit" className="w-full py-3  font-bold text-sm gradient-btn transition-all">
              Login to Account
            </button>
          </form>

          {/* Registration Redirect */}
          <div className="text-center mt-6 pt-4 border-t border-glass">
            <p className="text-xs text-foreground-dim">
              New to the portal?{' '}
              <button 
                onClick={() => {
                  setView('register');
                  setApiError(null);
                  setSuccessMsg(null);
                }} 
                className="text-secondary font-bold hover:underline bg-transparent border-none cursor-pointer"
              >
                Register Employee Account
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'register') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-app px-4 py-12 relative overflow-hidden">
        

        <div className="max-w-lg w-full glass-panel p-8 border-glass relative z-10 animate-fade-in">
          {/* Logo Section */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-black border border-glass flex items-center justify-center mx-auto mb-4">
              <Layers className="text-white w-6 h-6" />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-black font-heading">
              Register <span className="text-secondary">Profile</span>
            </h1>
            <p className="text-xs uppercase tracking-widest text-foreground-dim font-bold mt-1">WellBeing360 Employee Registration</p>
          </div>

          {/* Form */}
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            {apiError && (
              <div className="p-3  border border-error bg-error/15 text-error text-xs">
                {apiError}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-foreground-muted block mb-1">Full Name</label>
                <input 
                  type="text" 
                  required 
                  placeholder="Gopinath Subramanian" 
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="custom-input"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground-muted block mb-1">Email Address</label>
                <input 
                  type="email" 
                  required 
                  placeholder="gopinath@example.com" 
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="custom-input"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-foreground-muted block mb-1">Password</label>
                <input 
                  type="password" 
                  required 
                  placeholder="••••••••" 
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="custom-input"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground-muted block mb-1">Phone Number</label>
                <input 
                  type="text" 
                  placeholder="1234567890" 
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  className="custom-input"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-xs font-semibold text-foreground-muted block mb-1">Role Type</label>
                <select 
                  value={regRole} 
                  onChange={(e) => setRegRole(e.target.value)}
                  className="custom-select"
                >
                  <option value="Employee">Employee</option>
                  <option value="HRBenefitsAdmin">HR Benefits Admin</option>
                  <option value="Finance">Finance Executive</option>
                  <option value="WellnessCoordinator">Wellness Coordinator</option>
                  <option value="RecognitionManager">Recognition Manager</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground-muted block mb-1">Eligibility Grade</label>
                <select 
                  value={regGrade} 
                  onChange={(e) => setRegGrade(e.target.value)}
                  className="custom-select"
                >
                  <option value="G1">G1</option>
                  <option value="G2">G2</option>
                  <option value="G3">G3</option>
                  <option value="G4">G4</option>
                  <option value="G5">G5</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground-muted block mb-1">Department</label>
                <select 
                  value={regDept} 
                  onChange={(e) => setRegDept(e.target.value)}
                  className="custom-select"
                >
                  <option value="IT">IT</option>
                  <option value="HR">HR</option>
                  <option value="Finance">Finance</option>
                  <option value="Executive">Executive</option>
                </select>
              </div>
            </div>

            <button type="submit" className="w-full py-3 mt-4  font-bold text-sm gradient-btn transition-all">
              Register Account
            </button>
          </form>

          {/* Login Redirect */}
          <div className="text-center mt-6 pt-4 border-t border-glass">
            <p className="text-xs text-foreground-dim">
              Already have an account?{' '}
              <button 
                onClick={() => {
                  setView('login');
                  setApiError(null);
                  setSuccessMsg(null);
                }} 
                className="text-secondary font-bold hover:underline bg-transparent border-none cursor-pointer"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-app">
      {/* 1. Header / Navigation Bar */}
      <header className="border-b border-glass bg-card backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black flex items-center justify-center border border-glass">
              <Layers className="text-foreground w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold font-heading tracking-tight text-black">WellBeing<span className="text-secondary">360</span></h1>
              <p className="text-[10px] uppercase tracking-widest text-foreground-dim font-semibold">Benefits & Wellness Portal</p>
            </div>
          </div>

          {/* Central Mode Switcher for demo ease of testing */}
          {currentUser?.role === 'Admin' && (
            <div className="flex items-center gap-3 glass-panel px-4 py-2 border-glass">
              <span className="text-xs text-foreground-muted font-medium flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 text-secondary" /> Act As:
              </span>
              <select 
                value={currentUser?.userID || ''} 
                onChange={handleUserChange}
                className="bg-transparent text-xs font-semibold text-black border-none outline-none cursor-pointer"
              >
                {users.map(u => (
                  <option key={u.userID} value={u.userID} className="bg-app text-black">
                    {u.name} ({u.role})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* User profile & Notifications bell */}
          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2.5  border border-glass hover:bg-card-hover transition relative"
              >
                <Bell className="w-5 h-5 text-foreground-muted" />
                {notifications.some(n => n.status === 'Unread') && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-accent  animate-ping"></span>
                )}
              </button>

              {/* Notification Popover */}
              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 glass-panel p-4 z-50 border-glass">
                  <div className="flex justify-between items-center mb-3 pb-2 border-b border-glass">
                    <h3 className="font-heading font-semibold text-sm">Notifications</h3>
                    <span className="text-xs text-foreground-dim">{notifications.length} Unread</span>
                  </div>
                  <div className="space-y-2.5 max-h-60 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-foreground-dim text-center py-4">No new alerts.</p>
                    ) : (
                      notifications.map(n => (
                        <div key={n.notificationID} className="p-2.5  bg-card-hover hover:bg-glass border border-glass flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-bold text-secondary uppercase tracking-wider">{n.category}</span>
                            <p className="text-xs text-foreground mt-0.5">{n.message}</p>
                          </div>
                          <button onClick={() => handleReadNotification(n.notificationID)} className="text-foreground-dim hover:text-foreground">
                            <Check className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Tag */}
            <div className="flex items-center gap-3 pl-4 border-l border-glass">
              <div className="w-9 h-9 bg-black flex items-center justify-center border border-glass text-white font-bold">
                {currentUser?.name.substring(0, 2).toUpperCase()}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-semibold text-black">{currentUser?.name}</p>
                <span className="text-xs text-foreground-muted">{currentUser?.role}</span>
              </div>
              <button
                onClick={() => {
                  setAuthToken('');
                  localStorage.removeItem('wellbeing360_token');
                  localStorage.removeItem('wellbeing360_user');
                  setCurrentUser(null);
                  setCurrentUserId(0);
                  setView('login');
                }}
                className="ml-2 px-3 py-1.5  border border-glass text-xs font-semibold text-foreground-muted hover:text-black hover:bg-card-hover transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        {/* Error / Success Toast Banner */}
        {apiError && (
          <div className="mb-6 p-4  border border-error bg-error/10 text-error text-sm flex items-center gap-2 animate-fade-in">
            <Shield className="w-5 h-5 shrink-0" />
            <p>{apiError}</p>
          </div>
        )}
        {successMsg && (
          <div className="mb-6 p-4  border border-success bg-success/10 text-success text-sm flex items-center gap-2 animate-fade-in">
            <Check className="w-5 h-5 shrink-0" />
            <p>{successMsg}</p>
          </div>
        )}

        {/* 2. Employee Dashboard View */}
        {currentUser?.role === 'Employee' && (
          <div className="space-y-8 animate-fade-in">
            {/* Header section with current User details */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-3xl font-bold font-heading text-black">Welcome Back, <span className="gradient-text">{currentUser.name}</span></h2>
                <p className="text-foreground-muted">Grade: <span className="text-black font-semibold">{currentUser.gradeID}</span> | Dept: <span className="text-black font-semibold">{currentUser.departmentID}</span> | Email: <span className="text-black font-semibold">{currentUser.email}</span></p>
              </div>
              {/* Point Indicator */}
              <div className="flex items-center gap-3.5 glass-panel p-4 border-glass pr-6">
                <div className="w-12 h-12 bg-black flex items-center justify-center border border-glass">
                  <Gift className="text-white w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs text-foreground-dim uppercase tracking-wider font-semibold">Points Balance</span>
                  <p className="text-2xl font-bold font-heading text-black">{pointsBalance?.balance || 0} <span className="text-xs text-foreground-muted font-normal">pts</span></p>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-2 border-b border-glass pb-0.5 overflow-x-auto">
              {['dashboard', 'benefits', 'wellness', 'counselling', 'rewards'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-3 font-heading font-semibold text-sm capitalize border-b-2 transition-all ${
                    activeTab === tab 
                      ? 'border-primary text-primary' 
                      : 'border-transparent text-foreground-muted hover:text-foreground'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* TAB: General Dashboard */}
            {activeTab === 'dashboard' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Card 1: Active Insurance */}
                  <div className="glass-panel p-6 border-glass">
                    <Heart className="w-8 h-8 text-accent mb-4" />
                    <h3 className="font-heading font-semibold text-lg text-black mb-2">My Enrolled Benefits</h3>
                    {myEnrolments.length === 0 ? (
                      <p className="text-sm text-foreground-muted">No active enrolments. Visit the Benefits tab to enroll.</p>
                    ) : (
                      <div className="space-y-3">
                        {myEnrolments.map(e => (
                          <div key={e.enrolmentID} className="flex justify-between items-center text-xs">
                            <span className="text-black font-medium">Plan ID: {e.planID}</span>
                            <span className="badge badge-active">{e.status}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Card 2: Upcoming Counselling */}
                  <div className="glass-panel p-6 border-glass">
                    <Calendar className="w-8 h-8 text-secondary mb-4" />
                    <h3 className="font-heading font-semibold text-lg text-black mb-2">EAP Booking Schedule</h3>
                    {mySessions.filter(s => s.status !== 'Cancelled').length === 0 ? (
                      <p className="text-sm text-foreground-muted">No counselling sessions scheduled. Book a private advisor in the Counselling tab.</p>
                    ) : (
                      <div className="space-y-3">
                        {mySessions.filter(s => s.status !== 'Cancelled').slice(0, 2).map(s => (
                          <div key={s.sessionID} className="text-xs">
                            <div className="flex justify-between items-center">
                              <span className="text-black font-semibold">Counselling Session #{s.sessionID}</span>
                              <span className="badge badge-pending">{s.status}</span>
                            </div>
                            <p className="text-foreground-muted mt-1">Date: {new Date(s.sessionDate).toLocaleDateString()}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Card 3: Recent Activity */}
                  <div className="glass-panel p-6 border-glass">
                    <Activity className="w-8 h-8 text-primary mb-4" />
                    <h3 className="font-heading font-semibold text-lg text-black mb-2">Wellness Logging</h3>
                    {myActivityLogs.length === 0 ? (
                      <p className="text-sm text-foreground-muted">No activity logs recorded. Sync your logs in the Wellness tab.</p>
                    ) : (
                      <div className="space-y-3">
                        {myActivityLogs.slice(0, 3).map(l => (
                          <div key={l.logID} className="flex justify-between items-center text-xs">
                            <span className="text-black">Log #{l.logID}</span>
                            <span className="text-secondary font-bold">+{l.pointsEarned} pts</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Leaderboard Summary and Awards Received */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Leaderboard Panel */}
                  <div className="glass-panel p-6 border-glass">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-heading font-semibold text-lg text-black flex items-center gap-2">
                        <Trophy className="text-warning w-5 h-5" /> Challenge Leaderboard
                      </h3>
                      <span className="text-xs text-foreground-dim">Active Program</span>
                    </div>
                    <div className="space-y-3">
                      {leaderboard.slice(0, 4).map((entry, index) => (
                        <div key={entry.employeeID} className="flex items-center justify-between p-2.5  bg-card-hover border border-glass">
                          <div className="flex items-center gap-3">
                            <span className={`w-6 h-6  flex items-center justify-center text-xs font-bold ${index === 0 ? 'bg-warning text-app' : 'bg-glass text-black'}`}>{index + 1}</span>
                            <span className="text-sm font-semibold">{entry.employeeName}</span>
                          </div>
                          <span className="text-sm text-primary font-bold">{entry.totalPoints} pts</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recognition Panel */}
                  <div className="glass-panel p-6 border-glass">
                    <h3 className="font-heading font-semibold text-lg text-black mb-4 flex items-center gap-2">
                      <Award className="text-accent w-5 h-5" /> Recognition & Badge Wall
                    </h3>
                    <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                      {awardsReceived.length === 0 ? (
                        <p className="text-sm text-foreground-muted">No badges received yet. Keep up the great work and inspire your team!</p>
                      ) : (
                        awardsReceived.map(aw => {
                          const react = awardReactions[aw.awardID] || { likes: Math.abs(aw.awardID % 5) + 3, claps: Math.abs(aw.awardID % 3) + 1, stars: Math.abs(aw.awardID % 4), userClicked: {} };
                          return (
                            <div key={aw.awardID} className="p-3  bg-card-hover border border-glass flex items-start gap-3">
                              <div className="w-10 h-10 shrink-0  bg-accent/20 flex items-center justify-center border border-accent">
                                <Star className="text-accent w-5 h-5" />
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between items-start">
                                  <h4 className="text-sm font-bold text-black">{aw.badgeName}</h4>
                                  <span className="text-xs text-secondary font-bold">+{aw.pointsAwarded} pts</span>
                                </div>
                                <p className="text-xs text-foreground-muted mt-1">"{aw.message}"</p>
                                <span className="text-[10px] text-foreground-dim mt-2 block">Awarded on {new Date(aw.awardDate).toLocaleDateString()}</span>
                                
                                {/* Emoji Reactions Bar */}
                                <div className="flex gap-2 mt-3 pt-2 border-t border-glass/20">
                                  <button 
                                    onClick={() => handleReact(aw.awardID, 'likes')}
                                    className={`text-[10px] flex items-center gap-1.5 px-2.5 py-1  border transition-all ${
                                      react.userClicked['likes'] 
                                        ? 'bg-accent/10 border-accent text-accent' 
                                        : 'bg-glass border-glass/40 text-foreground-muted hover:text-black hover:bg-glass'
                                    }`}
                                  >
                                    ❤️ {react.likes}
                                  </button>
                                  <button 
                                    onClick={() => handleReact(aw.awardID, 'claps')}
                                    className={`text-[10px] flex items-center gap-1.5 px-2.5 py-1  border transition-all ${
                                      react.userClicked['claps'] 
                                        ? 'bg-secondary/10 border-secondary text-secondary' 
                                        : 'bg-glass border-glass/40 text-foreground-muted hover:text-black hover:bg-glass'
                                    }`}
                                  >
                                    👏 {react.claps}
                                  </button>
                                  <button 
                                    onClick={() => handleReact(aw.awardID, 'stars')}
                                    className={`text-[10px] flex items-center gap-1.5 px-2.5 py-1  border transition-all ${
                                      react.userClicked['stars'] 
                                        ? 'bg-warning/10 border-warning text-warning' 
                                        : 'bg-glass border-glass/40 text-foreground-muted hover:text-black hover:bg-glass'
                                    }`}
                                  >
                                    ⭐ {react.stars}
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: Benefits Wizard */}
            {activeTab === 'benefits' && (
              <div className="space-y-8">
                {currentWindow ? (
                  <div className="p-5  border border-secondary bg-secondary/5 flex justify-between items-center">
                    <div>
                      <h3 className="font-heading font-semibold text-base text-black">Benefits Open Enrolment Window Open</h3>
                      <p className="text-xs text-foreground-muted">Plan Year {currentWindow.planYear} | Close Date: {new Date(currentWindow.closeDate).toLocaleDateString()}</p>
                    </div>
                    <span className="badge badge-active">Active Window</span>
                  </div>
                ) : (
                  <div className="p-5  border border-glass bg-card/40">
                    <p className="text-sm text-foreground-muted">The benefits open enrolment window is currently closed. Changes are only permitted during open window periods.</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Available plans */}
                  <div className="space-y-4">
                    <h3 className="font-heading font-bold text-xl text-black">Available Catalog Plans</h3>
                    <div className="space-y-4">
                      {plans.map(plan => {
                        const isEligible = plan.eligibilityGrade === 'All' || plan.eligibilityGrade.split(',').includes(currentUser.gradeID);
                        return (
                          <div key={plan.planID} className={`p-5  border glass-panel ${selectedPlanForEnrol?.planID === plan.planID ? 'border-primary' : 'border-glass'}`}>
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="text-[10px] uppercase tracking-widest text-secondary font-bold">{plan.planType}</span>
                                <h4 className="font-heading font-bold text-lg text-black mt-1">{plan.planName}</h4>
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                {isEligible ? (
                                  <span className="badge badge-active text-[10px]">Eligible</span>
                                ) : (
                                  <span className="badge badge-error text-[10px]">Ineligible (Requires {plan.eligibilityGrade})</span>
                                )}
                                <label className="flex items-center gap-1.5 cursor-pointer text-[10px] text-foreground-dim hover:text-foreground">
                                  <input 
                                    type="checkbox"
                                    checked={comparedPlans.some(p => p.planID === plan.planID)}
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
                                    className="w-3.5 h-3.5 accent-secondary bg-glass border-glass "
                                  />
                                  <span>Compare</span>
                                </label>
                              </div>
                            </div>
                            <div className="grid grid-cols-3 gap-2 mt-4 text-xs">
                              <div>
                                <span className="text-foreground-dim block">Employee Pay</span>
                                <span className="text-black font-semibold">${plan.employeeContribution}/mo</span>
                              </div>
                              <div>
                                <span className="text-foreground-dim block">Employer Pay</span>
                                <span className="text-black font-semibold">${plan.employerContribution}/mo</span>
                              </div>
                              <div>
                                <span className="text-foreground-dim block">Limit</span>
                                <span className="text-black font-semibold">${plan.coverageLimit}</span>
                              </div>
                            </div>
                            {currentWindow && isEligible && (
                              <button 
                                onClick={() => setSelectedPlanForEnrol(plan)}
                                className="mt-4 w-full py-2  text-xs font-semibold gradient-btn"
                              >
                                Select & Configure Enrolment
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Enrolment checkout / Dependent additions */}
                  <div className="glass-panel p-6 border-glass h-fit">
                    <h3 className="font-heading font-bold text-xl text-black mb-4">Configure Enrolment</h3>
                    {selectedPlanForEnrol ? (
                      <form onSubmit={handleEnrol} className="space-y-4">
                        <div>
                          <label className="text-xs text-foreground-muted block mb-1">Selected Plan</label>
                          <input type="text" readOnly value={selectedPlanForEnrol.planName} className="custom-input bg-glass" />
                        </div>
                        <div>
                          <label className="text-xs text-foreground-muted block mb-1">Coverage Option</label>
                          <select value={coverageOption} onChange={(e) => setCoverageOption(e.target.value)} className="custom-select">
                            <option value="EmployeeOnly">Employee Only</option>
                            <option value="EmployeeSpouse">Employee + Spouse</option>
                            <option value="Family">Family Coverage</option>
                          </select>
                        </div>

                        {/* Dependents list */}
                        {coverageOption !== 'EmployeeOnly' && (
                          <div className="space-y-3 border-t border-glass pt-4 mt-4">
                            <div className="flex justify-between items-center">
                              <h4 className="text-xs font-bold text-black uppercase tracking-wider">Dependents</h4>
                              <button type="button" onClick={addDependentInputRow} className="text-xs text-secondary flex items-center gap-1 hover:underline">
                                <Plus className="w-3.5 h-3.5" /> Add Dependent
                              </button>
                            </div>
                            {dependentsInput.map((dep, idx) => (
                              <div key={idx} className="grid grid-cols-12 gap-2 items-end">
                                <div className="col-span-5">
                                  <input 
                                    type="text" 
                                    placeholder="Full Name" 
                                    required 
                                    value={dep.name} 
                                    onChange={(e) => updateDependentInputRow(idx, 'name', e.target.value)}
                                    className="custom-input py-1.5 text-xs" 
                                  />
                                </div>
                                <div className="col-span-3">
                                  <select 
                                    value={dep.relationship} 
                                    onChange={(e) => updateDependentInputRow(idx, 'relationship', e.target.value)}
                                    className="custom-select py-1.5 text-xs"
                                  >
                                    <option value="Spouse">Spouse</option>
                                    <option value="Child">Child</option>
                                    <option value="Parent">Parent</option>
                                  </select>
                                </div>
                                <div className="col-span-3">
                                  <input 
                                    type="date" 
                                    required 
                                    value={dep.dob} 
                                    onChange={(e) => updateDependentInputRow(idx, 'dob', e.target.value)}
                                    className="custom-input py-1.5 text-xs" 
                                  />
                                </div>
                                <div className="col-span-1 text-center">
                                  <button type="button" onClick={() => removeDependentInputRow(idx)} className="text-error hover:text-red-400 p-1">
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        <button type="submit" className="w-full py-3 mt-6  font-semibold gradient-btn">
                          Submit Enrolment Request
                        </button>
                      </form>
                    ) : (
                      <p className="text-sm text-foreground-muted">Select an eligible plan from the left to start configuring your health coverage and register dependents.</p>
                    )}
                  </div>
                </div>

                {/* Floating Bottom Compare Bar */}
                {comparedPlans.length > 0 && (
                  <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 glass-panel border border-primary p-4 flex items-center justify-between gap-6 shadow-2xl animate-fade-in bg-app/95 backdrop-blur-xl max-w-2xl w-full">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-black uppercase tracking-wider font-heading">Plan Compare:</span>
                      <div className="flex gap-2">
                        {comparedPlans.map(p => (
                          <span key={p.planID} className="text-[10px] bg-secondary/10 border border-secondary px-2.5 py-1  text-secondary font-bold font-heading">{p.planName}</span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setShowCompareModal(true)} 
                        className="py-1.5 px-4  text-xs font-bold gradient-btn shrink-0"
                      >
                        Compare Now
                      </button>
                      <button 
                        onClick={() => setComparedPlans([])} 
                        className="text-xs text-foreground-dim hover:text-foreground px-2 py-1  hover:bg-glass"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                )}

                {/* Plan Comparison Modal Overlay */}
                {showCompareModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
                    <div className="max-w-4xl w-full glass-panel border-primary overflow-hidden flex flex-col shadow-2xl max-h-[90vh] bg-app/95">
                      {/* Modal Header */}
                      <div className="p-5 border-b border-glass flex justify-between items-center bg-card">
                        <div>
                          <h3 className="text-xl font-bold font-heading text-black">Compare Benefit Plans</h3>
                          <p className="text-xs text-foreground-muted">Side-by-side analysis of employee and employer costs, coverage limits, and eligibility.</p>
                        </div>
                        <button 
                          onClick={() => setShowCompareModal(false)}
                          className="w-8 h-8 bg-glass border border-glass flex items-center justify-center text-black hover:border-primary transition"
                        >
                          ✕
                        </button>
                      </div>

                      {/* Modal Grid Content */}
                      <div className="flex-1 overflow-auto p-6">
                        <div className="grid grid-cols-4 gap-4 border-b border-glass pb-4 text-xs font-bold uppercase text-foreground-dim tracking-wider">
                          <div>Attributes</div>
                          {comparedPlans.map(p => (
                            <div key={p.planID} className="text-black font-heading text-sm font-black text-center">{p.planName}</div>
                          ))}
                          {/* Pad empty columns if less than 3 plans */}
                          {Array.from({ length: 3 - comparedPlans.length }).map((_, i) => (
                            <div key={i} className="text-foreground-dim text-center">&mdash;</div>
                          ))}
                        </div>

                        <div className="divide-y divide-glass/40 text-xs">
                          {/* Plan Type Row */}
                          <div className="grid grid-cols-4 gap-4 py-4 items-center">
                            <div className="font-semibold text-foreground-muted">Plan Type</div>
                            {comparedPlans.map(p => (
                              <div key={p.planID} className="text-center font-bold text-secondary">{p.planType}</div>
                            ))}
                            {Array.from({ length: 3 - comparedPlans.length }).map((_, i) => (
                              <div key={i} className="text-center text-foreground-dim">&mdash;</div>
                            ))}
                          </div>

                          {/* Employee Pay Row */}
                          <div className="grid grid-cols-4 gap-4 py-4 items-center">
                            <div className="font-semibold text-foreground-muted">Employee Contribution</div>
                            {comparedPlans.map(p => (
                              <div key={p.planID} className="text-center font-black text-black">${p.employeeContribution}/mo</div>
                            ))}
                            {Array.from({ length: 3 - comparedPlans.length }).map((_, i) => (
                              <div key={i} className="text-center text-foreground-dim">&mdash;</div>
                            ))}
                          </div>

                          {/* Employer Pay Row */}
                          <div className="grid grid-cols-4 gap-4 py-4 items-center">
                            <div className="font-semibold text-foreground-muted">Employer Contribution</div>
                            {comparedPlans.map(p => (
                              <div key={p.planID} className="text-center font-black text-black">${p.employerContribution}/mo</div>
                            ))}
                            {Array.from({ length: 3 - comparedPlans.length }).map((_, i) => (
                              <div key={i} className="text-center text-foreground-dim">&mdash;</div>
                            ))}
                          </div>

                          {/* Coverage Limit Row */}
                          <div className="grid grid-cols-4 gap-4 py-4 items-center">
                            <div className="font-semibold text-foreground-muted">Coverage Limit</div>
                            {comparedPlans.map(p => (
                              <div key={p.planID} className="text-center font-black text-accent text-sm">${p.coverageLimit.toLocaleString()}</div>
                            ))}
                            {Array.from({ length: 3 - comparedPlans.length }).map((_, i) => (
                              <div key={i} className="text-center text-foreground-dim">&mdash;</div>
                            ))}
                          </div>

                          {/* Grade Eligibility Row */}
                          <div className="grid grid-cols-4 gap-4 py-4 items-center">
                            <div className="font-semibold text-foreground-muted">Grade Eligibility</div>
                            {comparedPlans.map(p => (
                              <div key={p.planID} className="text-center font-medium text-black">{p.eligibilityGrade}</div>
                            ))}
                            {Array.from({ length: 3 - comparedPlans.length }).map((_, i) => (
                              <div key={i} className="text-center text-foreground-dim">&mdash;</div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Modal Footer */}
                      <div className="p-4 border-t border-glass bg-glass/20 flex justify-end">
                        <button 
                          onClick={() => setShowCompareModal(false)}
                          className="py-2 px-5  text-xs font-semibold gradient-btn"
                        >
                          Close Comparison
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB: Wellness challenges */}
            {activeTab === 'wellness' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Programs selection */}
                  <div className="glass-panel p-6 border-glass md:col-span-1">
                    <h3 className="font-heading font-bold text-lg text-black mb-4">Wellness Programs</h3>
                    <div className="space-y-3">
                      {wellnessPrograms.map(p => (
                        <button
                          key={p.programID}
                          onClick={() => {
                            setActiveProgId(p.programID);
                            api.getChallenges(p.programID).then(setChallenges);
                            api.getLeaderboard(p.programID).then(setLeaderboard);
                          }}
                          className={`w-full text-left p-3.5  border transition-all ${
                            activeProgId === p.programID 
                              ? 'border-primary bg-primary/5' 
                              : 'border-glass bg-card-hover hover:bg-glass'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <h4 className="text-sm font-bold text-black">{p.name}</h4>
                            <span className={`badge ${p.status === 'Active' ? 'badge-active' : 'badge-pending'}`}>{p.status}</span>
                          </div>
                          <span className="text-[10px] text-foreground-dim mt-2 block">Theme: {p.theme} | Points on Offer: {p.pointsOnOffer}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Challenges listing & Logger */}
                  <div className="glass-panel p-6 border-glass md:col-span-2 space-y-6">
                    <div className="flex justify-between items-center border-b border-glass pb-4">
                      <h3 className="font-heading font-bold text-lg text-black">Challenges & Logging</h3>
                      <span className="text-xs text-foreground-muted">Active Challenges</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Active challenges list */}
                      <div className="space-y-3">
                        {challenges.length === 0 ? (
                          <p className="text-xs text-foreground-dim">Select a program to view active challenges.</p>
                        ) : (
                          challenges.map(c => (
                            <div key={c.challengeID} className="p-4  bg-card-hover border border-glass">
                              <h4 className="font-bold text-sm text-black">{c.challengeName}</h4>
                              <p className="text-xs text-foreground-muted mt-1">Activity: <span className="text-secondary font-semibold">{c.activityType}</span></p>
                              <div className="flex justify-between items-center mt-3 text-xs">
                                <span className="text-foreground-dim">Daily Target: {c.dailyTarget}</span>
                                <span className="text-primary font-bold">+{c.pointsPerCompletion} pts</span>
                              </div>
                              <button 
                                onClick={() => setLogActivityInput({ challengeID: c.challengeID, val: c.dailyTarget })}
                                className="mt-3 w-full py-1.5  bg-glass border border-glass hover:border-primary text-[10px] font-semibold text-black transition-all"
                              >
                                Select Challenge to Log
                              </button>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Log form */}
                      <div className="p-5  border border-glass bg-glass/20 h-fit">
                        <h4 className="font-heading font-bold text-sm text-black mb-3">Record Activity Log</h4>
                        {logActivityInput.challengeID > 0 ? (
                          <form onSubmit={handleLogActivity} className="space-y-4">
                            <div>
                              <label className="text-[10px] uppercase text-foreground-muted block mb-1">Challenge ID</label>
                              <input type="text" readOnly value={`Challenge #${logActivityInput.challengeID}`} className="custom-input py-2 text-xs bg-glass" />
                            </div>
                            <div>
                              <label className="text-[10px] uppercase text-foreground-muted block mb-1">Value Accomplished</label>
                              <input 
                                type="number" 
                                required 
                                value={logActivityInput.val} 
                                onChange={(e) => setLogActivityInput({ ...logActivityInput, val: parseFloat(e.target.value) })}
                                className="custom-input py-2 text-xs" 
                              />
                            </div>
                            <button type="submit" className="w-full py-2.5  text-xs font-semibold gradient-btn">
                              Submit Log & Claim Points
                            </button>
                          </form>
                        ) : (
                          <p className="text-xs text-foreground-dim">Select a challenge to submit your self-reported activity logs and unlock milestone points.</p>
                        )}
                      </div>

                      {/* Points & Calories Calculator Widget */}
                      <div className="p-5  border border-glass bg-glass/20 h-fit space-y-4">
                        <h4 className="font-heading font-bold text-sm text-black flex items-center gap-1.5">
                          <Activity className="text-secondary w-4 h-4" /> Points & Calories Calculator
                        </h4>
                        
                        {/* Dynamic Radial Progress SVG */}
                        <div className="flex flex-col items-center py-2">
                          <div className="relative w-28 h-28 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90">
                              {/* Background Circle */}
                              <circle 
                                cx="56" 
                                cy="56" 
                                r="46" 
                                className="stroke-glass fill-transparent" 
                                strokeWidth="6"
                              />
                              {/* Glowing Foreground Progress Circle */}
                              <circle 
                                cx="56" 
                                cy="56" 
                                r="46" 
                                className="stroke-secondary fill-transparent transition-all duration-300 ease-out" 
                                strokeWidth="6"
                                strokeDasharray={2 * Math.PI * 46}
                                strokeDashoffset={2 * Math.PI * 46 * (1 - Math.min(1, calcSteps / 10000))}
                                strokeLinecap="round"
                              />
                            </svg>
                            <div className="absolute flex flex-col items-center justify-center text-center">
                              <span className="text-lg font-black text-black font-heading">{Math.round((calcSteps / 10000) * 100)}%</span>
                              <span className="text-[8px] uppercase tracking-wider text-foreground-dim font-bold">Goal Reach</span>
                            </div>
                          </div>
                          {calcSteps >= 10000 ? (
                            <span className="mt-2 text-[10px] text-success font-extrabold tracking-wider bg-success/15 border border-success/30 px-2 py-0.5  animate-bounce">
                              Daily Goal Achieved! 🏆
                            </span>
                          ) : (
                            <span className="mt-2 text-[10px] text-foreground-muted font-medium">
                              Target: 10,000 steps
                            </span>
                          )}
                        </div>

                        <p className="text-[11px] text-foreground-muted">Drag the slider to estimate points and calorie burn based on step count.</p>
                        <div className="space-y-3">
                          <div>
                            <label className="text-[10px] uppercase text-foreground-muted flex justify-between">
                              <span>Steps:</span>
                              <span className="text-secondary font-bold">{calcSteps.toLocaleString()} steps</span>
                            </label>
                            <input 
                              type="range" 
                              min="1000" 
                              max="20000" 
                              step="500" 
                              value={calcSteps} 
                              onChange={(e) => {
                                const val = parseInt(e.target.value);
                                setCalcSteps(val);
                                if (val === 10000 || val === 20000) {
                                  triggerConfetti();
                                }
                              }}
                              className="w-full accent-primary bg-glass h-1.5  appearance-none cursor-pointer"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3 pt-2 text-center">
                            <div className="p-2.5  bg-card-hover border border-glass">
                              <span className="text-[9px] uppercase tracking-wider text-foreground-dim block">Est. Calories</span>
                              <span className="text-sm font-bold text-black">{Math.round(calcSteps * 0.04)} kcal</span>
                            </div>
                            <div className="p-2.5  bg-card-hover border border-glass">
                              <span className="text-[9px] uppercase tracking-wider text-foreground-dim block">Milestone Points</span>
                              <span className="text-sm font-bold text-primary">+{Math.round(calcSteps / 100)} pts</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: Counselling */}
            {activeTab === 'counselling' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Service selection */}
                  <div className="space-y-4">
                    <h3 className="font-heading font-bold text-xl text-black">Employee Assistance Services</h3>
                    <div className="grid grid-cols-1 gap-4">
                      {eapServices.map(s => (
                        <div key={s.serviceID} className="p-5  border border-glass glass-panel flex justify-between items-start">
                          <div>
                            <span className="text-[10px] uppercase tracking-widest text-secondary font-bold">{s.category}</span>
                            <h4 className="font-heading font-bold text-base text-black mt-1">{s.serviceName}</h4>
                            <p className="text-xs text-foreground-muted mt-2">Maximum sessions per employee: <span className="text-black font-semibold">{s.sessionsAllowedPerEmployee}</span></p>
                          </div>
                          <button 
                            onClick={() => { setBookingEapId(s.serviceID); setBookingDate(''); }}
                            className="py-1.5 px-4  text-xs font-semibold gradient-btn"
                          >
                            Book
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Booking Panel */}
                  <div className="glass-panel p-6 border-glass h-fit">
                    <h3 className="font-heading font-bold text-xl text-black mb-4">Book Confidential Session</h3>
                    {bookingEapId ? (
                      <form onSubmit={handleBookEap} className="space-y-4">
                        <div>
                          <label className="text-xs text-foreground-muted block mb-1">Selected Service</label>
                          <input 
                            type="text" 
                            readOnly 
                            value={eapServices.find(s => s.serviceID === bookingEapId)?.serviceName || ''} 
                            className="custom-input bg-glass" 
                          />
                        </div>
                        <div>
                          <label className="text-xs text-foreground-muted block mb-1">Preferred Appointment Date</label>
                          <input 
                            type="datetime-local" 
                            required 
                            value={bookingDate} 
                            onChange={(e) => setBookingDate(e.target.value)}
                            className="custom-input" 
                          />
                        </div>
                        <button type="submit" className="w-full py-3 mt-4  font-semibold gradient-btn">
                          Confirm Appointment Booking
                        </button>
                      </form>
                    ) : (
                      <p className="text-sm text-foreground-muted">Select an EAP service from the left. All sessions are confidential and logged securely.</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: Rewards */}
            {activeTab === 'rewards' && (
              <div className="space-y-8">
                {/* Send nomination */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="glass-panel p-6 border-glass md:col-span-1">
                    <h3 className="font-heading font-bold text-lg text-black mb-4">Peer-to-Peer Recognition</h3>
                    <form onSubmit={handleNominate} className="space-y-4">
                      <div>
                        <label className="text-xs text-foreground-muted block mb-1">Colleague</label>
                        <select 
                          value={nominationInput.recipientID} 
                          onChange={(e) => setNominationInput({ ...nominationInput, recipientID: parseInt(e.target.value) })}
                          className="custom-select"
                        >
                          <option value="0">Select Colleague...</option>
                          {users.filter(u => u.userID !== currentUser.userID && u.role === 'Employee').map(u => (
                            <option key={u.userID} value={u.userID}>{u.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-foreground-muted block mb-1">Badge Category</label>
                        <select 
                          value={nominationInput.category} 
                          onChange={(e) => setNominationInput({ ...nominationInput, category: e.target.value })}
                          className="custom-select"
                        >
                          <option value="PeerRecognition">Peer Recognition</option>
                          <option value="ManagerNomination">Manager Nomination</option>
                          <option value="InnovationAward">Innovation Award</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-foreground-muted block mb-1">Badge Name</label>
                        <select 
                          value={nominationInput.badgeName} 
                          onChange={(e) => setNominationInput({ ...nominationInput, badgeName: e.target.value })}
                          className="custom-select"
                        >
                          <option value="Collaborator Champion">Collaborator Champion</option>
                          <option value="Velocity Vector">Velocity Vector</option>
                          <option value="Deep Diver">Deep Diver</option>
                          <option value="Problem Solver">Problem Solver</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-foreground-muted block mb-1">Reward points</label>
                        <input 
                          type="number" 
                          min="10" 
                          max="500" 
                          value={nominationInput.points} 
                          onChange={(e) => setNominationInput({ ...nominationInput, points: parseInt(e.target.value) })}
                          className="custom-input" 
                        />
                      </div>
                      <div>
                        <label className="text-xs text-foreground-muted block mb-1">Message</label>
                        <textarea 
                          required 
                          rows={3} 
                          value={nominationInput.message} 
                          placeholder="Why are you nominating them?"
                          onChange={(e) => setNominationInput({ ...nominationInput, message: e.target.value })}
                          className="custom-textarea text-xs"
                        />
                      </div>
                      <button type="submit" className="w-full py-3  font-semibold gradient-btn">
                        Award Badge & Points
                      </button>
                    </form>
                  </div>

                  {/* Redeem Catalog */}
                  <div className="glass-panel p-6 border-glass md:col-span-2 space-y-6">
                    <h3 className="font-heading font-bold text-lg text-black">Redemption Catalog Store</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {catalogItems.map(item => (
                        <div key={item.itemID} className="p-4  bg-card-hover border border-glass flex justify-between items-center">
                          <div>
                            <span className="text-[10px] text-accent uppercase tracking-wider font-bold">{item.category}</span>
                            <h4 className="font-heading font-bold text-sm text-black mt-0.5">{item.itemName}</h4>
                            <p className="text-xs text-primary font-bold mt-1">{item.pointsRequired} pts</p>
                            <span className="text-[10px] text-foreground-dim mt-1.5 block">Quantity: {item.availableQuantity}</span>
                          </div>
                          <button
                            onClick={() => handleRedeem(item.itemID)}
                            disabled={item.availableQuantity <= 0 || (pointsBalance?.balance || 0) < item.pointsRequired}
                            className={`py-1.5 px-4  text-xs font-semibold ${
                              item.availableQuantity <= 0 || (pointsBalance?.balance || 0) < item.pointsRequired
                                ? 'bg-glass text-foreground-dim cursor-not-allowed'
                                : 'gradient-btn'
                            }`}
                          >
                            Redeem
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 3. HR Benefits Admin Console */}
        {currentUser?.role === 'HRBenefitsAdmin' && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <h2 className="text-3xl font-bold font-heading text-black">HR Benefits <span className="gradient-text">Console</span></h2>
              <p className="text-foreground-muted">Configure benefits catalog, plan eligibility rules, and manage open enrolment windows.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Configure Plan Form */}
              <div className="glass-panel p-6 border-glass">
                <h3 className="font-heading font-bold text-xl text-black mb-4 flex items-center gap-2">
                  <Plus className="text-secondary" /> Add New Benefit Plan
                </h3>
                <form onSubmit={handleCreatePlan} className="space-y-4">
                  <div>
                    <label className="text-xs text-foreground-muted block mb-1">Plan Name</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g. Platinum Health Plus" 
                      value={newPlan.planName}
                      onChange={(e) => setNewPlan({ ...newPlan, planName: e.target.value })}
                      className="custom-input" 
                    />
                  </div>
                  <div>
                    <label className="text-xs text-foreground-muted block mb-1">Plan Type</label>
                    <select 
                      value={newPlan.planType} 
                      onChange={(e) => setNewPlan({ ...newPlan, planType: e.target.value })}
                      className="custom-select"
                    >
                      <option value="GroupHealthInsurance">Group Health Insurance</option>
                      <option value="LifeCover">Life Cover</option>
                      <option value="DentalVision">Dental & Vision</option>
                      <option value="FlexibleBenefit">Flexible Benefit</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-foreground-muted block mb-1">Eligibility Grades (comma separated)</label>
                    <input 
                      type="text" 
                      placeholder="All or G3,G4,G5" 
                      value={newPlan.eligibilityGrade}
                      onChange={(e) => setNewPlan({ ...newPlan, eligibilityGrade: e.target.value })}
                      className="custom-input" 
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-xs text-foreground-muted block mb-1">Employee Pay</label>
                      <input 
                        type="number" 
                        value={newPlan.employeeContribution}
                        onChange={(e) => setNewPlan({ ...newPlan, employeeContribution: parseFloat(e.target.value) })}
                        className="custom-input" 
                      />
                    </div>
                    <div>
                      <label className="text-xs text-foreground-muted block mb-1">Employer Pay</label>
                      <input 
                        type="number" 
                        value={newPlan.employerContribution}
                        onChange={(e) => setNewPlan({ ...newPlan, employerContribution: parseFloat(e.target.value) })}
                        className="custom-input" 
                      />
                    </div>
                    <div>
                      <label className="text-xs text-foreground-muted block mb-1">Limit</label>
                      <input 
                        type="number" 
                        value={newPlan.coverageLimit}
                        onChange={(e) => setNewPlan({ ...newPlan, coverageLimit: parseFloat(e.target.value) })}
                        className="custom-input" 
                      />
                    </div>
                  </div>
                  <button type="submit" className="w-full py-3  font-semibold gradient-btn">
                    Save Benefit Plan
                  </button>
                </form>
              </div>

              {/* Open Enrolment Window Form */}
              <div className="glass-panel p-6 border-glass">
                <h3 className="font-heading font-bold text-xl text-black mb-4 flex items-center gap-2">
                  <Calendar className="text-primary" /> Manage Open Enrolment Window
                </h3>
                <form onSubmit={handleCreateWindow} className="space-y-4">
                  <div>
                    <label className="text-xs text-foreground-muted block mb-1">Plan Year</label>
                    <input 
                      type="number" 
                      value={newWindow.planYear}
                      onChange={(e) => setNewWindow({ ...newWindow, planYear: parseInt(e.target.value) })}
                      className="custom-input" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-foreground-muted block mb-1">Open Date</label>
                      <input 
                        type="date" 
                        required 
                        value={newWindow.openDate}
                        onChange={(e) => setNewWindow({ ...newWindow, openDate: e.target.value })}
                        className="custom-input" 
                      />
                    </div>
                    <div>
                      <label className="text-xs text-foreground-muted block mb-1">Close Date</label>
                      <input 
                        type="date" 
                        required 
                        value={newWindow.closeDate}
                        onChange={(e) => setNewWindow({ ...newWindow, closeDate: e.target.value })}
                        className="custom-input" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-foreground-muted block mb-1">Eligible Grades</label>
                    <input 
                      type="text" 
                      placeholder="All or G1,G2" 
                      value={newWindow.eligibleGrades}
                      onChange={(e) => setNewWindow({ ...newWindow, eligibleGrades: e.target.value })}
                      className="custom-input" 
                    />
                  </div>
                  <button type="submit" className="w-full py-3  font-semibold gradient-btn">
                    Activate Enrolment Window
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* 4. Wellness Coordinator Dashboard */}
        {currentUser?.role === 'WellnessCoordinator' && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <h2 className="text-3xl font-bold font-heading text-black">Wellness Coordinator <span className="gradient-text">Dashboard</span></h2>
              <p className="text-foreground-muted">Design and manage wellness challenges, track participation, and award completions.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Create program */}
              <div className="glass-panel p-6 border-glass">
                <h3 className="font-heading font-bold text-xl text-black mb-4 flex items-center gap-2">
                  <Heart className="text-accent" /> Create Wellness Program
                </h3>
                <form onSubmit={handleCreateProgram} className="space-y-4">
                  <div>
                    <label className="text-xs text-foreground-muted block mb-1">Program Name</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g. Q3 Summer Step Up" 
                      value={newProgram.name}
                      onChange={(e) => setNewProgram({ ...newProgram, name: e.target.value })}
                      className="custom-input" 
                    />
                  </div>
                  <div>
                    <label className="text-xs text-foreground-muted block mb-1">Theme</label>
                    <select 
                      value={newProgram.theme} 
                      onChange={(e) => setNewProgram({ ...newProgram, theme: e.target.value })}
                      className="custom-select"
                    >
                      <option value="Fitness">Fitness & Cardio</option>
                      <option value="Nutrition">Nutrition & Diet</option>
                      <option value="MentalHealth">Mental Health & Focus</option>
                      <option value="Preventive">Preventive Screenings</option>
                      <option value="WorkLifeBalance">Work-Life Balance</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-foreground-muted block mb-1">Start Date</label>
                      <input 
                        type="date" 
                        required 
                        value={newProgram.startDate}
                        onChange={(e) => setNewProgram({ ...newProgram, startDate: e.target.value })}
                        className="custom-input" 
                      />
                    </div>
                    <div>
                      <label className="text-xs text-foreground-muted block mb-1">End Date</label>
                      <input 
                        type="date" 
                        required 
                        value={newProgram.endDate}
                        onChange={(e) => setNewProgram({ ...newProgram, endDate: e.target.value })}
                        className="custom-input" 
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-foreground-muted block mb-1">Points Offered</label>
                      <input 
                        type="number" 
                        value={newProgram.pointsOnOffer}
                        onChange={(e) => setNewProgram({ ...newProgram, pointsOnOffer: parseInt(e.target.value) })}
                        className="custom-input" 
                      />
                    </div>
                    <div>
                      <label className="text-xs text-foreground-muted block mb-1">Target Participation %</label>
                      <input 
                        type="number" 
                        value={newProgram.targetParticipation}
                        onChange={(e) => setNewProgram({ ...newProgram, targetParticipation: parseInt(e.target.value) })}
                        className="custom-input" 
                      />
                    </div>
                  </div>
                  <button type="submit" className="w-full py-3  font-semibold gradient-btn">
                    Create Program
                  </button>
                </form>
              </div>

              {/* Create Challenge */}
              <div className="glass-panel p-6 border-glass">
                <h3 className="font-heading font-bold text-xl text-black mb-4 flex items-center gap-2">
                  <Activity className="text-secondary" /> Add Challenge to Program
                </h3>
                <form onSubmit={handleCreateChallenge} className="space-y-4">
                  <div>
                    <label className="text-xs text-foreground-muted block mb-1">Select Program</label>
                    <select 
                      value={newChallenge.programID} 
                      onChange={(e) => setNewChallenge({ ...newChallenge, programID: parseInt(e.target.value) })}
                      className="custom-select"
                    >
                      <option value="0">Select Program...</option>
                      {wellnessPrograms.map(p => (
                        <option key={p.programID} value={p.programID}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-foreground-muted block mb-1">Challenge Name</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g. 5K Steps/Day" 
                      value={newChallenge.challengeName}
                      onChange={(e) => setNewChallenge({ ...newChallenge, challengeName: e.target.value })}
                      className="custom-input" 
                    />
                  </div>
                  <div>
                    <label className="text-xs text-foreground-muted block mb-1">Activity Type</label>
                    <select 
                      value={newChallenge.activityType} 
                      onChange={(e) => setNewChallenge({ ...newChallenge, activityType: e.target.value })}
                      className="custom-select"
                    >
                      <option value="Steps">Steps Count</option>
                      <option value="Meditation">Meditation Minutes</option>
                      <option value="WaterIntake">Water (glasses)</option>
                      <option value="SleepLog">Sleep (hours)</option>
                      <option value="NutritionTrack">Nutrition Intake</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-xs text-foreground-muted block mb-1">Daily Target</label>
                      <input 
                        type="number" 
                        value={newChallenge.dailyTarget}
                        onChange={(e) => setNewChallenge({ ...newChallenge, dailyTarget: parseInt(e.target.value) })}
                        className="custom-input" 
                      />
                    </div>
                    <div>
                      <label className="text-xs text-foreground-muted block mb-1">Duration (days)</label>
                      <input 
                        type="number" 
                        value={newChallenge.duration}
                        onChange={(e) => setNewChallenge({ ...newChallenge, duration: parseInt(e.target.value) })}
                        className="custom-input" 
                      />
                    </div>
                    <div>
                      <label className="text-xs text-foreground-muted block mb-1">Completion Pts</label>
                      <input 
                        type="number" 
                        value={newChallenge.pointsPerCompletion}
                        onChange={(e) => setNewChallenge({ ...newChallenge, pointsPerCompletion: parseInt(e.target.value) })}
                        className="custom-input" 
                      />
                    </div>
                  </div>
                  <button type="submit" className="w-full py-3  font-semibold gradient-btn">
                    Save Challenge
                  </button>
                </form>
              </div>
            </div>

            {/* Activity Log Dashboard Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-panel p-5 border-glass">
                <span className="text-[10px] text-foreground-dim uppercase tracking-wider font-bold">Total Logs Tracked</span>
                <p className="text-3xl font-bold font-heading text-black mt-1">{allActivityLogs.length}</p>
                <span className="text-[10px] text-foreground-muted mt-1 block">
                  {allActivityLogs.filter(log => {
                    const query = activitySearchQuery.toLowerCase().trim();
                    const matchesSearch = log.employeeName.toLowerCase().includes(query) || log.challengeName.toLowerCase().includes(query);
                    const matchesType = activityTypeFilter === 'All' || log.activityType === activityTypeFilter;
                    return matchesSearch && matchesType;
                  }).length} matching filters
                </span>
              </div>
              <div className="glass-panel p-5 border-glass">
                <span className="text-[10px] text-foreground-dim uppercase tracking-wider font-bold">Total Points Distributed</span>
                <p className="text-3xl font-bold font-heading text-secondary mt-1">
                  +{allActivityLogs.reduce((sum, l) => sum + l.pointsEarned, 0)} pts
                </p>
                <span className="text-[10px] text-foreground-muted mt-1 block">Across all challenges</span>
              </div>
              <div className="glass-panel p-5 border-glass">
                <span className="text-[10px] text-foreground-dim uppercase tracking-wider font-bold">Verified Logs Rate</span>
                <p className="text-3xl font-bold font-heading text-success mt-1">
                  {allActivityLogs.length > 0 
                    ? Math.round((allActivityLogs.filter(l => l.status === 'Verified').length / allActivityLogs.length) * 100) 
                    : 100}%
                </p>
                <span className="text-[10px] text-foreground-muted mt-1 block">Instant verification active</span>
              </div>
            </div>

            {/* Employee Activity Log History */}
            <div className="glass-panel p-6 border-glass">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                  <h3 className="font-heading font-bold text-lg text-black">Employee Challenge Submissions</h3>
                  <p className="text-xs text-foreground-dim mt-0.5">Real-time log of active wellness challenge participations</p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                  {/* Search Bar */}
                  <div className="relative flex-1 sm:flex-initial">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-foreground-dim pointer-events-none" />
                    <input 
                      type="text"
                      placeholder="Search employee or challenge..."
                      value={activitySearchQuery}
                      onChange={(e) => setActivitySearchQuery(e.target.value)}
                      className="custom-input pl-9 text-xs py-2 w-full sm:w-64"
                    />
                  </div>

                  {/* Filter Dropdown */}
                  <div className="relative flex-1 sm:flex-initial flex items-center">
                    <Filter className="absolute left-3 h-4 w-4 text-foreground-dim pointer-events-none" />
                    <select
                      value={activityTypeFilter}
                      onChange={(e) => setActivityTypeFilter(e.target.value)}
                      className="custom-select pl-9 text-xs py-2 pr-8 w-full sm:w-48 appearance-none bg-no-repeat bg-right"
                    >
                      <option value="All">All Activities</option>
                      <option value="Steps">Steps Count</option>
                      <option value="Meditation">Meditation Minutes</option>
                      <option value="WaterIntake">Water Intake</option>
                      <option value="SleepLog">Sleep Hours</option>
                      <option value="NutritionTrack">Nutrition Intake</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Table rendering */}
              <div className="table-container">
                {(() => {
                  const filtered = allActivityLogs.filter(log => {
                    const query = activitySearchQuery.toLowerCase().trim();
                    const matchesSearch = 
                      log.employeeName.toLowerCase().includes(query) || 
                      log.challengeName.toLowerCase().includes(query) ||
                      (log.employeeID && log.employeeID.toString().includes(query));
                    const matchesType = activityTypeFilter === 'All' || log.activityType === activityTypeFilter;
                    return matchesSearch && matchesType;
                  });

                  if (filtered.length === 0) {
                    return (
                      <div className="text-center py-8 text-foreground-muted text-sm bg-card-hover border border-dashed border-glass/40">
                        No activity logs match your search or filters.
                      </div>
                    );
                  }

                  return (
                    <table className="custom-table">
                      <thead>
                        <tr>
                          <th>Log ID</th>
                          <th>Employee</th>
                          <th>Challenge Name</th>
                          <th>Activity Type</th>
                          <th>Value Tracked</th>
                          <th>Points Distributed</th>
                          <th>Date Logged</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.map(log => {
                          let badgeClass = "badge-primary";
                          if (log.activityType === 'Steps') badgeClass = "badge-active";
                          else if (log.activityType === 'Meditation') badgeClass = "badge-secondary";
                          else if (log.activityType === 'WaterIntake') badgeClass = "badge-pending";
                          else if (log.activityType === 'SleepLog') badgeClass = "badge-error";
                          
                          return (
                            <tr key={log.logID} className="hover:bg-card-hover transition-colors">
                              <td className="text-black font-semibold">#{log.logID}</td>
                              <td>
                                <div className="font-medium text-black">{log.employeeName}</div>
                                <div className="text-[10px] text-foreground-muted">ID: {log.employeeID}</div>
                              </td>
                              <td>{log.challengeName}</td>
                              <td>
                                <span className={`badge ${badgeClass}`}>{log.activityType}</span>
                              </td>
                              <td className="text-black font-bold">
                                {log.activityValue} {log.activityType === 'Steps' ? 'steps' : log.activityType === 'Meditation' ? 'mins' : log.activityType === 'WaterIntake' ? 'glasses' : log.activityType === 'SleepLog' ? 'hrs' : 'logs'}
                              </td>
                              <td className="text-secondary font-bold">+{log.pointsEarned} pts</td>
                              <td>{new Date(log.logDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                              <td>
                                <span className="badge badge-active">{log.status}</span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  );
                })()}
              </div>
            </div>
          </div>
        )}

        {/* 5. Finance Executive View */}
        {currentUser?.role === 'Finance' && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold font-heading text-black">Finance Executive <span className="gradient-text">Console</span></h2>
                <p className="text-foreground-muted">Track premium costs, manage reimbursement claims/EAP sessions, and monitor benefits spend.</p>
              </div>
              <button onClick={handleGenerateReport} className="py-2.5 px-5  font-semibold gradient-btn flex items-center gap-2">
                <FileText className="w-4 h-4" /> Run Analytics Report
              </button>
            </div>

            {/* Financial metrics display */}
            {selectedReportMetrics && (() => {
              const metrics = getQuarterMetrics();
              if (!metrics) return null;
              return (
                <div className="space-y-6">
                  {/* Quarter selection tabs */}
                  <div className="flex justify-end gap-2">
                    {(['Q1', 'Q2', 'Q3', 'Q4'] as const).map(q => (
                      <button
                        key={q}
                        onClick={() => {
                          setFinanceQuarter(q);
                          triggerConfetti();
                        }}
                        className={`px-3 py-1.5  text-xs font-semibold border transition-all ${
                          financeQuarter === q 
                            ? 'bg-secondary/15 border-secondary text-secondary shadow-lg' 
                            : 'bg-glass border-glass/40 text-foreground-muted hover:text-black hover:bg-glass'
                        }`}
                      >
                        {q} Analysis
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="glass-panel p-5 border-glass">
                      <span className="text-[10px] text-foreground-dim uppercase tracking-wider font-bold">Enrollment Rate</span>
                      <p className="text-3xl font-bold font-heading text-black mt-1">{metrics.enrolmentRate}%</p>
                    </div>
                    <div className="glass-panel p-5 border-glass">
                      <span className="text-[10px] text-foreground-dim uppercase tracking-wider font-bold">Total Employer Cost</span>
                      <p className="text-3xl font-bold font-heading text-black mt-1">${metrics.premiumCost}</p>
                    </div>
                    <div className="glass-panel p-5 border-glass">
                      <span className="text-[10px] text-foreground-dim uppercase tracking-wider font-bold">EAP Counselling Sessions</span>
                      <p className="text-3xl font-bold font-heading text-black mt-1">{metrics.eapUtilisation}</p>
                    </div>
                    <div className="glass-panel p-5 border-glass">
                      <span className="text-[10px] text-foreground-dim uppercase tracking-wider font-bold">Reward Redemptions</span>
                      <p className="text-3xl font-bold font-heading text-black mt-1">{metrics.pointsRedeemed} pts</p>
                    </div>
                  </div>

                  {/* Utilization Chart & Analytics */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="glass-panel p-6 border-glass md:col-span-2 space-y-4">
                      <h3 className="font-heading font-semibold text-lg text-black">Benefits Utilization Breakdown</h3>
                      <div className="h-64 w-full flex items-end justify-between px-4 pb-6 border-b border-glass relative">
                        {/* Y Axis Guide Lines */}
                        <div className="absolute left-0 right-0 top-6 border-t border-glass/25 text-[9px] text-foreground-dim pt-1 pr-2 text-right">High Utilisation</div>
                        <div className="absolute left-0 right-0 top-24 border-t border-glass/25 text-[9px] text-foreground-dim pt-1 pr-2 text-right">Medium Utilisation</div>
                        <div className="absolute left-0 right-0 top-44 border-t border-glass/25 text-[9px] text-foreground-dim pt-1 pr-2 text-right">Low Utilisation</div>
                        
                        {/* Bar 1: Enrollment Rate */}
                        <div className="flex flex-col items-center gap-2 w-1/4 z-10">
                          <div className="text-xs font-bold text-secondary">{metrics.enrolmentRate}%</div>
                          <div 
                            className="w-12 bg-gradient-to-t from-secondary/40 to-secondary -t-lg transition-all duration-500 hover:brightness-125 cursor-help" 
                            style={{ height: `${Math.min(160, metrics.enrolmentRate * 1.6)}px` }}
                            title={`Enrollment rate: ${metrics.enrolmentRate}%`}
                          ></div>
                          <span className="text-[10px] text-foreground-muted font-medium">Enrollment %</span>
                        </div>

                        {/* Bar 2: Premium Cost */}
                        <div className="flex flex-col items-center gap-2 w-1/4 z-10">
                          <div className="text-xs font-bold text-primary">${metrics.premiumCost}</div>
                          <div 
                            className="w-12 bg-gradient-to-t from-primary/40 to-primary -t-lg transition-all duration-500 hover:brightness-125 cursor-help" 
                            style={{ height: `${Math.min(160, (metrics.premiumCost / 10) * 1.6)}px` }}
                            title={`Total Cost: $${metrics.premiumCost}`}
                          ></div>
                          <span className="text-[10px] text-foreground-muted font-medium">Employer Cost</span>
                        </div>

                        {/* Bar 3: EAP Utilisation */}
                        <div className="flex flex-col items-center gap-2 w-1/4 z-10">
                          <div className="text-xs font-bold text-accent">{metrics.eapUtilisation} sessions</div>
                          <div 
                            className="w-12 bg-gradient-to-t from-accent/40 to-accent -t-lg transition-all duration-500 hover:brightness-125 cursor-help" 
                            style={{ height: `${Math.min(160, metrics.eapUtilisation * 16)}px` }}
                            title={`EAP Counselling: ${metrics.eapUtilisation} sessions`}
                          ></div>
                          <span className="text-[10px] text-foreground-muted font-medium">EAP Counselling</span>
                        </div>

                        {/* Bar 4: Wellness Participation */}
                        <div className="flex flex-col items-center gap-2 w-1/4 z-10">
                          <div className="text-xs font-bold text-success">{metrics.wellnessParticipation} logs</div>
                          <div 
                            className="w-12 bg-gradient-to-t from-success/40 to-success -t-lg transition-all duration-500 hover:brightness-125 cursor-help" 
                            style={{ height: `${Math.min(160, metrics.wellnessParticipation * 16)}px` }}
                            title={`Wellness Logs: ${metrics.wellnessParticipation}`}
                          ></div>
                          <span className="text-[10px] text-foreground-muted font-medium">Wellness Logs</span>
                        </div>
                      </div>
                    </div>

                    <div className="glass-panel p-6 border-glass md:col-span-1 space-y-4">
                      <h3 className="font-heading font-semibold text-lg text-black">Utilization Insight</h3>
                      <div className="p-4  bg-card-hover border border-glass text-xs space-y-2.5 text-foreground-muted">
                        <p className="text-black font-medium flex items-center gap-1.5">
                          <Star className="text-warning w-4 h-4" /> Active Recommendations:
                        </p>
                        <p>&bull; Enrolment rate is currently at <span className="text-secondary font-semibold">{metrics.enrolmentRate}%</span>. We recommend launching an enrolment promotion challenge next month.</p>
                        <p>&bull; Wellness program participation stands at <span className="text-success font-semibold">{metrics.wellnessParticipation} logged activities</span>, showing strong engagement.</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* EAP Session Approvals / Scheduling */}
            <div className="glass-panel p-6 border-glass">
              <h3 className="font-heading font-bold text-lg text-black mb-4">Counselling Session Allocations & Status</h3>
              <div className="table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Session ID</th>
                      <th>Employee ID</th>
                      <th>Service ID</th>
                      <th>Requested Date</th>
                      <th>Counsellor Ref</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allSessions.map(sess => (
                      <tr key={sess.sessionID}>
                        <td className="text-black font-semibold">#{sess.sessionID}</td>
                        <td>Employee #{sess.employeeID}</td>
                        <td>Service #{sess.serviceID}</td>
                        <td>{new Date(sess.requestedDate).toLocaleDateString()}</td>
                        <td>{sess.counsellorRef}</td>
                        <td>
                          <span className={`badge ${
                            sess.status === 'Scheduled' ? 'badge-active' : sess.status === 'Requested' ? 'badge-pending' : 'badge-error'
                          }`}>{sess.status}</span>
                        </td>
                        <td>
                          {sess.status === 'Requested' && (
                            <button
                              onClick={() => handleUpdateSession(sess.sessionID, 'Scheduled', 'Dr. Linda Carter')}
                              className="py-1 px-3  bg-secondary/20 border border-secondary text-secondary hover:bg-secondary/40 text-[10px] font-semibold transition"
                            >
                              Assign Counsellor
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 6. Recognition Manager Console */}
        {currentUser?.role === 'RecognitionManager' && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <h2 className="text-3xl font-bold font-heading text-black">Recognition Manager <span className="gradient-text">Console</span></h2>
              <p className="text-foreground-muted">Manage peer recognition awards, milestone rewards, and reward points catalogs.</p>
            </div>

            {/* KPI Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
              <div className="glass-panel p-5 border-glass">
                <span className="text-[10px] text-foreground-dim uppercase tracking-wider font-bold">Total Recognition Awards</span>
                <p className="text-3xl font-bold font-heading text-black mt-1">{allAwards.length}</p>
                <span className="text-[10px] text-foreground-muted mt-1 block">Category based badges awarded</span>
              </div>
              <div className="glass-panel p-5 border-glass">
                <span className="text-[10px] text-foreground-dim uppercase tracking-wider font-bold">Active Reward Balances</span>
                <p className="text-3xl font-bold font-heading text-secondary mt-1">
                  {allPoints.length > 0 ? allPoints.reduce((sum, p) => sum + p.balance, 0) : 0} pts
                </p>
                <span className="text-[10px] text-foreground-muted mt-1 block">Across all employees</span>
              </div>
              <div className="glass-panel p-5 border-glass">
                <span className="text-[10px] text-foreground-dim uppercase tracking-wider font-bold">Store Catalog Items</span>
                <p className="text-3xl font-bold font-heading text-success mt-1">{catalogItems.length}</p>
                <span className="text-[10px] text-foreground-muted mt-1 block">
                  {catalogItems.filter(i => i.availableQuantity <= 0).length} items currently out of stock
                </span>
              </div>
            </div>

            {/* Tab Switched Content */}
            <div className="space-y-6">
              {/* Tab Navigation */}
              <div className="flex border-b border-glass gap-2 pb-px overflow-x-auto">
                <button
                  onClick={() => setRecognitionTab('awards')}
                  className={`py-2.5 px-4 font-heading font-bold text-xs uppercase tracking-wider border-b-2 transition-all ${
                    recognitionTab === 'awards'
                      ? 'border-black text-black'
                      : 'border-transparent text-foreground-dim hover:text-black'
                  }`}
                >
                  Recognition Awards Log
                </button>
                <button
                  onClick={() => setRecognitionTab('points')}
                  className={`py-2.5 px-4 font-heading font-bold text-xs uppercase tracking-wider border-b-2 transition-all ${
                    recognitionTab === 'points'
                      ? 'border-black text-black'
                      : 'border-transparent text-foreground-dim hover:text-black'
                  }`}
                >
                  Employee Points Balances
                </button>
                <button
                  onClick={() => setRecognitionTab('catalog')}
                  className={`py-2.5 px-4 font-heading font-bold text-xs uppercase tracking-wider border-b-2 transition-all ${
                    recognitionTab === 'catalog'
                      ? 'border-black text-black'
                      : 'border-transparent text-foreground-dim hover:text-black'
                  }`}
                >
                  Redemption Catalog & Stock
                </button>
              </div>

              {/* Tab Panel: Awards Log */}
              {recognitionTab === 'awards' && (
                <div className="glass-panel p-6 border-glass space-y-4 animate-fade-in">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h3 className="font-heading font-bold text-lg text-black">Recognition & Badge Log History</h3>
                      <p className="text-xs text-foreground-dim mt-0.5">Real-time tracker of all peer-to-peer recognition actions</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                      {/* Search */}
                      <div className="relative flex-1 sm:flex-initial">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-foreground-dim pointer-events-none" />
                        <input 
                          type="text"
                          placeholder="Search awards, message..."
                          value={awardsSearchQuery}
                          onChange={(e) => setAwardsSearchQuery(e.target.value)}
                          className="custom-input pl-9 text-xs py-2 w-full sm:w-64"
                        />
                      </div>

                      {/* Category Filter */}
                      <div className="relative flex-1 sm:flex-initial flex items-center">
                        <Filter className="absolute left-3 h-4 w-4 text-foreground-dim pointer-events-none" />
                        <select
                          value={awardsCategoryFilter}
                          onChange={(e) => setAwardsCategoryFilter(e.target.value)}
                          className="custom-select pl-9 text-xs py-2 pr-8 w-full sm:w-48 appearance-none bg-no-repeat bg-right"
                        >
                          <option value="All">All Categories</option>
                          <option value="PeerRecognition">Peer Recognition</option>
                          <option value="ManagerNomination">Manager Nomination</option>
                          <option value="InnovationAward">Innovation Award</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="table-container">
                    {(() => {
                      const filtered = allAwards.filter(aw => {
                        const query = awardsSearchQuery.toLowerCase().trim();
                        const matchesSearch = 
                          aw.nominatorName.toLowerCase().includes(query) ||
                          aw.recipientName.toLowerCase().includes(query) ||
                          aw.badgeName.toLowerCase().includes(query) ||
                          aw.message.toLowerCase().includes(query);
                        const matchesCategory = awardsCategoryFilter === 'All' || aw.category === awardsCategoryFilter;
                        return matchesSearch && matchesCategory;
                      });

                      if (filtered.length === 0) {
                        return (
                          <div className="text-center py-8 text-foreground-muted text-sm bg-card-hover border border-dashed border-glass/40">
                            No recognition awards found matching the filters.
                          </div>
                        );
                      }

                      return (
                        <table className="custom-table">
                          <thead>
                            <tr>
                              <th>Award ID</th>
                              <th>Nominator</th>
                              <th>Recipient</th>
                              <th>Category</th>
                              <th>Badge Name</th>
                              <th>Points</th>
                              <th>Message</th>
                              <th>Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filtered.map(aw => (
                              <tr key={aw.awardID} className="hover:bg-card-hover transition-colors">
                                <td className="text-black font-semibold">#{aw.awardID}</td>
                                <td>{aw.nominatorName}</td>
                                <td>{aw.recipientName}</td>
                                <td>
                                  <span className="badge badge-secondary">{aw.category}</span>
                                </td>
                                <td>
                                  <span className="badge badge-primary">{aw.badgeName}</span>
                                </td>
                                <td className="text-secondary font-bold">+{aw.pointsAwarded} pts</td>
                                <td className="max-w-xs truncate text-xs text-foreground-muted" title={aw.message}>
                                  {aw.message}
                                </td>
                                <td>{new Date(aw.awardDate).toLocaleDateString()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      );
                    })()}
                  </div>
                </div>
              )}

              {/* Tab Panel: Reward Points Balances */}
              {recognitionTab === 'points' && (
                <div className="glass-panel p-6 border-glass space-y-4 animate-fade-in">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h3 className="font-heading font-bold text-lg text-black">Reward Points Balances</h3>
                      <p className="text-xs text-foreground-dim mt-0.5">Active points breakdown for all employee portal accounts</p>
                    </div>

                    {/* Search */}
                    <div className="relative w-full md:w-auto">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-foreground-dim pointer-events-none" />
                      <input 
                        type="text"
                        placeholder="Search employee by name..."
                        value={pointsSearchQuery}
                        onChange={(e) => setPointsSearchQuery(e.target.value)}
                        className="custom-input pl-9 text-xs py-2 w-full md:w-64"
                      />
                    </div>
                  </div>

                  <div className="table-container">
                    {(() => {
                      const filtered = allPoints.filter(p => {
                        const query = pointsSearchQuery.toLowerCase().trim();
                        return p.employeeName.toLowerCase().includes(query) || p.employeeID.toString().includes(query);
                      });

                      if (filtered.length === 0) {
                        return (
                          <div className="text-center py-8 text-foreground-muted text-sm bg-card-hover border border-dashed border-glass/40">
                            No employee points balances found.
                          </div>
                        );
                      }

                      return (
                        <table className="custom-table">
                          <thead>
                            <tr>
                              <th>Points ID</th>
                              <th>Employee ID</th>
                              <th>Employee Name</th>
                              <th>Total Earned</th>
                              <th>Total Redeemed</th>
                              <th>Current Balance</th>
                              <th>Last Updated</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filtered.map(p => (
                              <tr key={p.pointsID} className="hover:bg-card-hover transition-colors">
                                <td className="text-black font-semibold">#{p.pointsID}</td>
                                <td>EMP #{p.employeeID}</td>
                                <td className="text-black font-medium">{p.employeeName}</td>
                                <td className="text-success font-semibold">+{p.totalEarned} pts</td>
                                <td className="text-foreground-muted">-{p.totalRedeemed} pts</td>
                                <td className="text-secondary font-bold">{p.balance} pts</td>
                                <td>{new Date(p.lastUpdated).toLocaleDateString()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      );
                    })()}
                  </div>
                </div>
              )}

              {/* Tab Panel: Redemption Catalog & Stock */}
              {recognitionTab === 'catalog' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in">
                  {/* Add Catalog Item console */}
                  <div className="glass-panel p-6 border-glass md:col-span-1 h-fit">
                    <h3 className="font-heading font-bold text-lg text-black mb-4 flex items-center gap-2">
                      <Plus className="text-accent" /> Add Reward Item
                    </h3>
                    <form onSubmit={handleCreateCatalogItem} className="space-y-4">
                      <div>
                        <label className="text-xs text-foreground-muted block mb-1">Item Name</label>
                        <input 
                          type="text" 
                          required 
                          placeholder="e.g. Fitness Tracker Smartwatch" 
                          value={newCatalogItem.itemName}
                          onChange={(e) => setNewCatalogItem({ ...newCatalogItem, itemName: e.target.value })}
                          className="custom-input" 
                        />
                      </div>
                      <div>
                        <label className="text-xs text-foreground-muted block mb-1">Category</label>
                        <select 
                          value={newCatalogItem.category} 
                          onChange={(e) => setNewCatalogItem({ ...newCatalogItem, category: e.target.value })}
                          className="custom-select"
                        >
                          <option value="Voucher">Gift Voucher</option>
                          <option value="Merchandise">Merchandise Gear</option>
                          <option value="Experience">Wellness Experience</option>
                          <option value="Charity">Charity Donation</option>
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-foreground-muted block mb-1">Points Required</label>
                          <input 
                            type="number" 
                            value={newCatalogItem.pointsRequired}
                            onChange={(e) => setNewCatalogItem({ ...newCatalogItem, pointsRequired: parseInt(e.target.value) })}
                            className="custom-input" 
                          />
                        </div>
                        <div>
                          <label className="text-xs text-foreground-muted block mb-1">Available Quantity</label>
                          <input 
                            type="number" 
                            value={newCatalogItem.availableQuantity}
                            onChange={(e) => setNewCatalogItem({ ...newCatalogItem, availableQuantity: parseInt(e.target.value) })}
                            className="custom-input" 
                          />
                        </div>
                      </div>
                      <button type="submit" className="w-full py-3 font-semibold gradient-btn">
                        Create Item
                      </button>
                    </form>
                  </div>

                  {/* Catalog items list */}
                  <div className="glass-panel p-6 border-glass md:col-span-2 space-y-4">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <h3 className="font-heading font-bold text-lg text-black">Redemption Catalog Store</h3>
                        <p className="text-xs text-foreground-dim mt-0.5">Inventory levels and availability statuses of rewards</p>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                        {/* Search */}
                        <div className="relative flex-1 sm:flex-initial">
                          <Search className="absolute left-3 top-2.5 h-4 w-4 text-foreground-dim pointer-events-none" />
                          <input 
                            type="text"
                            placeholder="Search catalog items..."
                            value={catalogSearchQuery}
                            onChange={(e) => setCatalogSearchQuery(e.target.value)}
                            className="custom-input pl-9 text-xs py-2 w-full sm:w-64"
                          />
                        </div>

                        {/* Filter */}
                        <div className="relative flex-1 sm:flex-initial flex items-center">
                          <Filter className="absolute left-3 h-4 w-4 text-foreground-dim pointer-events-none" />
                          <select
                            value={catalogFilter}
                            onChange={(e) => setCatalogFilter(e.target.value)}
                            className="custom-select pl-9 text-xs py-2 pr-8 w-full sm:w-48 appearance-none bg-no-repeat bg-right"
                          >
                            <option value="All">All Categories</option>
                            <option value="Voucher">Gift Voucher</option>
                            <option value="Merchandise">Merchandise Gear</option>
                            <option value="Experience">Wellness Experience</option>
                            <option value="Charity">Charity Donation</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="table-container">
                      {(() => {
                        const filtered = catalogItems.filter(item => {
                          const query = catalogSearchQuery.toLowerCase().trim();
                          const matchesSearch = item.itemName.toLowerCase().includes(query);
                          const matchesCategory = catalogFilter === 'All' || item.category === catalogFilter;
                          return matchesSearch && matchesCategory;
                        });

                        if (filtered.length === 0) {
                          return (
                            <div className="text-center py-8 text-foreground-muted text-sm bg-card-hover border border-dashed border-glass/40">
                              No catalog items found matching filters.
                            </div>
                          );
                        }

                        return (
                          <table className="custom-table">
                            <thead>
                              <tr>
                                <th>Item ID</th>
                                <th>Item Name</th>
                                <th>Category</th>
                                <th>Points Required</th>
                                <th>Stock Qty</th>
                                <th>Stock Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filtered.map(item => {
                                const isOutOfStock = item.availableQuantity <= 0;
                                const statusBadgeClass = isOutOfStock ? 'badge-error' : 'badge-active';
                                const statusText = isOutOfStock ? 'Out Of Stock' : 'Available';
                                
                                return (
                                  <tr key={item.itemID} className="hover:bg-card-hover transition-colors">
                                    <td className="text-black font-semibold">#{item.itemID}</td>
                                    <td className="text-black font-medium">{item.itemName}</td>
                                    <td>
                                      <span className="badge badge-secondary">{item.category}</span>
                                    </td>
                                    <td className="text-primary font-bold">{item.pointsRequired} pts</td>
                                    <td className="text-black font-semibold">{item.availableQuantity} units</td>
                                    <td>
                                      <span className={`badge ${statusBadgeClass}`}>{statusText}</span>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 7. Admin Control Center */}
        {currentUser?.role === 'Admin' && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <h2 className="text-3xl font-bold font-heading text-black">Admin Control <span className="gradient-text">Center</span></h2>
              <p className="text-foreground-muted">System audit logs, user administration rules, and global configuration.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* User manager form */}
              <div className="glass-panel p-6 border-glass md:col-span-1 h-fit">
                <h3 className="font-heading font-bold text-lg text-black mb-4 flex items-center gap-2">
                  <Users className="text-secondary" /> Add Employee Account
                </h3>
                <form onSubmit={handleCreateUser} className="space-y-4">
                  <div>
                    <label className="text-xs text-foreground-muted block mb-1">Full Name</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g. Gopinath Subramanian" 
                      value={newUserForm.name}
                      onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                      className="custom-input" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-foreground-muted block mb-1">Employee ID</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="EMP1009" 
                        value={newUserForm.employeeID}
                        onChange={(e) => setNewUserForm({ ...newUserForm, employeeID: e.target.value })}
                        className="custom-input" 
                      />
                    </div>
                    <div>
                      <label className="text-xs text-foreground-muted block mb-1">Grade</label>
                      <select 
                        value={newUserForm.gradeID} 
                        onChange={(e) => setNewUserForm({ ...newUserForm, gradeID: e.target.value })}
                        className="custom-select"
                      >
                        <option value="G1">G1</option>
                        <option value="G2">G2</option>
                        <option value="G3">G3</option>
                        <option value="G4">G4</option>
                        <option value="G5">G5</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-foreground-muted block mb-1">Role Type</label>
                    <select 
                      value={newUserForm.role} 
                      onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value })}
                      className="custom-select"
                    >
                      <option value="Employee">Employee</option>
                      <option value="HRBenefitsAdmin">HR Benefits Admin</option>
                      <option value="Finance">Finance Executive</option>
                      <option value="WellnessCoordinator">Wellness Coordinator</option>
                      <option value="RecognitionManager">Recognition Manager</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-foreground-muted block mb-1">Email Address</label>
                    <input 
                      type="email" 
                      required 
                      placeholder="name@wellbeing360.com" 
                      value={newUserForm.email}
                      onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                      className="custom-input" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-foreground-muted block mb-1">Dept</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="IT" 
                        value={newUserForm.departmentID}
                        onChange={(e) => setNewUserForm({ ...newUserForm, departmentID: e.target.value })}
                        className="custom-input" 
                      />
                    </div>
                    <div>
                      <label className="text-xs text-foreground-muted block mb-1">Phone</label>
                      <input 
                        type="text" 
                        placeholder="+1-555-0199" 
                        value={newUserForm.phone}
                        onChange={(e) => setNewUserForm({ ...newUserForm, phone: e.target.value })}
                        className="custom-input" 
                      />
                    </div>
                  </div>
                  <button type="submit" className="w-full py-3  font-semibold gradient-btn">
                    Create Account
                  </button>
                </form>
              </div>

              {/* Audit trail explorer */}
              <div className="glass-panel p-6 border-glass md:col-span-2 space-y-4">
                <h3 className="font-heading font-bold text-lg text-black">System Compliance Audit Trail Logs</h3>
                <div className="table-container">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Log ID</th>
                        <th>User ID</th>
                        <th>Module</th>
                        <th>Action Performed</th>
                        <th>Timestamp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {auditLogs.map(log => (
                        <tr key={log.auditID}>
                          <td className="text-black font-semibold">#{log.auditID}</td>
                          <td>User #{log.userID}</td>
                          <td>
                            <span className="badge badge-secondary">{log.module}</span>
                          </td>
                          <td className="text-xs text-foreground-muted">{log.action}</td>
                          <td>{new Date(log.timestamp).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-glass bg-card/20 py-6 mt-12 text-center text-xs text-foreground-dim">
        <p>&copy; 2026 WellBeing360 Employee Wellness and Benefits System. Relational DB SQL Server Enabled.</p>
      </footer>

      {/* Interactive FAQ Chatbot Assistant */}
      <div className="fixed bottom-6 right-6 z-50">
        {!assistantOpen ? (
          <button 
            onClick={() => setAssistantOpen(true)}
            className="w-14 h-14 bg-black text-white flex items-center justify-center border border-glass"
            title="Chat with Wellness Assistant"
          >
            <MessageSquare className="w-6 h-6" />
          </button>
        ) : (
          <div className="w-80 h-96 glass-panel border-primary overflow-hidden flex flex-col shadow-2xl animate-fade-in bg-app/95 backdrop-blur-xl">
            {/* Chat Header */}
            <div className="p-4 bg-black flex items-center justify-between border-b border-glass">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-white" />
                <span className="text-xs font-bold text-white font-heading">Wellness Assistant</span>
              </div>
              <button 
                onClick={() => setAssistantOpen(false)}
                className="text-white/80 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>
            
            {/* Chat Messages */}
            <div className="flex-1 p-3 space-y-2.5 overflow-y-auto text-[11px] scrollbar-thin">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-2  border ${
                    msg.sender === 'user' 
                      ? 'bg-primary/20 border-primary text-black -tr-none' 
                      : 'bg-glass border-glass/40 text-foreground-muted -tl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const input = form.elements.namedItem('chatInput') as HTMLInputElement;
                if (!input.value.trim()) return;
                const userVal = input.value;
                setChatMessages(prev => [...prev, { sender: 'user', text: userVal }]);
                input.value = '';
                
                // Simulated intelligent responses
                setTimeout(() => {
                  let reply = "I'm here to help! Try asking about 'points', 'benefits', 'challenges', or 'counselling'.";
                  const clean = userVal.toLowerCase();
                  if (clean.includes('point') || clean.includes('reward')) {
                    reply = `You currently have reward points. You can check your balance in the dashboard and redeem them in the 'Rewards' tab.`;
                  } else if (clean.includes('benefit') || clean.includes('insurance')) {
                    reply = "To manage benefits, click on the 'Benefits' tab. If the Open Enrolment window is active, you can select and customize your plans.";
                  } else if (clean.includes('counselling') || clean.includes('eap')) {
                    reply = "We offer confidential EAP counselling. You can book a session with an advisor (like Dr. Linda Carter) under the 'Counselling' tab.";
                  } else if (clean.includes('step') || clean.includes('challenge') || clean.includes('wellness')) {
                    reply = "Earn points by participating in wellness challenges. Log your daily steps or sleep in the 'Wellness' tab to earn reward points!";
                  } else if (clean.includes('hello') || clean.includes('hi')) {
                    reply = `Hi ${currentUser?.name || 'there'}! How can I assist you with your benefits or wellness goals today?`;
                  }
                  setChatMessages(prev => [...prev, { sender: 'bot', text: reply }]);
                }, 750);
              }}
              className="p-2 border-t border-glass flex gap-2"
            >
              <input 
                name="chatInput" 
                type="text" 
                placeholder="Ask me anything..." 
                className="custom-input py-1.5 px-3 text-[11px] bg-glass  flex-1"
                autoComplete="off"
              />
              <button type="submit" className="px-3  bg-primary text-white font-bold text-xs hover:bg-accent transition-colors">
                Send
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
