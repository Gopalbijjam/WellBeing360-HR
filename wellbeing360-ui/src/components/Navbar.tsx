import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import { Bell, Layers, Search, Check, LogOut, ChevronDown, UserCheck } from 'lucide-react';

interface NavbarProps {
  onSearch?: (query: string) => void;
}

export default function Navbar({ onSearch }: NavbarProps) {
  const {
    currentUser,
    users,
    masqueradeAsUser,
    isAdminMode,
    notifications,
    setNotifications,
    showNotifications,
    setShowNotifications,
    logout
  } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (onSearch) {
      onSearch(val);
    }
  };

  const handleReadNotification = async (id: number) => {
    try {
      await api.markNotificationRead(id);
      setNotifications(prev => prev.filter(n => n.notificationID !== id));
    } catch (err) {
      console.error('Failed to read notification:', err);
    }
  };

  const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = parseInt(e.target.value);
    if (id) {
      masqueradeAsUser(id);
    }
  };

  const unreadNotifications = notifications.filter(n => n.status === 'Unread');

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shadow-md shadow-emerald-500/25">
            <Layers className="text-white w-4.5 h-4.5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800 tracking-tight leading-none">
              WellBeing<span className="text-emerald-500">360</span>
            </h1>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Benefits Platform</span>
          </div>
        </div>

        {/* Global Search Bar (Inspired by Groww.in) */}
        <div className="hidden md:flex items-center flex-1 max-w-md relative">
          <Search className="absolute left-3.5 text-slate-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search benefit plans, wellness tasks, colleagues..." 
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full bg-slate-50 border border-slate-200 rounded-full py-2 pl-10 pr-4 text-sm outline-none focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-4">
          
          {/* Act As Masquerader (Central switcher for testing roles) */}
          {isAdminMode && (
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full px-3 py-1.5 shrink-0">
              <UserCheck className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-semibold text-slate-500 hidden lg:inline">Act As:</span>
              <select 
                value={currentUser?.userID || ''} 
                onChange={handleUserChange}
                className="bg-transparent text-xs font-bold text-slate-700 outline-none border-none cursor-pointer pr-1 focus:ring-0"
              >
                {users.map(u => (
                  <option key={u.userID} value={u.userID}>
                    {u.name} ({u.role})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Notifications Bell */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 border border-slate-200 rounded-full hover:bg-slate-50 transition relative cursor-pointer"
            >
              <Bell className="w-5 h-5 text-slate-600" />
              {unreadNotifications.length > 0 && (
                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full"></span>
              )}
            </button>

            {/* Notification Popover Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-3.5 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl p-4 z-50 animate-fade-in">
                <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-100">
                  <h3 className="font-bold text-sm text-slate-800">Notifications</h3>
                  <span className="text-xs bg-rose-50 text-rose-600 px-2 py-0.5 rounded-full font-bold">{unreadNotifications.length} new</span>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {unreadNotifications.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-6">All caught up!</p>
                  ) : (
                    unreadNotifications.map(n => (
                      <div key={n.notificationID} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-start gap-3 justify-between">
                        <div className="flex-1">
                          <span className="text-[9px] font-extrabold text-emerald-600 uppercase tracking-wider">{n.category}</span>
                          <p className="text-xs font-medium text-slate-600 mt-0.5 leading-snug">{n.message}</p>
                        </div>
                        <button 
                          onClick={() => handleReadNotification(n.notificationID)} 
                          className="text-slate-400 hover:text-emerald-600 shrink-0 cursor-pointer"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User profile dropdown info */}
          {currentUser && (
            <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-emerald-500/15">
                {currentUser.name.substring(0, 2).toUpperCase()}
              </div>
              <div className="hidden lg:block leading-none">
                <p className="text-xs font-bold text-slate-800">{currentUser.name}</p>
                <span className="text-[10px] text-slate-400 font-semibold">{currentUser.role}</span>
              </div>
              <button
                onClick={logout}
                className="p-2 border border-slate-200 rounded-full hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition cursor-pointer"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </header>
  );
}
