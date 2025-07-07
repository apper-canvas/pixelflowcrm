import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Header from '@/components/organisms/Header';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import settingsService from '@/services/api/settingsService';
import ApperIcon from '@/components/ApperIcon';

const SettingsPage = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      setLoading(true);
      setError(null);
      const settingsData = await settingsService.getSettings();
      setSettings(settingsData);
    } catch (err) {
      setError('Failed to load settings');
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveSettings() {
    try {
      setSaving(true);
      await settingsService.updateSettings(settings);
      toast.success('Settings saved successfully');
    } catch (err) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  }

  function handleInputChange(section, field, value) {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  }

  function handleToggle(section, field) {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: !prev[section][field]
      }
    }));
  }

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadSettings} />;

  return (
    <div className="h-full flex flex-col">
      <Header
        title="Settings"
        subtitle="Manage your account preferences and application settings"
        action={
          <Button onClick={handleSaveSettings} disabled={saving}>
            {saving ? (
              <>
                <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <ApperIcon name="Save" size={16} className="mr-2" />
                Save Changes
              </>
            )}
          </Button>
        }
      />
      
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto p-6">
          <div className="space-y-8">
            {/* Account Settings */}
            <div className="bg-white rounded-lg shadow-micro border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <ApperIcon name="User" size={20} className="mr-3" />
                  Account Settings
                </h3>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <Input
                      value={settings?.account?.fullName || ''}
                      onChange={(e) => handleInputChange('account', 'fullName', e.target.value)}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <Input
                      type="email"
                      value={settings?.account?.email || ''}
                      onChange={(e) => handleInputChange('account', 'email', e.target.value)}
                      placeholder="Enter your email"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company
                    </label>
                    <Input
                      value={settings?.account?.company || ''}
                      onChange={(e) => handleInputChange('account', 'company', e.target.value)}
                      placeholder="Enter your company name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <Input
                      type="tel"
                      value={settings?.account?.phone || ''}
                      onChange={(e) => handleInputChange('account', 'phone', e.target.value)}
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <div className="bg-white rounded-lg shadow-micro border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <ApperIcon name="Bell" size={20} className="mr-3" />
                  Notification Settings
                </h3>
              </div>
              <div className="p-6 space-y-4">
                {[
                  { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive email notifications for important updates' },
                  { key: 'pushNotifications', label: 'Push Notifications', description: 'Receive push notifications in your browser' },
                  { key: 'dealUpdates', label: 'Deal Updates', description: 'Get notified when deals are updated or moved' },
                  { key: 'activityReminders', label: 'Activity Reminders', description: 'Receive reminders for upcoming activities' },
                  { key: 'weeklyReports', label: 'Weekly Reports', description: 'Get weekly summary reports via email' }
                ].map((notification) => (
                  <div key={notification.key} className="flex items-center justify-between py-3">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">{notification.label}</h4>
                      <p className="text-sm text-gray-500">{notification.description}</p>
                    </div>
                    <button
                      onClick={() => handleToggle('notifications', notification.key)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                        settings?.notifications?.[notification.key] ? 'bg-primary-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings?.notifications?.[notification.key] ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Appearance Settings */}
            <div className="bg-white rounded-lg shadow-micro border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <ApperIcon name="Palette" size={20} className="mr-3" />
                  Appearance Settings
                </h3>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Theme
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {['light', 'dark', 'system'].map((theme) => (
                      <button
                        key={theme}
                        onClick={() => handleInputChange('appearance', 'theme', theme)}
                        className={`p-3 text-center border rounded-lg transition-colors ${
                          settings?.appearance?.theme === theme
                            ? 'border-primary-600 bg-primary-50 text-primary-600'
                            : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-center mb-2">
                          <ApperIcon 
                            name={theme === 'light' ? 'Sun' : theme === 'dark' ? 'Moon' : 'Monitor'} 
                            size={20} 
                          />
                        </div>
                        <span className="text-sm font-medium capitalize">{theme}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Language
                  </label>
                  <select
                    value={settings?.appearance?.language || 'en'}
                    onChange={(e) => handleInputChange('appearance', 'language', e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date Format
                  </label>
                  <select
                    value={settings?.appearance?.dateFormat || 'MM/DD/YYYY'}
                    onChange={(e) => handleInputChange('appearance', 'dateFormat', e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Privacy & Security */}
            <div className="bg-white rounded-lg shadow-micro border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <ApperIcon name="Shield" size={20} className="mr-3" />
                  Privacy & Security
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between py-3">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h4>
                    <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                  </div>
                  <Button variant="outline" onClick={() => toast.info('Two-factor authentication setup coming soon')}>
                    Enable
                  </Button>
                </div>
                
                <div className="flex items-center justify-between py-3">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900">Data Export</h4>
                    <p className="text-sm text-gray-500">Download a copy of your data</p>
                  </div>
                  <Button variant="outline" onClick={() => toast.info('Data export functionality coming soon')}>
                    Export
                  </Button>
                </div>

                <div className="flex items-center justify-between py-3">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900">Delete Account</h4>
                    <p className="text-sm text-gray-500">Permanently delete your account and all data</p>
                  </div>
                  <Button variant="outline" className="text-red-600 border-red-300 hover:bg-red-50" onClick={() => toast.warning('Account deletion requires admin confirmation')}>
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;