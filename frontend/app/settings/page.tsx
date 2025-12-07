'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Save, Users, Building, Lock, Bell, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { apiCall } from '@/lib/api-client';

interface Settings {
  id: string;
  companyName: string;
  companyEmail: string;
  companyAddress: string;
  timezone: string;
  dateFormat: string;
  sessionTimeout: number;
  require2FA: boolean;
  ipWhitelist: boolean;
  notifyLeaveRequests: boolean;
  notifyAttendanceAlert: boolean;
  notifySystemUpdates: boolean;
  notifyBirthdays: boolean;
}

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  active: boolean;
}

export default function SettingsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (session?.user?.role === 'ADMIN') {
      fetchSettings();
      fetchUsers();
    }
  }, [session]);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const { data } = await apiCall.get<Settings>('/api/settings');
      setSettings(data);
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await apiCall.get<User[]>('/api/users');
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleSave = async () => {
    if (!settings) return;
    
    try {
      setIsSaving(true);
      await apiCall.put('/api/settings', settings);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const updateSetting = (field: keyof Settings, value: any) => {
    if (settings) {
      setSettings({ ...settings, [field]: value });
    }
  };

  const isAdmin = session?.user?.role === 'ADMIN';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-moss-50/30 to-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-moss-600 mx-auto"></div>
          <p className="mt-4 text-moss-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-moss-50/30 to-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-center shadow-sm">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock size={32} className="text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-red-900 mb-2">Access Denied</h2>
            <p className="text-red-700 mb-6">
              System settings are only accessible to administrators.
              <br />
              Please contact your administrator if you need to change system configurations.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => router.push('/dashboard')}
                className="flex items-center gap-2 px-6 py-3 bg-moss-500 hover:bg-moss-600 text-white rounded-lg font-medium transition-colors"
              >
                Go to Dashboard
              </button>
              <button
                onClick={() => router.push('/profile')}
                className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-moss-50 text-moss-700 border border-moss-300 rounded-lg font-medium transition-colors"
              >
                View My Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'general', label: 'General Settings', icon: Building },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-moss-50/30 to-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-moss-100 overflow-hidden">
          <div className="bg-gradient-to-r from-moss-500 to-moss-600 px-8 py-6">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-4 py-2 mb-4 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-all border border-white/20 hover:border-white/30 backdrop-blur-sm"
            >
              <ArrowLeft size={16} />
              Back to Dashboard
            </Link>
            <div className="flex items-center gap-3 text-white/90 text-sm font-medium mb-2">
              <Lock size={16} />
              ADMIN PANEL
            </div>
            <h1 className="text-3xl font-bold text-white mb-1">
              System Settings
            </h1>
            <p className="text-moss-50">Manage company configuration and preferences</p>
          </div>
        </div>

        {/* Modern Tabs */}
        <div className="bg-white rounded-2xl border border-moss-100 p-2 shadow-sm">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 font-medium rounded-lg transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-moss-500 to-moss-600 text-white shadow-sm'
                      : 'text-moss-700 hover:bg-moss-50'
                  }`}
                >
                  <IconComponent size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* General Settings */}
        {activeTab === 'general' && (
          <div className="bg-white rounded-2xl shadow-sm border border-moss-100 p-6">
            <h2 className="text-lg font-bold text-moss-900 mb-6 flex items-center gap-2">
              <div className="w-1 h-5 bg-moss-500 rounded-full"></div>
              General Settings
            </h2>

            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-moss-700 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={settings?.companyName || ''}
                    onChange={(e) => updateSetting('companyName', e.target.value)}
                    className="w-full px-4 py-2.5 border border-moss-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-moss-500 focus:border-transparent transition-all text-moss-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-moss-700 mb-2">
                    Company Email
                  </label>
                  <input
                    type="email"
                    value={settings?.companyEmail || ''}
                    onChange={(e) => updateSetting('companyEmail', e.target.value)}
                    className="w-full px-4 py-2.5 border border-moss-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-moss-500 focus:border-transparent transition-all text-moss-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-moss-700 mb-2">
                    Time Zone
                  </label>
                  <select 
                    value={settings?.timezone || 'UTC'}
                    onChange={(e) => updateSetting('timezone', e.target.value)}
                    className="w-full px-4 py-2.5 border border-moss-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-moss-500 focus:border-transparent transition-all text-moss-900"
                  >
                    <option>UTC</option>
                    <option>EST (UTC-5)</option>
                    <option>CST (UTC-6)</option>
                    <option>MST (UTC-7)</option>
                    <option>PST (UTC-8)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-moss-700 mb-2">
                    Date Format
                  </label>
                  <select 
                    value={settings?.dateFormat || 'MM/DD/YYYY'}
                    onChange={(e) => updateSetting('dateFormat', e.target.value)}
                    className="w-full px-4 py-2.5 border border-moss-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-moss-500 focus:border-transparent transition-all text-moss-900"
                  >
                    <option>MM/DD/YYYY</option>
                    <option>DD/MM/YYYY</option>
                    <option>YYYY-MM-DD</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-moss-700 mb-2">
                  Company Address
                </label>
                <textarea
                  value={settings?.companyAddress || ''}
                  onChange={(e) => updateSetting('companyAddress', e.target.value)}
                  className="w-full px-4 py-2.5 border border-moss-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-moss-500 focus:border-transparent transition-all text-moss-900"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex justify-end mt-6 pt-6 border-t border-moss-100">
              <Button onClick={handleSave} isLoading={isSaving} className="gap-2 px-6 py-2.5 bg-gradient-to-r from-moss-500 to-moss-600 text-white rounded-lg font-medium hover:from-moss-600 hover:to-moss-700 transition-all shadow-sm">
                <Save size={18} />
                Save Changes
              </Button>
            </div>
          </div>
        )}

        {/* User Management */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-2xl shadow-sm border border-moss-100 p-6">
            <h2 className="text-lg font-bold text-moss-900 mb-6 flex items-center gap-2">
              <div className="w-1 h-5 bg-moss-500 rounded-full"></div>
              User Management
            </h2>

            {users.length === 0 ? (
              <div className="text-center py-8 text-moss-600">
                <p>No users found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border border-moss-100 rounded-lg">
                    <div>
                      <p className="font-semibold text-moss-900">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-sm text-moss-600">{user.email}</p>
                      <p className="text-xs text-moss-500 mt-1">{user.role}</p>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full ${
                      user.active 
                        ? 'bg-moss-100 text-moss-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {user.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end mt-6 pt-6 border-t border-moss-100">
              <Button 
                onClick={() => router.push('/employees/add')}
                className="gap-2 px-6 py-2.5 bg-gradient-to-r from-moss-500 to-moss-600 text-white rounded-lg font-medium hover:from-moss-600 hover:to-moss-700 transition-all shadow-sm"
              >
                <Users size={18} />
                Add New User
              </Button>
            </div>
          </div>
        )}

        {/* Security Settings */}
        {activeTab === 'security' && (
          <div className="bg-white rounded-2xl shadow-sm border border-moss-100 p-6">
            <h2 className="text-lg font-bold text-moss-900 mb-6 flex items-center gap-2">
              <div className="w-1 h-5 bg-moss-500 rounded-full"></div>
              Security Settings
            </h2>

            <div className="space-y-4">
              <div className="p-4 bg-moss-50 rounded-lg border border-moss-200">
                <h3 className="font-semibold text-moss-900 mb-2">
                  Session Timeout
                </h3>
                <p className="text-sm text-moss-600 mb-3">
                  Users will be logged out after:
                </p>
                <select 
                  value={settings?.sessionTimeout || 30}
                  onChange={(e) => updateSetting('sessionTimeout', parseInt(e.target.value))}
                  className="w-full px-4 py-2.5 bg-white border border-moss-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-moss-500 text-moss-900"
                >
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={60}>1 hour</option>
                  <option value={120}>2 hours</option>
                </select>
              </div>

              <div className="p-4 bg-moss-50 rounded-lg border border-moss-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-moss-900">Two-Factor Authentication</h3>
                    <p className="text-sm text-moss-600 mt-1">
                      Require 2FA for all admin accounts
                    </p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={settings?.require2FA || false}
                    onChange={(e) => updateSetting('require2FA', e.target.checked)}
                    className="w-5 h-5" 
                  />
                </div>
              </div>

              <div className="p-4 bg-moss-50 rounded-lg border border-moss-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-moss-900">IP Whitelisting</h3>
                    <p className="text-sm text-moss-600 mt-1">
                      Restrict access to specific IP addresses
                    </p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={settings?.ipWhitelist || false}
                    onChange={(e) => updateSetting('ipWhitelist', e.target.checked)}
                    className="w-5 h-5" 
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6 pt-6 border-t border-moss-100">
              <Button onClick={handleSave} isLoading={isSaving} className="gap-2 px-6 py-2.5 bg-gradient-to-r from-moss-500 to-moss-600 text-white rounded-lg font-medium hover:from-moss-600 hover:to-moss-700 transition-all shadow-sm">
                <Save size={18} />
                Save Security Settings
              </Button>
            </div>
          </div>
        )}

        {/* Notifications */}
        {activeTab === 'notifications' && (
          <div className="bg-white rounded-2xl shadow-sm border border-moss-100 p-6">
            <h2 className="text-lg font-bold text-moss-900 mb-6 flex items-center gap-2">
              <div className="w-1 h-5 bg-moss-500 rounded-full"></div>
              Notification Settings
            </h2>

            <div className="space-y-4">
              {[
                { 
                  field: 'notifyLeaveRequests' as keyof Settings,
                  label: 'New Leave Requests', 
                  description: 'Notify when employees request leave' 
                },
                { 
                  field: 'notifyAttendanceAlert' as keyof Settings,
                  label: 'Attendance Alerts', 
                  description: 'Alert for low attendance' 
                },
                { 
                  field: 'notifySystemUpdates' as keyof Settings,
                  label: 'System Updates', 
                  description: 'Notify about system updates' 
                },
                { 
                  field: 'notifyBirthdays' as keyof Settings,
                  label: 'Employee Birthdays', 
                  description: 'Remind on employee birthdays' 
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="p-4 bg-moss-50 rounded-lg border border-moss-200 flex items-center justify-between"
                >
                  <div>
                    <h3 className="font-semibold text-moss-900">{item.label}</h3>
                    <p className="text-sm text-moss-600 mt-1">{item.description}</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={settings?.[item.field] as boolean || false}
                    onChange={(e) => updateSetting(item.field, e.target.checked)}
                    className="w-5 h-5" 
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end mt-6 pt-6 border-t border-moss-100">
              <Button onClick={handleSave} isLoading={isSaving} className="gap-2 px-6 py-2.5 bg-gradient-to-r from-moss-500 to-moss-600 text-white rounded-lg font-medium hover:from-moss-600 hover:to-moss-700 transition-all shadow-sm">
                <Save size={18} />
                Save Preferences
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
