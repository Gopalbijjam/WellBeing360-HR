import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import Dialog from '../components/Dialog';
import { ShieldAlert, UserPlus, Settings, ClipboardList, Edit3, UserCheck } from 'lucide-react';

// Role to Department Mapping
const ROLE_DEPT_MAPPING: Record<string, string[]> = {
  Employee: ['Full Time', 'Part Time'],
  HRBenefitsAdmin: ['HR admin'],
  Finance: ['Finance Manager'],
  WellnessCoordinator: ['Wellness Coordinator'],
  RecognitionManager: ['Recognition Manager'],
  Admin: ['Admin']
};

export default function AdminDashboard() {
  const { 
    setApiError, 
    setSuccessMsg, 
    isAdminMode, 
    setIsAdminMode, 
    refreshTrigger, 
    setRefreshTrigger,
    masqueradeAsUser,
    currentUser
  } = useAuth();

  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  
  // Modal Edit states
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Employee',
    departmentID: 'Full Time',
    gradeID: 'G3',
    status: 'Active'
  });

  const [newUserForm, setNewUserForm] = useState({
    name: '',
    employeeID: '',
    email: '',
    role: 'Employee',
    gradeID: 'G3',
    departmentID: 'Full Time',
    phone: '',
    password: 'password'
  });

  // Sync new user form department when role changes
  useEffect(() => {
    const availableDepts = ROLE_DEPT_MAPPING[newUserForm.role] || [];
    if (availableDepts.length > 0) {
      setNewUserForm(prev => ({ ...prev, departmentID: availableDepts[0] }));
    }
  }, [newUserForm.role]);

  // Sync editing user form department when role changes
  useEffect(() => {
    if (editingUser) {
      const availableDepts = ROLE_DEPT_MAPPING[editForm.role] || [];
      if (availableDepts.length > 0 && !availableDepts.includes(editForm.departmentID)) {
        setEditForm(prev => ({ ...prev, departmentID: availableDepts[0] }));
      }
    }
  }, [editForm.role, editingUser]);

  useEffect(() => {
    async function loadAdminData() {
      try {
        const [usersList, logsList] = await Promise.all([
          api.getUsers().catch(() => []),
          api.getAuditLogs().catch(() => [])
        ]);
        setAllUsers(usersList);
        setAuditLogs(logsList);
      } catch (err: any) {
        console.error('Failed to load Admin control data:', err);
      }
    }
    loadAdminData();
  }, [refreshTrigger]);

  const handleCreateUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    setSuccessMsg(null);

    try {
      await api.register({
        name: newUserForm.name,
        email: newUserForm.email,
        password: newUserForm.password,
        phone: newUserForm.phone,
        role: newUserForm.role,
        gradeID: newUserForm.gradeID,
        departmentID: newUserForm.departmentID
      });

      setSuccessMsg(`User profile for "${newUserForm.name}" created successfully!`);
      setNewUserForm({
        name: '',
        employeeID: '',
        email: '',
        role: 'Employee',
        gradeID: 'G3',
        departmentID: 'Full Time',
        phone: '',
        password: 'password'
      });
      setRefreshTrigger(prev => prev + 1);
    } catch (err: any) {
      setApiError(err.message || 'Failed to register user account.');
    }
  };

  const handleToggleMasquerade = () => {
    const nextVal = !isAdminMode;
    setIsAdminMode(nextVal);
    localStorage.setItem('wellbeing360_is_admin_mode', nextVal ? 'true' : 'false');
    setSuccessMsg(nextVal ? 'Development "Act As" masquerading enabled in header!' : 'Masquerading disabled.');
  };

  const openEditModal = (user: any) => {
    setEditingUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      role: user.role,
      departmentID: user.departmentID,
      gradeID: user.gradeID,
      status: user.status || 'Active'
    });
  };

  const handleUpdateUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setApiError(null);
    setSuccessMsg(null);

    try {
      await api.updateUser(editingUser.userID, editForm);
      setSuccessMsg(`Profile for ${editForm.name} updated successfully!`);
      setEditingUser(null);
      setRefreshTrigger(prev => prev + 1);
    } catch (err: any) {
      setApiError(err.message || 'Failed to update user profile.');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome banner */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl flex justify-between items-center">
        <div>
          <span className="text-[10px] uppercase bg-emerald-500 text-white font-extrabold px-3 py-1 rounded-full tracking-widest">Global Admin Center</span>
          <h2 className="text-2xl font-black mt-3">Compliance & Security Hub</h2>
          <p className="text-xs text-slate-300 font-semibold mt-1">Register user credentials, verify middleware audit entries, and toggle act-as permissions.</p>
        </div>
        <ShieldAlert className="text-emerald-500 w-12 h-12 shrink-0 hidden sm:block" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Form & Developer Toggles */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Developer Settings */}
          <div className="groww-card p-6 bg-white">
            <h3 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5 text-indigo-500" /> Developer Masquerade
            </h3>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Enabling this option inserts an "Act As" dropdown in the global navigation bar. This lets you switch role contexts immediately to simulate employee benefits checkouts, coordinator logs, and reward audits.
            </p>
            <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
              <span className="text-xs font-bold text-slate-600">Impersonation Dropdown</span>
              <button 
                onClick={handleToggleMasquerade}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
                  isAdminMode 
                    ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-md' 
                    : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                }`}
              >
                {isAdminMode ? 'Enabled' : 'Disabled'}
              </button>
            </div>
          </div>

          {/* User Onboarding Form */}
          <div className="groww-card p-6 bg-white">
            <h3 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-emerald-500" /> Onboard Employee Profile
            </h3>
            <form onSubmit={handleCreateUserSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Full Name</label>
                <input 
                  type="text" 
                  required 
                  placeholder="Rahul Kumar"
                  value={newUserForm.name}
                  onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                  className="custom-input" 
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Email Address</label>
                <input 
                  type="email" 
                  required 
                  placeholder="rahul@wellbeing360.com"
                  value={newUserForm.email}
                  onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                  className="custom-input" 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Phone Number</label>
                  <input 
                    type="text" 
                    placeholder="9876543210"
                    value={newUserForm.phone}
                    onChange={(e) => setNewUserForm({ ...newUserForm, phone: e.target.value })}
                    className="custom-input" 
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Access Credentials</label>
                  <input 
                    type="password" 
                    required 
                    value={newUserForm.password}
                    onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                    className="custom-input" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">System Role</label>
                  <select 
                    value={newUserForm.role} 
                    onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value })}
                    className="custom-select"
                  >
                    <option value="Employee">Employee</option>
                    <option value="HRBenefitsAdmin">HR Admin</option>
                    <option value="WellnessCoordinator">Wellness Coord</option>
                    <option value="Finance">Finance Executive</option>
                    <option value="RecognitionManager">Recognition Mgr</option>
                    <option value="Admin">System Admin</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Department</label>
                  <select 
                    value={newUserForm.departmentID} 
                    onChange={(e) => setNewUserForm({ ...newUserForm, departmentID: e.target.value })}
                    className="custom-select"
                  >
                    {(ROLE_DEPT_MAPPING[newUserForm.role] || []).map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Eligibility</label>
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

              <button 
                type="submit"
                className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs transition cursor-pointer"
              >
                Register Employee Account
              </button>
            </form>
          </div>

        </div>

        {/* Right Column: User directory with Edit Profile buttons */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* User Directory */}
          <div className="groww-card p-6 bg-white">
            <h3 className="font-bold text-slate-800 text-lg mb-4">Employee Accounts Directory</h3>
            <div className="overflow-x-auto max-h-[350px] overflow-y-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-400 uppercase font-bold border-b border-slate-200 sticky top-0 z-10">
                    <th className="p-3">User</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Department</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  {allUsers.map(user => (
                    <tr key={user.userID}>
                      <td className="p-3">
                        <span className="font-bold text-slate-800 block capitalize">{user.name}</span>
                        <span className="text-[10px] text-slate-400 font-semibold">{user.email}</span>
                      </td>
                      <td className="p-3 font-semibold text-indigo-600">{user.role}</td>
                      <td className="p-3 font-semibold text-slate-700">{user.departmentID}</td>
                      <td className="p-3">
                        <span className={`badge ${user.status === 'Active' ? 'badge-active' : 'badge-error'}`}>
                          {user.status || 'Active'}
                        </span>
                      </td>
                      <td className="p-3 text-right flex justify-end gap-2">
                        <button 
                          onClick={() => openEditModal(user)}
                          className="p-1.5 bg-slate-50 text-slate-500 hover:text-emerald-500 border border-slate-200 rounded-lg hover:border-emerald-200 transition cursor-pointer inline-flex items-center gap-1 text-[10px] font-bold"
                        >
                          <Edit3 className="w-3.5 h-3.5" /> Edit
                        </button>
                        {user.userID !== currentUser?.userID && (
                          <button 
                            onClick={() => masqueradeAsUser(user.userID)}
                            className="p-1.5 bg-emerald-50 text-emerald-600 hover:text-white hover:bg-emerald-500 border border-emerald-200 rounded-lg transition cursor-pointer inline-flex items-center gap-1 text-[10px] font-bold"
                            title="Impersonate role context"
                          >
                            <UserCheck className="w-3.5 h-3.5" /> Act As
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Database Audit Logs */}
          <div className="groww-card p-6 bg-white">
            <h3 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-indigo-500" /> Database Audit Logs
            </h3>
            <div className="overflow-x-auto max-h-[350px] overflow-y-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-400 uppercase font-bold border-b border-slate-200 sticky top-0 z-10">
                    <th className="p-3">Log ID</th>
                    <th className="p-3">Action Type</th>
                    <th className="p-3">Details</th>
                    <th className="p-3">Log Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  {auditLogs.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-6 text-center text-slate-400">No database middleware audit records found.</td>
                    </tr>
                  ) : (
                    auditLogs.map(log => (
                      <tr key={log.auditID}>
                        <td className="p-3 font-bold text-slate-800">#{log.auditID}</td>
                        <td className="p-3"><span className="badge badge-primary font-bold uppercase tracking-wider text-[10px]">{log.action || 'API CALL'}</span></td>
                        <td className="p-3 leading-relaxed text-slate-500">{log.details}</td>
                        <td className="p-3 font-semibold text-slate-400">{new Date(log.timestamp).toLocaleString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>

      {/* Edit Profile Dialog Modal */}
      <Dialog 
        isOpen={editingUser !== null} 
        onClose={() => setEditingUser(null)} 
        title={`Edit Profile: ${editingUser?.name}`}
      >
        {editingUser && (
          <form onSubmit={handleUpdateUserSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Full Name</label>
              <input 
                type="text" 
                required 
                value={editForm.name} 
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="custom-input" 
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Email Address</label>
                <input 
                  type="email" 
                  required 
                  value={editForm.email} 
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="custom-input" 
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Phone Number</label>
                <input 
                  type="text" 
                  value={editForm.phone} 
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="custom-input" 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Access Role</label>
                <select 
                  value={editForm.role} 
                  onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                  className="custom-select"
                >
                  <option value="Employee">Employee</option>
                  <option value="HRBenefitsAdmin">HR Admin</option>
                  <option value="WellnessCoordinator">Wellness Coordinator</option>
                  <option value="Finance">Finance Executive</option>
                  <option value="RecognitionManager">Recognition Manager</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Department</label>
                <select 
                  value={editForm.departmentID} 
                  onChange={(e) => setEditForm({ ...editForm, departmentID: e.target.value })}
                  className="custom-select"
                >
                  {(ROLE_DEPT_MAPPING[editForm.role] || []).map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Eligibility Grade</label>
                <select 
                  value={editForm.gradeID} 
                  onChange={(e) => setEditForm({ ...editForm, gradeID: e.target.value })}
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
                <label className="text-xs font-bold text-slate-400 block mb-1">Account Status</label>
                <select 
                  value={editForm.status} 
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  className="custom-select"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
              <button 
                type="button" 
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg cursor-pointer"
              >
                Submit Changes
              </button>
            </div>
          </form>
        )}
      </Dialog>
    </div>
  );
}
