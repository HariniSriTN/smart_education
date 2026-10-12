import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, Notification } from '../types';
import { 
  getCurrentUser, saveCurrentUser, getUsers, addUser, 
  initializeStorage, getNotifications, markAllNotificationsRead as markAllReadStorage,
  updateUser as updateStorageUser
} from '../data/storage';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => { success: boolean; message?: string };
  register: (data: Omit<User, 'id' | 'status' | 'joinedDate'>) => { success: boolean; message?: string };
  logout: () => void;
  switchDemoRole: (role: UserRole) => void;
  updateProfile: (updated: Partial<User>) => void;
  notifications: Notification[];
  unreadNotifsCount: number;
  markAllNotificationsRead: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    initializeStorage();
    const user = getCurrentUser();
    setCurrentUser(user);
    setNotifications(getNotifications());
  }, []);

  const login = (email: string): { success: boolean; message?: string } => {
    const users = getUsers();
    const matched = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!matched) {
      return { success: false, message: 'Invalid credentials. Please verify your email or select a demo account.' };
    }
    if (matched.status === 'pending') {
      return { success: false, message: 'Your registration is pending administrative approval from MoES/IMD Training Directorate.' };
    }
    if (matched.status === 'rejected' || matched.status === 'inactive') {
      return { success: false, message: 'This account is currently inactive or not approved for portal access.' };
    }

    setCurrentUser(matched);
    saveCurrentUser(matched);
    return { success: true };
  };

  const register = (data: Omit<User, 'id' | 'status' | 'joinedDate'>): { success: boolean; message?: string } => {
    const users = getUsers();
    if (users.some(u => u.email.toLowerCase() === data.email.toLowerCase())) {
      return { success: false, message: 'A user with this email address is already registered.' };
    }

    const newUser: User = {
      ...data,
      id: 'user-' + Date.now(),
      status: 'pending', // Demo pending approval requirement
      joinedDate: new Date().toISOString().split('T')[0],
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
    };

    addUser(newUser);
    return { 
      success: true, 
      message: 'Registration request submitted successfully. Account is pending administrative approval.' 
    };
  };

  const logout = () => {
    setCurrentUser(null);
    saveCurrentUser(null);
  };

  const switchDemoRole = (role: UserRole) => {
    const users = getUsers();
    const targetUser = users.find(u => u.role === role && u.status === 'active');
    if (targetUser) {
      setCurrentUser(targetUser);
      saveCurrentUser(targetUser);
    }
  };

  const updateProfile = (updated: Partial<User>) => {
    if (!currentUser) return;
    const newUser = { ...currentUser, ...updated };
    setCurrentUser(newUser);
    updateStorageUser(newUser);
  };

  const markAllNotificationsRead = () => {
    markAllReadStorage();
    setNotifications(getNotifications().map(n => ({ ...n, isRead: true })));
  };

  const unreadNotifsCount = notifications.filter(n => !n.isRead).length;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        login,
        register,
        logout,
        switchDemoRole,
        updateProfile,
        notifications,
        unreadNotifsCount,
        markAllNotificationsRead
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
