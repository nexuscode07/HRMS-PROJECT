// ...existing code...
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  User,
  Clock,
  DollarSign,
  Calendar,
  Settings,
  LogOut,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SignOutButton } from '@clerk/clerk-react';

const Sidebar: React.FC = () => {
  const { sidebarCollapsed, toggleSidebar } = useApp();
  const [showLogoutConfirm, setShowLogoutConfirm] = React.useState(false);

  const menuItems = [
    { icon: Home, label: 'Home', path: '' },              // ✅ relative path
    { icon: User, label: 'My Profile', path: 'profile' },
    { icon: Clock, label: 'Attendance', path: 'attendance' },
    { icon: DollarSign, label: 'Payment', path: 'payment' },
    { icon: Calendar, label: 'Leave', path: 'leave' },
    { icon: Settings, label: 'Settings', path: 'settings' }
  ];

  // Remove handleLogout, use SignOutButton below

  // Example user info (replace with real user data from context/auth)
  const user = {
    name: 'John Doe',
    email: 'john.doe@company.com',
    avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=0D8ABC&color=fff',
  };

  return (
    <>
      {sidebarCollapsed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
          aria-label="Sidebar overlay"
        />
      )}

      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg border-r border-white h-full
          transform transition-transform duration-300 ease-in-out
          ${sidebarCollapsed ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        aria-label="Sidebar navigation"
      >
        <div className="flex flex-col h-full">
          {/* User Info */}
          <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-10 h-10 rounded-full border"
              loading="lazy"
            />
            <div className="flex flex-col">
              <span className="font-semibold text-base text-gray-900">{user.name}</span>
              <span className="text-xs text-gray-500">{user.email}</span>
            </div>
          </div>

          {/* Mobile close button */}
          <div className="lg:hidden flex justify-end p-4">
            <button
              onClick={toggleSidebar}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5 text-black" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-6 py-4" aria-label="Main navigation">
            <div className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                // Use 'end' prop for Home route to match only exact root
                const navLinkProps = item.path === '' ? { end: true } : {};
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                        isActive
                          ? 'bg-blue-50 text-blue-600 shadow-sm border-l-4 border-blue-600'
                          : 'text-black hover:bg-gray-100 hover:text-blue-600'
                      }`
                    }
                    {...navLinkProps}
                  >
                    <Icon className="w-5 h-5 transition-colors" />
                    <span className="font-medium text-sm">{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </nav>

          {/* Logout Button */}
          <div className="p-6 border-t border-white mt-auto">
            <button
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200"
              onClick={() => setShowLogoutConfirm(true)}
              aria-label="Logout"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium text-sm">Logout</span>
            </button>
          </div>
        </div>
      </aside>
      {/* Logout Modal rendered outside sidebar for global overlay */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xs text-center relative">
            <h2 className="text-lg font-semibold mb-4">Confirm Logout</h2>
            <p className="mb-6 text-gray-600">Are you sure you want to logout?</p>
            <div className="flex justify-center gap-4">
              <SignOutButton>
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                  autoFocus
                >
                  Yes, Logout
                </button>
              </SignOutButton>
              <button
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
                onClick={() => setShowLogoutConfirm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;

