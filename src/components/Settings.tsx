import { useState } from 'react';
import { Save, Bell, Lock, Users, Palette } from 'lucide-react';
import { Card } from './Card';
import { Button } from './Button';

export function Settings() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    weekly: true,
  });

  const [preferences, setPreferences] = useState({
    language: 'en',
    timezone: 'UTC',
    theme: 'light',
  });

  const handleSaveNotifications = () => {
    alert('Notification settings saved!');
  };

  const handleSavePreferences = () => {
    alert('Preferences saved!');
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-bol-purple mb-2">Settings</h1>
        <p className="text-gray-600">Manage your account and application preferences</p>
      </div>

      <div className="space-y-6">
        <Card borderColor="purple">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-bol-purple/10 rounded-lg">
              <Bell className="text-bol-purple" size={24} />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-bol-purple mb-1">Notifications</h2>
              <p className="text-gray-600 text-sm">Manage how you receive notifications</p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="flex items-center justify-between py-3 border-b border-gray-200">
              <div>
                <p className="font-medium text-bol-purple">Email Notifications</p>
                <p className="text-sm text-gray-500">Receive updates via email</p>
              </div>
              <input
                type="checkbox"
                checked={notifications.email}
                onChange={(e) => setNotifications({ ...notifications, email: e.target.checked })}
                className="w-5 h-5 accent-bol-pink cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between py-3 border-b border-gray-200">
              <div>
                <p className="font-medium text-bol-purple">Push Notifications</p>
                <p className="text-sm text-gray-500">Receive browser notifications</p>
              </div>
              <input
                type="checkbox"
                checked={notifications.push}
                onChange={(e) => setNotifications({ ...notifications, push: e.target.checked })}
                className="w-5 h-5 accent-bol-pink cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-bol-purple">Weekly Summary</p>
                <p className="text-sm text-gray-500">Get a weekly activity summary</p>
              </div>
              <input
                type="checkbox"
                checked={notifications.weekly}
                onChange={(e) => setNotifications({ ...notifications, weekly: e.target.checked })}
                className="w-5 h-5 accent-bol-pink cursor-pointer"
              />
            </label>
          </div>

          <div className="flex justify-end mt-6">
            <Button variant="gradient" onClick={handleSaveNotifications}>
              <Save size={20} className="mr-2" />
              Save Notifications
            </Button>
          </div>
        </Card>

        <Card borderColor="blue">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-bol-blue/10 rounded-lg">
              <Palette className="text-bol-blue" size={24} />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-bol-purple mb-1">Preferences</h2>
              <p className="text-gray-600 text-sm">Customize your experience</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-bol-purple font-medium mb-2">Language</label>
              <select
                value={preferences.language}
                onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-bol-blue focus:outline-none"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="pt">Portuguese</option>
              </select>
            </div>

            <div>
              <label className="block text-bol-purple font-medium mb-2">Timezone</label>
              <select
                value={preferences.timezone}
                onChange={(e) => setPreferences({ ...preferences, timezone: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-bol-blue focus:outline-none"
              >
                <option value="UTC">UTC</option>
                <option value="EST">Eastern Time (EST)</option>
                <option value="PST">Pacific Time (PST)</option>
                <option value="GMT">GMT</option>
              </select>
            </div>

            <div>
              <label className="block text-bol-purple font-medium mb-2">Theme</label>
              <select
                value={preferences.theme}
                onChange={(e) => setPreferences({ ...preferences, theme: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-bol-blue focus:outline-none"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="auto">Auto</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <Button variant="gradient" onClick={handleSavePreferences}>
              <Save size={20} className="mr-2" />
              Save Preferences
            </Button>
          </div>
        </Card>

        <Card borderColor="orange">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-bol-orange/10 rounded-lg">
              <Lock className="text-bol-orange" size={24} />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-bol-purple mb-1">Security</h2>
              <p className="text-gray-600 text-sm">Manage your account security</p>
            </div>
          </div>

          <div className="space-y-3">
            <Button variant="secondary" className="w-full">
              Change Password
            </Button>
            <Button variant="outline" className="w-full">
              Enable Two-Factor Authentication
            </Button>
            <Button variant="outline" className="w-full">
              View Login History
            </Button>
          </div>
        </Card>

        <Card borderColor="pink">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-bol-pink/10 rounded-lg">
              <Users className="text-bol-pink" size={24} />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-bol-purple mb-1">Team Management</h2>
              <p className="text-gray-600 text-sm">Manage team members and permissions</p>
            </div>
          </div>

          <div className="space-y-3">
            <Button variant="gradient" className="w-full">
              Invite Team Members
            </Button>
            <Button variant="outline" className="w-full">
              Manage Roles & Permissions
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
