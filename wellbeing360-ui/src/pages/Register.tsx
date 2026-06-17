import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import { Layers, User, Mail, Lock, Phone, ArrowLeft } from 'lucide-react';

interface RegisterProps {
  onRegisterSuccess: () => void;
  onRedirectLogin: () => void;
}

// Role to Department Mapping
const ROLE_DEPT_MAPPING: Record<string, string[]> = {
  Employee: ['Full Time', 'Part Time'],
  HRBenefitsAdmin: ['HR admin'],
  Finance: ['Finance Manager'],
  WellnessCoordinator: ['Wellness Coordinator'],
  RecognitionManager: ['Recognition Manager'],
  Admin: ['Admin']
};

export default function Register({ onRegisterSuccess, onRedirectLogin }: RegisterProps) {
  const { setApiError, setSuccessMsg } = useAuth();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRegRole] = useState('Employee');
  const [dept, setRegDept] = useState('Full Time');
  const [grade, setRegGrade] = useState('G3');
  const [loading, setLoading] = useState(false);

  // Sync department when role changes
  useEffect(() => {
    const availableDepts = ROLE_DEPT_MAPPING[role] || [];
    if (availableDepts.length > 0) {
      setRegDept(availableDepts[0]);
    }
  }, [role]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      await api.register({
        name,
        email,
        password,
        phone,
        role,
        gradeID: grade,
        departmentID: dept
      });
      setSuccessMsg('Account registered successfully! Please log in.');
      onRegisterSuccess();
    } catch (err: any) {
      setApiError(err.message || 'Registration failed. Please check the fields.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-emerald-200/20 rounded-full blur-3xl filter pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-indigo-200/20 rounded-full blur-3xl filter pointer-events-none"></div>

      <div className="max-w-lg w-full bg-white border border-slate-200 rounded-3xl shadow-xl p-8 relative z-10 animate-fade-in">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/20">
            <Layers className="text-white w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Register <span className="text-emerald-500">Profile</span>
          </h1>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">WellBeing360 Employee Onboarding</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3.5 text-slate-400 w-4 h-4" />
                <input 
                  type="text" 
                  required 
                  placeholder="Gopinath Subramanian" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="custom-input pl-10"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 text-slate-400 w-4 h-4" />
                <input 
                  type="email" 
                  required 
                  placeholder="gopinath@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="custom-input pl-10"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 text-slate-400 w-4 h-4" />
                <input 
                  type="password" 
                  required 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="custom-input pl-10"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3.5 text-slate-400 w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="1234567890" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="custom-input pl-10"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500">Role Type</label>
              <select 
                value={role} 
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
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500">Department</label>
              <select 
                value={dept} 
                onChange={(e) => setRegDept(e.target.value)}
                className="custom-select"
              >
                {(ROLE_DEPT_MAPPING[role] || []).map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500">Eligibility Grade</label>
              <select 
                value={grade} 
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
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 hover:-translate-y-0.5 transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:bg-emerald-400 disabled:-translate-y-0 text-sm mt-6"
          >
            {loading ? 'Creating Account...' : 'Register Profile'}
          </button>
        </form>

        {/* Login Redirect */}
        <div className="text-center mt-6 pt-5 border-t border-slate-100">
          <button 
            onClick={onRedirectLogin}
            className="text-xs text-slate-500 hover:text-emerald-500 transition flex items-center justify-center gap-1.5 mx-auto bg-transparent border-none cursor-pointer font-semibold"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Sign In
          </button>
        </div>

      </div>
    </div>
  );
}
