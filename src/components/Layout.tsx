import React from 'react';
import MeetingList from './MeetingList';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  User, 
  Clock, 
  Users, 
  DollarSign, 
  UserPlus, 
  Settings, 
  LogOut,
  Search,
  Bell,
  Globe,
  Menu,
  X
} from 'lucide-react';
import { useUser } from '../contexts/clerkHooks';
import { SignOutButton } from '@clerk/clerk-react';
import { useMeeting } from '../contexts/MeetingContext';

const navigation = [
  { name: 'Home', href: '/dashboard', icon: Home },
  { name: 'Leave Management', href: '/dashboard/leave-management', icon: Calendar },
  { name: 'Profile Management', href: '/dashboard/profile-management', icon: User },
  { name: 'Attendance', href: '/dashboard/attendance', icon: Clock },
  { name: 'Employee management', href: '/dashboard/employee-management', icon: Users },
  { name: 'Payroll', href: '/dashboard/payroll', icon: DollarSign },
  { name: 'Recruitment', href: '/dashboard/recruitment', icon: UserPlus },
  { name: 'Setting', href: '/dashboard/settings', icon: Settings },
];

import { useNavigate } from 'react-router-dom';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [showLogoutConfirm, setShowLogoutConfirm] = React.useState(false);
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [showProfileMenu, setShowProfileMenu] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const { showMeetings, setShowMeetings } = useMeeting();
  // Fetch employees and meetings from API
  const [employees, setEmployees] = React.useState([]);
  const [meetings, setMeetings] = React.useState([]);

  React.useEffect(() => {
    // Fetch employees
    fetch('http://127.0.0.1:8000/api/employees/')
      .then(res => res.json())
      .then(data => setEmployees(data))
      .catch(() => setEmployees([]));
    // Fetch meetings for current user if available
    if (user?.id) {
      fetch(`http://127.0.0.1:8000/api/meetings/?employeeId=${user.id}`)
        .then(res => res.json())
        .then(data => setMeetings(data))
        .catch(() => setMeetings([]));
    }
  }, [user?.id]);

  // Dynamic search state
  const [search, setSearch] = React.useState('');
  const [showDropdown, setShowDropdown] = React.useState(false);
  const searchResults =
    search.trim().length > 0
      ? navigation.filter((item) =>
          item.name.toLowerCase().includes(search.trim().toLowerCase())
        )
      : [];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setShowDropdown(e.target.value.trim().length > 0);
  };

  const handleResultClick = (href: string) => {
    setSearch('');
    setShowDropdown(false);
    window.location.href = href;
  };

  const handleBlur = () => {
    setTimeout(() => setShowDropdown(false), 100); // allow click
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
          <div className="fixed top-0 left-0 w-64 h-full bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <img src="https://images.pexels.com/photos/1181533/pexels-photo-1181533.jpeg?auto=compress&cs=tinysrgb&w=200&h=60&fit=crop" alt="NetLigent Technologies" className="h-8" />
              <button onClick={() => setSidebarOpen(false)} className="p-2">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="p-4">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center px-4 py-3 mb-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                      location.pathname === item.href
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </Link>
                );
              })}
              <button
                className="flex items-center w-full px-4 py-3 mt-4 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors duration-200"
                onClick={() => setShowLogoutConfirm(true)}
              >
                <LogOut className="w-5 h-5 mr-3" />
                Logout
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:bg-white lg:border-r lg:border-gray-200">
        <div className="flex items-center h-16 px-6 border-b border-gray-200">
          <img src="https://images.pexels.com/photos/1181533/pexels-photo-1181533.jpeg?auto=compress&cs=tinysrgb&w=200&h=60&fit=crop" alt="NetLigent Technologies" className="h-8" />
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  location.pathname === item.href
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            );
          })}
          <button
            className="flex items-center w-full px-4 py-3 mt-8 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors duration-200"
            onClick={() => setShowLogoutConfirm(true)}
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </nav>
        {/* Logout Confirmation Dialog */}
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xs text-center relative">
              <h2 className="text-lg font-semibold mb-4">Confirm Logout</h2>
              <p className="mb-6 text-gray-600">Are you sure you want to logout?</p>
              <div className="flex justify-center gap-4">
                <SignOutButton>
                  <button
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
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
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header */}
        <header className="bg-white border-b border-gray-200 px-4 lg:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-md text-gray-500 lg:hidden"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div className="relative ml-4 lg:ml-0 w-64 lg:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search Here..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                  value={search}
                  onChange={handleSearchChange}
                  onFocus={() => setShowDropdown(search.trim().length > 0)}
                  onBlur={handleBlur}
                />
                {showDropdown && searchResults.length > 0 && (
                  <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-auto">
                    {searchResults.map((item) => (
                      <div
                        key={item.name}
                        className="flex items-center px-4 py-2 cursor-pointer hover:bg-blue-50 text-gray-700"
                        onMouseDown={() => handleResultClick(item.href)}
                      >
                        <item.icon className="w-4 h-4 mr-2 text-blue-600" />
                        {item.name}
                      </div>
                    ))}
                  </div>
                )}
                {showDropdown && search.trim().length > 0 && searchResults.length === 0 && (
                  <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 px-4 py-2 text-gray-400">
                    No results found
                  </div>
                )}
              </div>
          
            </div>
            <div className="flex items-center space-x-4">
              <button className="flex items-center px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Globe className="w-4 h-4 mr-2" />
                English
              </button>
              {/* Notification Bell */}
              <button
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg relative"
                onClick={() => setShowNotifications((v) => !v)}
              >
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              {/* Profile Circle */}
              <div className="flex items-center space-x-3">
                <div
                  className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer"
                  onClick={() => navigate('/dashboard/profile-management')}
                  title="Open Profile Management"
                >
                  <span className="text-white text-sm font-medium">
                    {user?.firstName?.charAt(0) || 'U'}
                  </span>
                </div>
                <div className="hidden lg:block">
                  <div className="text-sm font-medium text-gray-900">{user?.firstName || user?.username}</div>
                  <div className="text-xs text-green-600">● online</div>
                </div>
              </div>
            </div>
      {/* Notification Panel */}
      {showNotifications && (
        <div className="fixed inset-0 z-50 flex items-end justify-end pointer-events-none">
          <div className="bg-white shadow-lg rounded-lg w-full max-w-sm m-6 p-4 pointer-events-auto border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
              <button className="text-gray-500 hover:text-gray-700" onClick={() => setShowNotifications(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            {/* Demo notifications, replace with real data if available */}
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {/* You can replace this with notifications from context or props */}
              <div className="flex items-start space-x-3 border-b pb-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-medium">A</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 mb-1">Admin</p>
                  <p className="text-xs text-gray-600 mb-2">Welcome to the HRMS Portal!</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Just now</span>
                  </div>
                </div>
              </div>
              <div className="flex items-start space-x-3 border-b pb-2">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-medium">S</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 mb-1">System</p>
                  <p className="text-xs text-gray-600 mb-2">Your leave request was approved.</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">2 hours ago</span>
                  </div>
                </div>
              </div>
              {/* Add more notifications as needed */}
            </div>
          </div>
        </div>
      )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {children}
          </div>
          <Outlet/>
          {/* Meeting Schedule Modal */}
          {showMeetings && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl relative">
                <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={() => setShowMeetings(false)}>
                  <X className="w-6 h-6" />
                </button>
                <MeetingList meetings={meetings} employees={employees} />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}