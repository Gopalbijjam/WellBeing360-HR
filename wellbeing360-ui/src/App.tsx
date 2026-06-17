import React, { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import EmployeeDashboard from './pages/EmployeeDashboard';
import HRBenefitsAdminDashboard from './pages/HRBenefitsAdminDashboard';
import WellnessCoordinatorDashboard from './pages/WellnessCoordinatorDashboard';
import FinanceDashboard from './pages/FinanceDashboard';
import RecognitionManagerDashboard from './pages/RecognitionManagerDashboard';
import AdminDashboard from './pages/AdminDashboard';

function AppContent() {
  const { currentUser, users, isAdminMode, masqueradeAsUser } = useAuth();
  
  // Local router state: 'landing' | 'login' | 'register' | 'app'
  const [view, setView] = useState<'landing' | 'login' | 'register' | 'app'>('landing');

  // Sync state with active user session
  useEffect(() => {
    if (currentUser) {
      setView('app');
    } else {
      if (view === 'app') {
        setView('landing');
      }
    }
  }, [currentUser]);

  // Route layouts
  if (view === 'landing') {
    return <LandingPage onStart={() => setView('login')} />;
  }

  if (view === 'login') {
    return (
      <Login 
        onLoginSuccess={() => setView('app')} 
        onRedirectRegister={() => setView('register')} 
      />
    );
  }

  if (view === 'register') {
    return (
      <Register 
        onRegisterSuccess={() => setView('login')} 
        onRedirectLogin={() => setView('login')} 
      />
    );
  }

  // Authenticated Dashboard layout
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      
      {/* Impersonation Banner */}
      {isAdminMode && currentUser?.role !== 'Admin' && (
        <div className="bg-slate-900 text-white text-xs font-semibold py-2.5 px-6 flex justify-between items-center z-50 border-b border-white/10 shrink-0">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Simulating Role Context: <strong className="text-emerald-400 capitalize">{currentUser?.name}</strong> ({currentUser?.role})
          </span>
          <button 
            onClick={() => {
              const adminUser = users.find(u => u.role === 'Admin');
              if (adminUser) {
                masqueradeAsUser(adminUser.userID);
              }
            }}
            className="bg-emerald-500 text-white px-3.5 py-1 rounded-full font-bold hover:bg-emerald-600 transition cursor-pointer text-[10px] uppercase tracking-wider shadow-sm"
          >
            Return to Admin Console
          </button>
        </div>
      )}

      {/* Global Groww-style Navbar */}
      <Navbar />

      {/* Main viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        
        {/* Dynamic role-based consoles rendering */}
        {currentUser?.role === 'Employee' && <EmployeeDashboard />}
        {currentUser?.role === 'HRBenefitsAdmin' && <HRBenefitsAdminDashboard />}
        {currentUser?.role === 'WellnessCoordinator' && <WellnessCoordinatorDashboard />}
        {currentUser?.role === 'Finance' && <FinanceDashboard />}
        {currentUser?.role === 'RecognitionManager' && <RecognitionManagerDashboard />}
        {currentUser?.role === 'Admin' && <AdminDashboard />}
        
      </main>

      {/* Float Notifications toast overlay */}
      <Toast />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
