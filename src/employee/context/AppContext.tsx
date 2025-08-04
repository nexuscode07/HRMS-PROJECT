import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Notification {
  id: number;
  message: string;
  read: boolean;
  timestamp: string;
  type: 'success' | 'error';
}

interface User {
  name: string;
  email: string;
  phone: string;
  employeeId: string;
  position: string;
  department: string;
  avatar: string;
}

interface AppContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  removeNotification: (id: number) => void;
  user: User | null;
  setUser: (user: User) => void;
}

// ✅ Fix: export AppContext as named export
export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  // Set a default user for development/testing. Replace with real login logic in production.
  const [user, setUser] = useState<User | null>({
    name: 'Test User',
    email: 'test@example.com',
    phone: '1234567890',
    employeeId: '1',
    position: 'Developer',
    department: 'Engineering',
    avatar: ''
  });

  const toggleDarkMode = () => setDarkMode((prev) => !prev);
  const toggleSidebar = () => setSidebarCollapsed((prev) => !prev);

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now(),
      timestamp: new Date().toISOString(),
      read: false,
    };
    setNotifications((prev) => [newNotification, ...prev]);
  };

  const removeNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        darkMode,
        toggleDarkMode,
        sidebarCollapsed,
        toggleSidebar,
        notifications,
        addNotification,
        removeNotification,
        user,
        setUser
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
