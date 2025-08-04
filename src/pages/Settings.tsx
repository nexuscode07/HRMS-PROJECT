import React, { useState, useEffect, Suspense } from 'react';
import { Save, Bell, Shield, Globe, Palette, Database, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

// Type definitions
type Settings = {
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  companyAddress: string;
  timezone: string;
  dateFormat: string;
  currency: string;
  language: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  weeklyReports: boolean;
  monthlyReports: boolean;
  twoFactorAuth: boolean;
  sessionTimeout: string;
  passwordPolicy: string;
  theme: string;
  primaryColor: string;
};

type Tab = {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
};

const API_URL = '/api/settings/';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState<Settings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch settings from API
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to fetch settings');
        const data = await response.json();
        setSettings(data);
      } catch (error) {
        console.error('Error fetching settings:', error);
        toast.error('Failed to load settings');
        setSettings(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSettingChange = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings(prev => prev ? { ...prev, [key]: value } : null);
  };

  const handleSave = async () => {
    if (!settings) return;

    try {
      setIsSaving(true);
      const response = await fetch(API_URL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) throw new Error('Failed to save settings');
      toast.success('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const tabs: Tab[] = [
    { id: 'general', name: 'General', icon: Globe },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'appearance', name: 'Appearance', icon: Palette },
    { id: 'integrations', name: 'Integrations', icon: Database },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="text-center py-10 text-red-500">
        Failed to load settings. Please try again later.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your HRMS system preferences and configurations</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm border min-h-[300px]">
            <Suspense fallback={<div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>}>
              {activeTab === 'general' && (
                <GeneralSettings 
                  settings={settings}
                  handleSettingChange={handleSettingChange}
                />
              )}
              {activeTab === 'notifications' && (
                <NotificationSettings 
                  settings={settings}
                  handleSettingChange={handleSettingChange}
                />
              )}
              {activeTab === 'security' && (
                <SecuritySettings 
                  settings={settings}
                  handleSettingChange={handleSettingChange}
                />
              )}
              {activeTab === 'appearance' && (
                <AppearanceSettings 
                  settings={settings}
                  handleSettingChange={handleSettingChange}
                />
              )}
              {activeTab === 'integrations' && (
                <IntegrationSettings />
              )}
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sub-components
interface SettingsComponentProps {
  settings: Settings;
  handleSettingChange: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
}

const GeneralSettings = ({ settings, handleSettingChange }: SettingsComponentProps) => {
  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">General Settings</h3>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Company Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
            <input
              type="text"
              value={settings.companyName}
              onChange={(e) => handleSettingChange('companyName', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          {/* Company Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Company Email</label>
            <input
              type="email"
              value={settings.companyEmail}
              onChange={(e) => handleSettingChange('companyEmail', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <input
              type="tel"
              value={settings.companyPhone}
              onChange={(e) => handleSettingChange('companyPhone', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          {/* Timezone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
            <select
              value={settings.timezone}
              onChange={(e) => handleSettingChange('timezone', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="America/New_York">Eastern Time</option>
              <option value="America/Chicago">Central Time</option>
              <option value="America/Denver">Mountain Time</option>
              <option value="America/Los_Angeles">Pacific Time</option>
              <option value="Asia/Kolkata">India Standard Time</option>
            </select>
          </div>
          
          {/* Date Format */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
            <select
              value={settings.dateFormat}
              onChange={(e) => handleSettingChange('dateFormat', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
          
          {/* Currency */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
            <select
              value={settings.currency}
              onChange={(e) => handleSettingChange('currency', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="INR">INR - Indian Rupee</option>
            </select>
          </div>
        </div>
        
        {/* Company Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Company Address</label>
          <textarea
            value={settings.companyAddress}
            onChange={(e) => handleSettingChange('companyAddress', e.target.value)}
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
};
// Example of a separated component for one tab
const NotificationSettings = ({ 
  settings, 
  handleSettingChange 
}: { 
  settings: Settings, 
  handleSettingChange: (key: keyof Settings, value: any) => void 
}) => {
  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Notification Settings</h3>
      <div className="space-y-6">
        {[
          { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive notifications via email' },
          { key: 'pushNotifications', label: 'Push Notifications', description: 'Receive push notifications in browser' },
          { key: 'smsNotifications', label: 'SMS Notifications', description: 'Receive notifications via SMS' },
          { key: 'weeklyReports', label: 'Weekly Reports', description: 'Receive weekly summary reports' },
          { key: 'monthlyReports', label: 'Monthly Reports', description: 'Receive monthly summary reports' },
        ].map((item) => (
          <div key={item.key} className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">{item.label}</h4>
              <p className="text-sm text-gray-500">{item.description}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings[item.key as keyof Settings] as boolean}
                onChange={(e) => handleSettingChange(item.key as keyof Settings, e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};


// Security Settings Component
const SecuritySettings = ({ settings, handleSettingChange }: SettingsComponentProps) => (
  <div className="p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-6">Security Settings</h3>
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h4>
          <p className="text-sm text-gray-500">Require 2FA for login</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.twoFactorAuth}
            onChange={e => handleSettingChange('twoFactorAuth', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-blue-600"></div>
        </label>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-medium text-gray-900">Session Timeout (minutes)</h4>
          <p className="text-sm text-gray-500">Auto logout after inactivity</p>
        </div>
        <input
          type="number"
          min={5}
          max={120}
          value={settings.sessionTimeout}
          onChange={e => handleSettingChange('sessionTimeout', e.target.value)}
          className="border border-gray-300 rounded px-2 py-1 w-20"
        />
      </div>
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-medium text-gray-900">Password Policy</h4>
          <p className="text-sm text-gray-500">Set password strength requirements</p>
        </div>
        <select
          value={settings.passwordPolicy}
          onChange={e => handleSettingChange('passwordPolicy', e.target.value)}
          className="border border-gray-300 rounded px-2 py-1"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
    </div>
  </div>
);

// Appearance Settings Component
const AppearanceSettings = ({ settings, handleSettingChange }: SettingsComponentProps) => (
  <div className="p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-6">Appearance Settings</h3>
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-medium text-gray-900">Theme</h4>
          <p className="text-sm text-gray-500">Choose light or dark mode</p>
        </div>
        <select
          value={settings.theme || 'light'}
          onChange={e => handleSettingChange('theme', e.target.value)}
          className="border border-gray-300 rounded px-2 py-1"
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-medium text-gray-900">Primary Color</h4>
          <p className="text-sm text-gray-500">Set the main accent color</p>
        </div>
        <input
          type="color"
          value={settings.primaryColor || '#3B82F6'}
          onChange={e => handleSettingChange('primaryColor', e.target.value)}
          className="w-10 h-10 border rounded"
        />
      </div>
    </div>
  </div>
);

// Integration Settings Component
const IntegrationSettings = () => (
  <div className="p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-6">Integrations</h3>
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-medium text-gray-900">No integrations configured.</h4>
        <p className="text-sm text-gray-500">Connect with payroll, email, or other services here.</p>
      </div>
    </div>
  </div>
);