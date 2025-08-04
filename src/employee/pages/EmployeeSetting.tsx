import React, { useState } from 'react';
import { Lock, Bell, User, Globe, Camera } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { useApp } from '../context/AppContext';

const EmployeeSetting: React.FC = () => {
  const { user } = useApp();
  const [activeTab, setActiveTab] = useState('profile');
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const tabs = [
    { id: 'profile', label: 'Profile Settings', icon: User },
    { id: 'password', label: 'Change Password', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'preferences', label: 'Preferences', icon: Globe }
  ];

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    console.log('Password change:', passwordForm);
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <div className="space-y-6">
      {/* Settings Navigation */}
      <Card padding="sm">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </Card>

      {/* Tab Content */}
      <Card>
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-black">Profile Settings</h3>
            <div className="flex items-center space-x-6">
              <div className="relative">
                <img
                  src={user?.avatar}
                  alt={user?.name}
                  className="w-20 h-20 rounded-full object-cover ring-4 ring-gray-100"
                />
                <button className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <div>
                <h4 className="text-lg font-medium text-black">{user?.name}</h4>
                <p className="text-black">{user?.email}</p>
                <Button variant="secondary" size="sm" className="mt-2">
                  Change Photo
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: 'Full Name', value: user?.name, type: 'text' },
                { label: 'Email', value: user?.email, type: 'email' },
                { label: 'Phone', value: user?.phone, type: 'tel' },
                { label: 'Department', value: user?.department, type: 'text', disabled: true }
              ].map((field, index) => (
                <div key={index}>
                  <label className="block text-sm font-medium text-black mb-2">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    defaultValue={field.value}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-black"
                    disabled={field.disabled}
                  />
                </div>
              ))}
            </div>

            <Button variant="primary">Save Changes</Button>
          </div>
        )}

        {activeTab === 'password' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-black">Change Password</h3>
            <form onSubmit={handlePasswordChange} className="space-y-6 max-w-md">
              {[
                { label: 'Current Password', name: 'currentPassword' },
                { label: 'New Password', name: 'newPassword' },
                { label: 'Confirm New Password', name: 'confirmPassword' }
              ].map((field, idx) => (
                <div key={idx}>
                  <label className="block text-sm font-medium text-black mb-2">
                    {field.label}
                  </label>
                  <input
                    type="password"
                    value={passwordForm[field.name as keyof typeof passwordForm]}
                    onChange={(e) => setPasswordForm({ ...passwordForm, [field.name]: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-black"
                    required
                  />
                </div>
              ))}
              <Button type="submit" variant="primary">
                Update Password
              </Button>
            </form>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-black">Notification Preferences</h3>
            <div className="space-y-4">
              {[
                { title: 'Email Notifications', desc: 'Receive notifications via email' },
                { title: 'Leave Approvals', desc: 'Get notified when leave requests are approved/rejected' },
                { title: 'Meeting Reminders', desc: 'Receive reminders for upcoming meetings' },
                { title: 'Payroll Updates', desc: 'Get notified about salary and payroll updates' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-black">{item.title}</h4>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
              ))}
            </div>
            <Button variant="primary">Save Preferences</Button>
          </div>
        )}

        {activeTab === 'preferences' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-black">General Preferences</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-black">Dark Mode</h4>
                  <p className="text-sm text-gray-600">Toggle dark mode theme</p>
                </div>
                <span className="text-sm text-gray-500">Disabled</span>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">Language</label>
                <select className="w-full max-w-xs border border-gray-300 rounded-lg px-3 py-2 bg-white text-black">
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">Timezone</label>
                <select className="w-full max-w-xs border border-gray-300 rounded-lg px-3 py-2 bg-white text-black">
                  <option value="UTC">UTC</option>
                  <option value="EST">Eastern Time</option>
                  <option value="PST">Pacific Time</option>
                  <option value="CST">Central Time</option>
                </select>
              </div>
            </div>
            <Button variant="primary">Save Preferences</Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default EmployeeSetting;
