import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api, setAuthToken, setCurrentUserId } from '../api';
import { Layers, Mail, Lock, ArrowRight } from 'lucide-react';

interface LoginProps {
  onLoginSuccess: () => void;
  onRedirectRegister: () => void;
}

export default function Login({ onLoginSuccess, onRedirectRegister }: LoginProps) {
  const { setApiError, setSuccessMsg, setCurrentUser, setIsAdminMode } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      const response = await api.login({ email, password });
      
      const user = {
        userID: response.userID || response.userId,
        employeeID: response.employeeID || response.employeeId,
        name: response.name,
        role: response.role,
        email: response.email,
        gradeID: response.gradeID || response.gradeId,
        departmentID: response.departmentID || response.departmentId
      };

      // Save details
      setAuthToken(response.token);
      setCurrentUserId(user.userID);
      localStorage.setItem('wellbeing360_token', response.token);
      localStorage.setItem('wellbeing360_user', JSON.stringify(user));
      localStorage.setItem('wellbeing360_is_admin_mode', user.role === 'Admin' ? 'true' : 'false');
      
      setCurrentUser(user);
      setIsAdminMode(user.role === 'Admin');

      setSuccessMsg(`Welcome back, ${user.name}!`);
      onLoginSuccess();
    } catch (err: any) {
      setApiError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-emerald-200/20 rounded-full blur-3xl filter pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-indigo-200/20 rounded-full blur-3xl filter pointer-events-none"></div>

      <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl shadow-xl p-8 relative z-10 animate-fade-in">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/20">
            <Layers className="text-white w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            WellBeing<span className="text-emerald-500">360</span>
          </h1>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">Benefits & Wellness Portal</p>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 block">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 text-slate-400 w-4 h-4" />
              <input 
                type="email" 
                required 
                placeholder="employee@wellbeing360.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="custom-input pl-10"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 block">Password</label>
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

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 hover:-translate-y-0.5 transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:bg-emerald-400 disabled:-translate-y-0 text-sm mt-6"
          >
            {loading ? 'Logging in...' : 'Sign In'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Onboarding Redirect */}
        <div className="text-center mt-6 pt-5 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            First time logging in?{' '}
            <button 
              onClick={onRedirectRegister} 
              className="text-emerald-500 font-bold hover:underline bg-transparent border-none cursor-pointer"
            >
              Register Employee Profile
            </button>
          </p>
        </div>

      </div>
    </div>
  );
}
