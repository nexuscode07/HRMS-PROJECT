import React, { useState } from 'react';
import { Search, Globe, Bell, MessageCircle, ChevronDown, Menu, Moon, Sun } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import NotificationDropdown from '../common/NotificationDropdown';

const Header: React.FC = () => {
  const { user, notifications, darkMode, toggleDarkMode, toggleSidebar } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="bg-white dark:bg-blue-500 shadow-sm border-b border-gray-100 dark:border-gray-700 px-6 py-4 relative top-0 z-50">
      <div className="flex items-center justify-between">
        {/* Left side - Logo and Company name */}
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">N</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Netligent Technologies LLP</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Training & Placement Institute</p>
            </div>
          </div>
        </div>

        {/* Center - Search bar */}
        <div className="flex-1 max-w-2xl mx-4 sm:mx-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-black w-5 h-5" />
            <input
              type="text"
              placeholder="Search Here..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:text-black hover:bg-white dark:hover:bg-gray-200 transition-colors"
            />
          </div>
        </div>

        {/* Right side - Icons and user profile */}
        <div className="flex items-center space-x-4 sm:space-x-6">
          {/* Dark mode toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            )}
          </button>

          {/* Language selector */}
          <div className="hidden sm:flex items-center space-x-2 text-gray-600 dark:text-gray-300 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            <Globe className="w-5 h-5" />
            <span className="text-sm font-medium">English</span>
            <ChevronDown className="w-4 h-4" />
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 hover:bg-white dark:hover:bg-white rounded-lg transition-colors"
            >
              <Bell className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                  {unreadCount}
                </span>
              )}
            </button>
            {showNotifications && (
              <NotificationDropdown onClose={() => setShowNotifications(false)} />
            )}
          </div>

          {/* Messages */}
          <div className="relative cursor-pointer group">
            <div className="p-2 hover:bg-white -700 rounded-lg transition-colors">
              <MessageCircle className="w-6 h-6  text-gray-600 dark:text-gray-300" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                2
              </span>
            </div>
          </div>

          {/* User profile */}
          <div className="flex items-center space-x-3 cursor-pointer rounded-xl p-3 transition-colors">
            <div className="relative">
              <img
                src={user?.avatar}
                alt={user?.name}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover ring-2 ring-gray-100 dark:ring-gray-600"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{user?.name}</p>
              <p className="text-xs text-green-600 dark:text-green-400 flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                online
              </p>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400 hidden sm:block" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;