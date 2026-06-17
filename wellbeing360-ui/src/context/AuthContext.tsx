import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { api, setCurrentUserId, setAuthToken } from '../api';

export interface User {
  userID: number;
  name: string;
  employeeID: string;
  email: string;
  role: string;
  gradeID: string;
  departmentID: string;
  phone?: string;
  createdDate?: string;
}

export interface Notification {
  notificationID: number;
  userID: number;
  message: string;
  category: string;
  status: string;
  createdDate: string;
}

interface AuthContextType {
  users: User[];
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  isAdminMode: boolean;
  setIsAdminMode: (mode: boolean) => void;
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
  showNotifications: boolean;
  setShowNotifications: (show: boolean) => void;
  apiError: string | null;
  setApiError: (error: string | null) => void;
  successMsg: string | null;
  setSuccessMsg: (msg: string | null) => void;
  refreshTrigger: number;
  setRefreshTrigger: React.Dispatch<React.SetStateAction<number>>;
  loadDemoUsers: () => Promise<void>;
  masqueradeAsUser: (userId: number) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdminMode, setIsAdminMode] = useState<boolean>(() => {
    return localStorage.getItem('wellbeing360_is_admin_mode') === 'true';
  });
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Load active notifications
  const loadNotifications = async () => {
    try {
      const notes = await api.getNotifications();
      setNotifications(notes || []);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    }
  };

  const loadDemoUsers = async () => {
    try {
      const userList = await api.getUsers();
      setUsers(userList || []);

      const storedToken = localStorage.getItem('wellbeing360_token');
      const storedUserJson = localStorage.getItem('wellbeing360_user');

      if (storedToken && storedUserJson) {
        const user = JSON.parse(storedUserJson);
        setAuthToken(storedToken);
        setCurrentUser(user);
        setCurrentUserId(user.userID);
      }
    } catch (err) {
      console.error('Failed to load demo users or session:', err);
    }
  };

  useEffect(() => {
    loadDemoUsers();
  }, [refreshTrigger]);

  useEffect(() => {
    if (currentUser) {
      loadNotifications();
      const interval = setInterval(loadNotifications, 15000);
      return () => clearInterval(interval);
    }
  }, [currentUser, refreshTrigger]);

  const masqueradeAsUser = async (userId: number) => {
    const target = users.find(u => u.userID === userId);
    if (target) {
      setCurrentUser(target);
      setCurrentUserId(target.userID);
      localStorage.setItem('wellbeing360_user', JSON.stringify(target));
      setSuccessMsg(`Switched role simulation to ${target.name} (${target.role})`);
      setTimeout(() => setSuccessMsg(null), 3000);
    }
  };

  const logout = () => {
    setAuthToken('');
    localStorage.removeItem('wellbeing360_token');
    localStorage.removeItem('wellbeing360_user');
    localStorage.removeItem('wellbeing360_is_admin_mode');
    setCurrentUser(null);
    setCurrentUserId(0);
    setIsAdminMode(false);
  };

  return (
    <AuthContext.Provider value={{
      users,
      currentUser,
      setCurrentUser,
      isAdminMode,
      setIsAdminMode,
      notifications,
      setNotifications,
      showNotifications,
      setShowNotifications,
      apiError,
      setApiError,
      successMsg,
      setSuccessMsg,
      refreshTrigger,
      setRefreshTrigger,
      loadDemoUsers,
      masqueradeAsUser,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
