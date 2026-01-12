/**
 * Professional Settings Section - Industry Standard like Upwork
 * Comprehensive settings with full functionality
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Shield, Bell, Eye, CreditCard, Link2, Accessibility, Palette,
  ChevronRight, Check, X, Mail, Phone, Globe, Clock, DollarSign,
  Smartphone, Monitor, Lock, Key, AlertTriangle, Trash2, Plus,
  ExternalLink, Copy, RefreshCw, LogOut, Settings, Camera, Edit3,
  Moon, Sun, Laptop, Volume2, VolumeX, MessageSquare, Calendar,
  Building, FileText, Download, Upload, HelpCircle, Info, CheckCircle,
  XCircle, AlertCircle, Zap, Database, Webhook, Github, Linkedin,
  Twitter, Facebook, Apple, Chrome
} from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import {
  AddPaymentMethodModal,
  AddWithdrawalMethodModal,
  EditBillingAddressModal,
  EditTaxInfoModal,
  GenerateApiKeyModal,
  EditPersonalInfoModal,
  SuccessToast
} from './SettingsModals';

// Settings navigation items
const settingsNav = [
  { id: 'account', label: 'Account', icon: User, description: 'Personal info, email, phone' },
  { id: 'security', label: 'Security', icon: Shield, description: 'Password, 2FA, sessions' },
  { id: 'notifications', label: 'Notifications', icon: Bell, description: 'Email, push, SMS alerts' },
  { id: 'privacy', label: 'Privacy', icon: Eye, description: 'Profile visibility, data' },
  { id: 'billing', label: 'Billing & Payments', icon: CreditCard, description: 'Payment methods, invoices' },
  { id: 'integrations', label: 'Integrations', icon: Link2, description: 'Connected apps, API' },
  { id: 'accessibility', label: 'Accessibility', icon: Accessibility, description: 'Display, motion, contrast' },
  { id: 'appearance', label: 'Appearance', icon: Palette, description: 'Theme, colors, layout' },
];

// Toggle Switch Component
const ToggleSwitch: React.FC<{
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  disabled?: boolean;
}> = ({ enabled, onChange, disabled = false }) => (
  <button
    onClick={() => !disabled && onChange(!enabled)}
    disabled={disabled}
    className={`relative w-12 h-6 rounded-full transition-all duration-200 ${
      enabled ? 'bg-[#1e3a5f]' : 'bg-slate-300'
    } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
  >
    <div
      className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 ${
        enabled ? 'translate-x-6' : 'translate-x-0.5'
      }`}
    />
  </button>
);

// Setting Row Component
const SettingRow: React.FC<{
  icon?: React.ReactNode;
  title: string;
  description?: string;
  children: React.ReactNode;
  danger?: boolean;
}> = ({ icon, title, description, children, danger = false }) => (
  <div className={`flex items-center justify-between p-4 rounded-xl transition-colors ${
    danger ? 'bg-red-50 hover:bg-red-100' : 'bg-slate-50 hover:bg-slate-100'
  }`}>
    <div className="flex items-center gap-3">
      {icon && (
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
          danger ? 'bg-red-100 text-red-600' : 'bg-white text-[#1e3a5f]'
        }`}>
          {icon}
        </div>
      )}
      <div>
        <p className={`font-medium ${danger ? 'text-red-700' : 'text-slate-800'}`}>{title}</p>
        {description && <p className="text-sm text-slate-500">{description}</p>}
      </div>
    </div>
    <div>{children}</div>
  </div>
);

// Section Header Component
const SectionHeader: React.FC<{
  title: string;
  description?: string;
  action?: React.ReactNode;
}> = ({ title, description, action }) => (
  <div className="flex items-center justify-between mb-6">
    <div>
      <h2 className="text-xl font-bold text-[#1e3a5f]">{title}</h2>
      {description && <p className="text-sm text-slate-500 mt-1">{description}</p>}
    </div>
    {action}
  </div>
);

// Card Component
const SettingsCard: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <div className={`bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-slate-100 ${className}`}>
    {children}
  </div>
);

// Account Settings Section
const AccountSettings: React.FC = () => {
  const { settings, updateAccountSettings } = useSettings();
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleEdit = (field: string, value: string) => {
    setEditingField(field);
    setTempValue(value);
  };

  const handleSave = (field: string) => {
    updateAccountSettings({ [field]: tempValue });
    setEditingField(null);
    setSuccessMessage(`${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully`);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleCancel = () => {
    setEditingField(null);
    setTempValue('');
  };

  return (
    <div className="space-y-6">
      <SectionHeader 
        title="Account Settings" 
        description="Manage your personal information and preferences"
      />

      {/* Profile Photo */}
      <SettingsCard>
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#f59e0b] to-[#d97706] flex items-center justify-center text-white text-3xl font-bold">
              JD
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-[#1e3a5f] rounded-full flex items-center justify-center text-white hover:bg-[#2d5a8c] transition-colors">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">Profile Photo</h3>
            <p className="text-sm text-slate-500 mb-3">JPG, PNG or GIF. Max size 5MB.</p>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-[#1e3a5f] text-white rounded-lg text-sm font-medium hover:bg-[#2d5a8c] transition-colors">
                Upload Photo
              </button>
              <button className="px-4 py-2 border border-slate-300 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
                Remove
              </button>
            </div>
          </div>
        </div>
      </SettingsCard>

      {/* Personal Information */}
      <SettingsCard>
        <SectionHeader title="Personal Information" />
        <div className="space-y-4">
          {/* Email */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-[#1e3a5f]">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Email Address</p>
                {editingField === 'email' ? (
                  <input
                    type="email"
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                    className="font-medium text-slate-800 bg-white border border-slate-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]"
                  />
                ) : (
                  <p className="font-medium text-slate-800">{settings.account.email}</p>
                )}
              </div>
            </div>
            {editingField === 'email' ? (
              <div className="flex gap-2">
                <button onClick={() => handleSave('email')} className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200">
                  <Check className="w-4 h-4" />
                </button>
                <button onClick={handleCancel} className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => handleEdit('email', settings.account.email)}
                className="px-4 py-2 text-[#1e3a5f] font-medium hover:bg-slate-100 rounded-lg transition-colors"
              >
                Edit
              </button>
            )}
          </div>

          {/* Phone */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-[#1e3a5f]">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Phone Number</p>
                {editingField === 'phone' ? (
                  <input
                    type="tel"
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                    className="font-medium text-slate-800 bg-white border border-slate-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]"
                  />
                ) : (
                  <p className="font-medium text-slate-800">{settings.account.phone}</p>
                )}
              </div>
            </div>
            {editingField === 'phone' ? (
              <div className="flex gap-2">
                <button onClick={() => handleSave('phone')} className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200">
                  <Check className="w-4 h-4" />
                </button>
                <button onClick={handleCancel} className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => handleEdit('phone', settings.account.phone)}
                className="px-4 py-2 text-[#1e3a5f] font-medium hover:bg-slate-100 rounded-lg transition-colors"
              >
                Edit
              </button>
            )}
          </div>

          {/* Username */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-[#1e3a5f]">
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Username</p>
                <p className="font-medium text-slate-800">@{settings.account.username}</p>
              </div>
            </div>
            <button className="px-4 py-2 text-[#1e3a5f] font-medium hover:bg-slate-100 rounded-lg transition-colors">
              Edit
            </button>
          </div>
        </div>
      </SettingsCard>

      {/* Regional Settings */}
      <SettingsCard>
        <SectionHeader title="Regional Settings" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <Globe className="w-5 h-5 text-[#1e3a5f]" />
              <span className="text-sm text-slate-500">Language</span>
            </div>
            <select 
              value={settings.account.language}
              onChange={(e) => updateAccountSettings({ language: e.target.value })}
              className="w-full p-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]"
            >
              <option value="en">English (US)</option>
              <option value="en-gb">English (UK)</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
              <option value="zh">中文</option>
              <option value="ja">日本語</option>
            </select>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <Clock className="w-5 h-5 text-[#1e3a5f]" />
              <span className="text-sm text-slate-500">Timezone</span>
            </div>
            <select 
              value={settings.account.timezone}
              onChange={(e) => updateAccountSettings({ timezone: e.target.value })}
              className="w-full p-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]"
            >
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
              <option value="America/Denver">Mountain Time (MT)</option>
              <option value="America/Chicago">Central Time (CT)</option>
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="Europe/London">London (GMT)</option>
              <option value="Europe/Paris">Paris (CET)</option>
              <option value="Asia/Tokyo">Tokyo (JST)</option>
            </select>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <DollarSign className="w-5 h-5 text-[#1e3a5f]" />
              <span className="text-sm text-slate-500">Currency</span>
            </div>
            <select 
              value={settings.account.currency}
              onChange={(e) => updateAccountSettings({ currency: e.target.value })}
              className="w-full p-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="CAD">CAD ($)</option>
              <option value="AUD">AUD ($)</option>
              <option value="JPY">JPY (¥)</option>
            </select>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <Calendar className="w-5 h-5 text-[#1e3a5f]" />
              <span className="text-sm text-slate-500">Date Format</span>
            </div>
            <select 
              value={settings.account.dateFormat}
              onChange={(e) => updateAccountSettings({ dateFormat: e.target.value })}
              className="w-full p-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]"
            >
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
        </div>
      </SettingsCard>

      {/* Account Type */}
      <SettingsCard>
        <SectionHeader title="Account Type" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { id: 'freelancer', label: 'Freelancer', description: 'Find work and get hired', icon: User },
            { id: 'client', label: 'Client', description: 'Hire talent for projects', icon: Building },
            { id: 'agency', label: 'Agency', description: 'Manage a team of freelancers', icon: Building },
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => updateAccountSettings({ accountType: type.id as any })}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                settings.account.accountType === type.id
                  ? 'border-[#1e3a5f] bg-[#1e3a5f]/5'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <type.icon className={`w-6 h-6 mb-2 ${
                settings.account.accountType === type.id ? 'text-[#1e3a5f]' : 'text-slate-400'
              }`} />
              <p className="font-semibold text-slate-800">{type.label}</p>
              <p className="text-sm text-slate-500">{type.description}</p>
            </button>
          ))}
        </div>
      </SettingsCard>

      {/* Success Toast */}
      <SuccessToast
        message={successMessage}
        isVisible={!!successMessage}
        onClose={() => setSuccessMessage('')}
      />
    </div>
  );
};

// Security Settings Section
const SecuritySettings: React.FC = () => {
  const { settings, updateSecuritySettings, revokeSession, removeTrustedDevice } = useSettings();
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });
  const [successMessage, setSuccessMessage] = useState('');

  const handleUpdatePassword = () => {
    if (passwordForm.new !== passwordForm.confirm) {
      alert('Passwords do not match');
      return;
    }
    if (passwordForm.new.length < 8) {
      alert('Password must be at least 8 characters');
      return;
    }
    updateSecuritySettings({ passwordLastChanged: new Date().toISOString() });
    setShowChangePassword(false);
    setPasswordForm({ current: '', new: '', confirm: '' });
    setSuccessMessage('Password updated successfully');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleRevokeSession = (id: string) => {
    revokeSession(id);
    setSuccessMessage('Session revoked successfully');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleRemoveDevice = (id: string) => {
    removeTrustedDevice(id);
    setSuccessMessage('Device removed successfully');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <div className="space-y-6">
      <SectionHeader 
        title="Security Settings" 
        description="Protect your account with these security options"
      />

      {/* Password */}
      <SettingsCard>
        <SectionHeader title="Password" />
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-[#1e3a5f]">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium text-slate-800">Password</p>
                <p className="text-sm text-slate-500">
                  Last changed {new Date(settings.security.passwordLastChanged).toLocaleDateString()}
                </p>
              </div>
            </div>
            <button 
              onClick={() => setShowChangePassword(!showChangePassword)}
              className="px-4 py-2 bg-[#1e3a5f] text-white rounded-lg font-medium hover:bg-[#2d5a8c] transition-colors"
            >
              Change Password
            </button>
          </div>

          <AnimatePresence>
            {showChangePassword && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-4 bg-slate-50 rounded-xl space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Current Password</label>
                  <input
                    type="password"
                    value={passwordForm.current}
                    onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                    className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]"
                    placeholder="Enter current password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
                  <input
                    type="password"
                    value={passwordForm.new}
                    onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                    className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]"
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordForm.confirm}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                    className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]"
                    placeholder="Confirm new password"
                  />
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={handleUpdatePassword}
                    className="px-4 py-2 bg-[#1e3a5f] text-white rounded-lg font-medium hover:bg-[#2d5a8c] transition-colors"
                  >
                    Update Password
                  </button>
                  <button 
                    onClick={() => setShowChangePassword(false)}
                    className="px-4 py-2 border border-slate-300 text-slate-600 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </SettingsCard>

      {/* Two-Factor Authentication */}
      <SettingsCard>
        <SectionHeader title="Two-Factor Authentication" />
        <div className="space-y-4">
          <SettingRow
            icon={<Shield className="w-5 h-5" />}
            title="Enable Two-Factor Authentication"
            description="Add an extra layer of security to your account"
          >
            <ToggleSwitch
              enabled={settings.security.twoFactorEnabled}
              onChange={(enabled) => updateSecuritySettings({ twoFactorEnabled: enabled })}
            />
          </SettingRow>

          {settings.security.twoFactorEnabled && (
            <div className="p-4 bg-slate-50 rounded-xl">
              <p className="text-sm font-medium text-slate-700 mb-3">Authentication Method</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { id: 'app', label: 'Authenticator App', icon: Smartphone },
                  { id: 'sms', label: 'SMS', icon: MessageSquare },
                  { id: 'email', label: 'Email', icon: Mail },
                ].map((method) => (
                  <button
                    key={method.id}
                    onClick={() => updateSecuritySettings({ twoFactorMethod: method.id as any })}
                    className={`p-3 rounded-lg border-2 transition-all flex items-center gap-2 ${
                      settings.security.twoFactorMethod === method.id
                        ? 'border-[#1e3a5f] bg-[#1e3a5f]/5'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <method.icon className={`w-5 h-5 ${
                      settings.security.twoFactorMethod === method.id ? 'text-[#1e3a5f]' : 'text-slate-400'
                    }`} />
                    <span className="font-medium text-slate-700">{method.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <SettingRow
            icon={<Bell className="w-5 h-5" />}
            title="Login Alerts"
            description="Get notified when someone logs into your account"
          >
            <ToggleSwitch
              enabled={settings.security.loginAlerts}
              onChange={(enabled) => updateSecuritySettings({ loginAlerts: enabled })}
            />
          </SettingRow>
        </div>
      </SettingsCard>

      {/* Active Sessions */}
      <SettingsCard>
        <SectionHeader 
          title="Active Sessions" 
          action={
            <button className="text-red-600 font-medium hover:text-red-700 transition-colors">
              Sign out all other sessions
            </button>
          }
        />
        <div className="space-y-3">
          {settings.security.activeSessions.map((session) => (
            <div key={session.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-[#1e3a5f]">
                  {session.device.includes('iPhone') ? <Smartphone className="w-5 h-5" /> : <Monitor className="w-5 h-5" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-slate-800">{session.device}</p>
                    {session.isCurrent && (
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-500">
                    {session.browser} • {session.location} • Last active {new Date(session.lastActive).toLocaleDateString()}
                  </p>
                </div>
              </div>
              {!session.isCurrent && (
                <button 
                  onClick={() => handleRevokeSession(session.id)}
                  className="px-4 py-2 text-red-600 font-medium hover:bg-red-50 rounded-lg transition-colors"
                >
                  Revoke
                </button>
              )}
            </div>
          ))}
        </div>
      </SettingsCard>

      {/* Trusted Devices */}
      <SettingsCard>
        <SectionHeader title="Trusted Devices" />
        <div className="space-y-3">
          {settings.security.trustedDevices.map((device) => (
            <div key={device.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-[#1e3a5f]">
                  {device.name.includes('iPhone') ? <Smartphone className="w-5 h-5" /> : <Monitor className="w-5 h-5" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-slate-800">{device.name}</p>
                    {device.isCurrent && (
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                        This device
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-500">
                    {device.browser} • {device.os} • {device.location}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => handleRemoveDevice(device.id)}
                className="px-4 py-2 text-red-600 font-medium hover:bg-red-50 rounded-lg transition-colors"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </SettingsCard>

      {/* Success Toast */}
      <SuccessToast
        message={successMessage}
        isVisible={!!successMessage}
        onClose={() => setSuccessMessage('')}
      />
    </div>
  );
};

// Notification Settings Section
const NotificationSettings: React.FC = () => {
  const { settings, updateNotificationSettings } = useSettings();

  return (
    <div className="space-y-6">
      <SectionHeader 
        title="Notification Settings" 
        description="Choose how you want to be notified"
      />

      {/* Email Notifications */}
      <SettingsCard>
        <SectionHeader title="Email Notifications" />
        <div className="space-y-3">
          <SettingRow
            icon={<Mail className="w-5 h-5" />}
            title="Job Matches"
            description="Get notified when new jobs match your profile"
          >
            <ToggleSwitch
              enabled={settings.notifications.emailJobMatches}
              onChange={(enabled) => updateNotificationSettings({ emailJobMatches: enabled })}
            />
          </SettingRow>
          <SettingRow
            icon={<FileText className="w-5 h-5" />}
            title="Application Updates"
            description="Updates on your job applications"
          >
            <ToggleSwitch
              enabled={settings.notifications.emailApplicationUpdates}
              onChange={(enabled) => updateNotificationSettings({ emailApplicationUpdates: enabled })}
            />
          </SettingRow>
          <SettingRow
            icon={<Calendar className="w-5 h-5" />}
            title="Interview Reminders"
            description="Reminders for upcoming interviews"
          >
            <ToggleSwitch
              enabled={settings.notifications.emailInterviewReminders}
              onChange={(enabled) => updateNotificationSettings({ emailInterviewReminders: enabled })}
            />
          </SettingRow>
          <SettingRow
            icon={<MessageSquare className="w-5 h-5" />}
            title="Message Notifications"
            description="Get notified when you receive messages"
          >
            <ToggleSwitch
              enabled={settings.notifications.emailMessageNotifications}
              onChange={(enabled) => updateNotificationSettings({ emailMessageNotifications: enabled })}
            />
          </SettingRow>
          <SettingRow
            icon={<DollarSign className="w-5 h-5" />}
            title="Payment Notifications"
            description="Updates about payments and transactions"
          >
            <ToggleSwitch
              enabled={settings.notifications.emailPaymentNotifications}
              onChange={(enabled) => updateNotificationSettings({ emailPaymentNotifications: enabled })}
            />
          </SettingRow>
          <SettingRow
            icon={<Shield className="w-5 h-5" />}
            title="Security Alerts"
            description="Important security notifications"
          >
            <ToggleSwitch
              enabled={settings.notifications.emailSecurityAlerts}
              onChange={(enabled) => updateNotificationSettings({ emailSecurityAlerts: enabled })}
            />
          </SettingRow>
          <SettingRow
            icon={<Bell className="w-5 h-5" />}
            title="Weekly Digest"
            description="Weekly summary of activity"
          >
            <ToggleSwitch
              enabled={settings.notifications.emailWeeklyDigest}
              onChange={(enabled) => updateNotificationSettings({ emailWeeklyDigest: enabled })}
            />
          </SettingRow>
          <SettingRow
            icon={<Zap className="w-5 h-5" />}
            title="Promotions & Tips"
            description="Product updates and promotional content"
          >
            <ToggleSwitch
              enabled={settings.notifications.emailPromotions}
              onChange={(enabled) => updateNotificationSettings({ emailPromotions: enabled })}
            />
          </SettingRow>
        </div>
      </SettingsCard>

      {/* Push Notifications */}
      <SettingsCard>
        <SectionHeader title="Push Notifications" />
        <div className="space-y-3">
          <SettingRow
            icon={<Bell className="w-5 h-5" />}
            title="Enable Push Notifications"
            description="Receive notifications on your device"
          >
            <ToggleSwitch
              enabled={settings.notifications.pushEnabled}
              onChange={(enabled) => updateNotificationSettings({ pushEnabled: enabled })}
            />
          </SettingRow>
          {settings.notifications.pushEnabled && (
            <>
              <SettingRow title="Job Matches">
                <ToggleSwitch
                  enabled={settings.notifications.pushJobMatches}
                  onChange={(enabled) => updateNotificationSettings({ pushJobMatches: enabled })}
                />
              </SettingRow>
              <SettingRow title="Application Updates">
                <ToggleSwitch
                  enabled={settings.notifications.pushApplicationUpdates}
                  onChange={(enabled) => updateNotificationSettings({ pushApplicationUpdates: enabled })}
                />
              </SettingRow>
              <SettingRow title="Interview Reminders">
                <ToggleSwitch
                  enabled={settings.notifications.pushInterviewReminders}
                  onChange={(enabled) => updateNotificationSettings({ pushInterviewReminders: enabled })}
                />
              </SettingRow>
              <SettingRow title="Messages">
                <ToggleSwitch
                  enabled={settings.notifications.pushMessages}
                  onChange={(enabled) => updateNotificationSettings({ pushMessages: enabled })}
                />
              </SettingRow>
              <SettingRow title="Payments">
                <ToggleSwitch
                  enabled={settings.notifications.pushPayments}
                  onChange={(enabled) => updateNotificationSettings({ pushPayments: enabled })}
                />
              </SettingRow>
            </>
          )}
        </div>
      </SettingsCard>

      {/* SMS Notifications */}
      <SettingsCard>
        <SectionHeader title="SMS Notifications" />
        <div className="space-y-3">
          <SettingRow
            icon={<Smartphone className="w-5 h-5" />}
            title="Enable SMS Notifications"
            description="Receive text messages for important updates"
          >
            <ToggleSwitch
              enabled={settings.notifications.smsEnabled}
              onChange={(enabled) => updateNotificationSettings({ smsEnabled: enabled })}
            />
          </SettingRow>
          {settings.notifications.smsEnabled && (
            <>
              <SettingRow title="Interview Reminders">
                <ToggleSwitch
                  enabled={settings.notifications.smsInterviewReminders}
                  onChange={(enabled) => updateNotificationSettings({ smsInterviewReminders: enabled })}
                />
              </SettingRow>
              <SettingRow title="Security Alerts">
                <ToggleSwitch
                  enabled={settings.notifications.smsSecurityAlerts}
                  onChange={(enabled) => updateNotificationSettings({ smsSecurityAlerts: enabled })}
                />
              </SettingRow>
              <SettingRow title="Payment Notifications">
                <ToggleSwitch
                  enabled={settings.notifications.smsPaymentNotifications}
                  onChange={(enabled) => updateNotificationSettings({ smsPaymentNotifications: enabled })}
                />
              </SettingRow>
            </>
          )}
        </div>
      </SettingsCard>

      {/* Quiet Hours */}
      <SettingsCard>
        <SectionHeader title="Quiet Hours" description="Pause notifications during specific hours" />
        <div className="space-y-4">
          <SettingRow
            icon={<Moon className="w-5 h-5" />}
            title="Enable Quiet Hours"
            description="Don't disturb me during these hours"
          >
            <ToggleSwitch
              enabled={settings.notifications.quietHoursEnabled}
              onChange={(enabled) => updateNotificationSettings({ quietHoursEnabled: enabled })}
            />
          </SettingRow>
          {settings.notifications.quietHoursEnabled && (
            <div className="flex gap-4 p-4 bg-slate-50 rounded-xl">
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 mb-1">Start Time</label>
                <input
                  type="time"
                  value={settings.notifications.quietHoursStart}
                  onChange={(e) => updateNotificationSettings({ quietHoursStart: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 mb-1">End Time</label>
                <input
                  type="time"
                  value={settings.notifications.quietHoursEnd}
                  onChange={(e) => updateNotificationSettings({ quietHoursEnd: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]"
                />
              </div>
            </div>
          )}
        </div>
      </SettingsCard>
    </div>
  );
};

// Privacy Settings Section
const PrivacySettings: React.FC = () => {
  const { settings, updatePrivacySettings } = useSettings();

  return (
    <div className="space-y-6">
      <SectionHeader 
        title="Privacy Settings" 
        description="Control your privacy and data sharing preferences"
      />

      {/* Profile Visibility */}
      <SettingsCard>
        <SectionHeader title="Profile Visibility" />
        <div className="space-y-4">
          <div className="p-4 bg-slate-50 rounded-xl">
            <p className="text-sm font-medium text-slate-700 mb-3">Who can see your profile?</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { id: 'public', label: 'Public', description: 'Anyone can view', icon: Globe },
                { id: 'connections', label: 'Connections', description: 'Only connections', icon: User },
                { id: 'private', label: 'Private', description: 'Only you', icon: Lock },
              ].map((option) => (
                <button
                  key={option.id}
                  onClick={() => updatePrivacySettings({ profileVisibility: option.id as any })}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    settings.privacy.profileVisibility === option.id
                      ? 'border-[#1e3a5f] bg-[#1e3a5f]/5'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <option.icon className={`w-5 h-5 mb-2 ${
                    settings.privacy.profileVisibility === option.id ? 'text-[#1e3a5f]' : 'text-slate-400'
                  }`} />
                  <p className="font-semibold text-slate-800">{option.label}</p>
                  <p className="text-sm text-slate-500">{option.description}</p>
                </button>
              ))}
            </div>
          </div>

          <SettingRow
            icon={<Eye className="w-5 h-5" />}
            title="Show in Search Results"
            description="Allow your profile to appear in search results"
          >
            <ToggleSwitch
              enabled={settings.privacy.showInSearchResults}
              onChange={(enabled) => updatePrivacySettings({ showInSearchResults: enabled })}
            />
          </SettingRow>
          <SettingRow
            icon={<Mail className="w-5 h-5" />}
            title="Allow Recruiter Contact"
            description="Let recruiters contact you about opportunities"
          >
            <ToggleSwitch
              enabled={settings.privacy.allowRecruiterContact}
              onChange={(enabled) => updatePrivacySettings({ allowRecruiterContact: enabled })}
            />
          </SettingRow>
          <SettingRow
            icon={<DollarSign className="w-5 h-5" />}
            title="Show Earnings"
            description="Display your earnings on your profile"
          >
            <ToggleSwitch
              enabled={settings.privacy.showEarnings}
              onChange={(enabled) => updatePrivacySettings({ showEarnings: enabled })}
            />
          </SettingRow>
          <SettingRow
            icon={<FileText className="w-5 h-5" />}
            title="Show Work History"
            description="Display your work history on your profile"
          >
            <ToggleSwitch
              enabled={settings.privacy.showWorkHistory}
              onChange={(enabled) => updatePrivacySettings({ showWorkHistory: enabled })}
            />
          </SettingRow>
          <SettingRow
            icon={<Clock className="w-5 h-5" />}
            title="Show Last Active"
            description="Let others see when you were last online"
          >
            <ToggleSwitch
              enabled={settings.privacy.showLastActive}
              onChange={(enabled) => updatePrivacySettings({ showLastActive: enabled })}
            />
          </SettingRow>
        </div>
      </SettingsCard>

      {/* Data & Privacy */}
      <SettingsCard>
        <SectionHeader title="Data & Privacy" />
        <div className="space-y-3">
          <SettingRow
            icon={<Globe className="w-5 h-5" />}
            title="Allow Profile Indexing"
            description="Let search engines index your profile"
          >
            <ToggleSwitch
              enabled={settings.privacy.allowProfileIndexing}
              onChange={(enabled) => updatePrivacySettings({ allowProfileIndexing: enabled })}
            />
          </SettingRow>
          <SettingRow
            icon={<Database className="w-5 h-5" />}
            title="Share Data with Partners"
            description="Share anonymized data with our partners"
          >
            <ToggleSwitch
              enabled={settings.privacy.shareDataWithPartners}
              onChange={(enabled) => updatePrivacySettings({ shareDataWithPartners: enabled })}
            />
          </SettingRow>
          <SettingRow
            icon={<Zap className="w-5 h-5" />}
            title="Personalized Ads"
            description="See ads based on your activity"
          >
            <ToggleSwitch
              enabled={settings.privacy.personalizedAds}
              onChange={(enabled) => updatePrivacySettings({ personalizedAds: enabled })}
            />
          </SettingRow>
          <SettingRow
            icon={<Eye className="w-5 h-5" />}
            title="Activity Tracking"
            description="Allow us to track your activity for improvements"
          >
            <ToggleSwitch
              enabled={settings.privacy.activityTracking}
              onChange={(enabled) => updatePrivacySettings({ activityTracking: enabled })}
            />
          </SettingRow>
        </div>
      </SettingsCard>

      {/* Data Management */}
      <SettingsCard>
        <SectionHeader title="Data Management" />
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-[#1e3a5f]">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium text-slate-800">Download Your Data</p>
                <p className="text-sm text-slate-500">Get a copy of all your data</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-[#1e3a5f] text-white rounded-lg font-medium hover:bg-[#2d5a8c] transition-colors">
              Request Download
            </button>
          </div>
        </div>
      </SettingsCard>
    </div>
  );
};

// Billing Settings Section
const BillingSettings: React.FC = () => {
  const { settings, addPaymentMethod, removePaymentMethod, addWithdrawalMethod, removeWithdrawalMethod, updatePaymentSettings } = useSettings();
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [showAddWithdrawal, setShowAddWithdrawal] = useState(false);
  const [showEditBillingAddress, setShowEditBillingAddress] = useState(false);
  const [showEditTaxInfo, setShowEditTaxInfo] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleAddPayment = (method: any) => {
    addPaymentMethod(method);
    setSuccessMessage('Payment method added successfully');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleAddWithdrawal = (method: any) => {
    addWithdrawalMethod(method);
    setSuccessMessage('Withdrawal method added successfully');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleSaveBillingAddress = (address: any) => {
    updatePaymentSettings({ billingAddress: address });
    setSuccessMessage('Billing address updated successfully');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleSaveTaxInfo = (taxInfo: any) => {
    updatePaymentSettings({ taxInfo });
    setSuccessMessage('Tax information updated successfully');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <div className="space-y-6">
      <SectionHeader 
        title="Billing & Payments" 
        description="Manage your payment methods and billing information"
      />

      {/* Payment Methods */}
      <SettingsCard>
        <SectionHeader 
          title="Payment Methods" 
          action={
            <button 
              onClick={() => setShowAddPayment(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#1e3a5f] text-white rounded-lg font-medium hover:bg-[#2d5a8c] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Payment Method
            </button>
          }
        />
        <div className="space-y-3">
          {settings.payment.paymentMethods.map((method) => (
            <div key={method.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-[#1e3a5f]">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-slate-800">{method.name}</p>
                    {method.isDefault && (
                      <span className="px-2 py-0.5 bg-[#1e3a5f]/10 text-[#1e3a5f] text-xs font-medium rounded-full">
                        Default
                      </span>
                    )}
                    {method.isVerified && (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                  {method.expiryDate && (
                    <p className="text-sm text-slate-500">Expires {method.expiryDate}</p>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                {!method.isDefault && (
                  <button 
                    onClick={() => updatePaymentSettings({ defaultPaymentMethod: method.id })}
                    className="px-3 py-1.5 text-[#1e3a5f] font-medium hover:bg-slate-100 rounded-lg transition-colors text-sm"
                  >
                    Set Default
                  </button>
                )}
                <button 
                  onClick={() => removePaymentMethod(method.id)}
                  className="px-3 py-1.5 text-red-600 font-medium hover:bg-red-50 rounded-lg transition-colors text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </SettingsCard>

      {/* Withdrawal Methods */}
      <SettingsCard>
        <SectionHeader 
          title="Withdrawal Methods" 
          action={
            <button 
              onClick={() => setShowAddWithdrawal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#1e3a5f] text-white rounded-lg font-medium hover:bg-[#2d5a8c] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Withdrawal Method
            </button>
          }
        />
        <div className="space-y-3">
          {settings.payment.withdrawalMethods.map((method) => (
            <div key={method.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-[#1e3a5f]">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-slate-800">{method.name}</p>
                    {method.isDefault && (
                      <span className="px-2 py-0.5 bg-[#1e3a5f]/10 text-[#1e3a5f] text-xs font-medium rounded-full">
                        Default
                      </span>
                    )}
                    {method.isVerified && (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                  <p className="text-sm text-slate-500 capitalize">{method.type} Transfer</p>
                </div>
              </div>
              <div className="flex gap-2">
                {!method.isDefault && (
                  <button 
                    onClick={() => updatePaymentSettings({ defaultWithdrawalMethod: method.id })}
                    className="px-3 py-1.5 text-[#1e3a5f] font-medium hover:bg-slate-100 rounded-lg transition-colors text-sm"
                  >
                    Set Default
                  </button>
                )}
                <button 
                  onClick={() => removeWithdrawalMethod(method.id)}
                  className="px-3 py-1.5 text-red-600 font-medium hover:bg-red-50 rounded-lg transition-colors text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </SettingsCard>

      {/* Auto Withdraw */}
      <SettingsCard>
        <SectionHeader title="Auto Withdraw" />
        <div className="space-y-4">
          <SettingRow
            icon={<RefreshCw className="w-5 h-5" />}
            title="Enable Auto Withdraw"
            description="Automatically withdraw when balance reaches threshold"
          >
            <ToggleSwitch
              enabled={settings.payment.autoWithdraw}
              onChange={(enabled) => updatePaymentSettings({ autoWithdraw: enabled })}
            />
          </SettingRow>
          {settings.payment.autoWithdraw && (
            <div className="p-4 bg-slate-50 rounded-xl">
              <label className="block text-sm font-medium text-slate-700 mb-2">Threshold Amount</label>
              <div className="flex items-center gap-2">
                <span className="text-slate-500">$</span>
                <input
                  type="number"
                  value={settings.payment.autoWithdrawThreshold}
                  onChange={(e) => updatePaymentSettings({ autoWithdrawThreshold: parseInt(e.target.value) })}
                  className="w-32 p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]"
                />
              </div>
            </div>
          )}
        </div>
      </SettingsCard>

      {/* Billing Address */}
      <SettingsCard>
        <SectionHeader 
          title="Billing Address" 
          action={
            <button 
              onClick={() => setShowEditBillingAddress(true)}
              className="text-[#1e3a5f] font-medium hover:underline"
            >
              Edit
            </button>
          }
        />
        <div className="p-4 bg-slate-50 rounded-xl">
          <p className="text-slate-800">{settings.payment.billingAddress.street}</p>
          <p className="text-slate-800">
            {settings.payment.billingAddress.city}, {settings.payment.billingAddress.state} {settings.payment.billingAddress.zipCode}
          </p>
          <p className="text-slate-800">{settings.payment.billingAddress.country}</p>
        </div>
      </SettingsCard>

      {/* Tax Information */}
      <SettingsCard>
        <SectionHeader 
          title="Tax Information" 
          action={
            <button 
              onClick={() => setShowEditTaxInfo(true)}
              className="text-[#1e3a5f] font-medium hover:underline"
            >
              Update
            </button>
          }
        />
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
            <div>
              <p className="font-medium text-slate-800">Tax ID ({settings.payment.taxInfo.taxIdType.toUpperCase()})</p>
              <p className="text-sm text-slate-500">{settings.payment.taxInfo.taxId}</p>
            </div>
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
            <div>
              <p className="font-medium text-slate-800">W-9 Form</p>
              <p className="text-sm text-slate-500">
                {settings.payment.taxInfo.w9Submitted ? 'Submitted' : 'Not submitted'}
              </p>
            </div>
            {settings.payment.taxInfo.w9Submitted ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <button className="px-4 py-2 bg-[#1e3a5f] text-white rounded-lg font-medium hover:bg-[#2d5a8c] transition-colors text-sm">
                Submit W-9
              </button>
            )}
          </div>
        </div>
      </SettingsCard>

      {/* Modals */}
      <AddPaymentMethodModal
        isOpen={showAddPayment}
        onClose={() => setShowAddPayment(false)}
        onAdd={handleAddPayment}
      />
      <AddWithdrawalMethodModal
        isOpen={showAddWithdrawal}
        onClose={() => setShowAddWithdrawal(false)}
        onAdd={handleAddWithdrawal}
      />
      <EditBillingAddressModal
        isOpen={showEditBillingAddress}
        onClose={() => setShowEditBillingAddress(false)}
        currentAddress={settings.payment.billingAddress}
        onSave={handleSaveBillingAddress}
      />
      <EditTaxInfoModal
        isOpen={showEditTaxInfo}
        onClose={() => setShowEditTaxInfo(false)}
        currentTaxInfo={settings.payment.taxInfo}
        onSave={handleSaveTaxInfo}
      />
      <SuccessToast
        message={successMessage}
        isVisible={!!successMessage}
        onClose={() => setSuccessMessage('')}
      />
    </div>
  );
};

// Integration Settings Section
const IntegrationSettings: React.FC = () => {
  const { settings, connectAccount, disconnectAccount, generateApiKey, revokeApiKey } = useSettings();
  const [showGenerateApiKey, setShowGenerateApiKey] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleGenerateApiKey = (name: string, permissions: string[]) => {
    generateApiKey(name, permissions);
    setSuccessMessage('API key generated successfully');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'google': return <Chrome className="w-5 h-5" />;
      case 'linkedin': return <Linkedin className="w-5 h-5" />;
      case 'github': return <Github className="w-5 h-5" />;
      case 'apple': return <Apple className="w-5 h-5" />;
      case 'facebook': return <Facebook className="w-5 h-5" />;
      case 'twitter': return <Twitter className="w-5 h-5" />;
      default: return <Link2 className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeader 
        title="Integrations" 
        description="Connect your accounts and manage API access"
      />

      {/* Connected Accounts */}
      <SettingsCard>
        <SectionHeader title="Connected Accounts" />
        <div className="space-y-3">
          {settings.integrations.connectedAccounts.map((account) => (
            <div key={account.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  account.isConnected ? 'bg-white text-[#1e3a5f]' : 'bg-slate-200 text-slate-400'
                }`}>
                  {getProviderIcon(account.provider)}
                </div>
                <div>
                  <p className="font-medium text-slate-800 capitalize">{account.provider}</p>
                  {account.isConnected ? (
                    <p className="text-sm text-slate-500">
                      {account.email || account.username || `Connected ${new Date(account.connectedAt).toLocaleDateString()}`}
                    </p>
                  ) : (
                    <p className="text-sm text-slate-400">Not connected</p>
                  )}
                </div>
              </div>
              {account.isConnected ? (
                <button 
                  onClick={() => disconnectAccount(account.provider)}
                  className="px-4 py-2 text-red-600 font-medium hover:bg-red-50 rounded-lg transition-colors"
                >
                  Disconnect
                </button>
              ) : (
                <button 
                  onClick={() => connectAccount(account.provider)}
                  className="px-4 py-2 bg-[#1e3a5f] text-white rounded-lg font-medium hover:bg-[#2d5a8c] transition-colors"
                >
                  Connect
                </button>
              )}
            </div>
          ))}
        </div>
      </SettingsCard>

      {/* Calendar Sync */}
      <SettingsCard>
        <SectionHeader title="Calendar Sync" />
        <div className="space-y-3">
          <SettingRow
            icon={<Calendar className="w-5 h-5" />}
            title="Enable Calendar Sync"
            description="Sync interviews and deadlines with your calendar"
          >
            <ToggleSwitch
              enabled={settings.integrations.calendarSync.enabled}
              onChange={(enabled) => {}}
            />
          </SettingRow>
          {settings.integrations.calendarSync.enabled && (
            <>
              <SettingRow title="Sync Interviews">
                <ToggleSwitch
                  enabled={settings.integrations.calendarSync.syncInterviews}
                  onChange={(enabled) => {}}
                />
              </SettingRow>
              <SettingRow title="Sync Deadlines">
                <ToggleSwitch
                  enabled={settings.integrations.calendarSync.syncDeadlines}
                  onChange={(enabled) => {}}
                />
              </SettingRow>
            </>
          )}
        </div>
      </SettingsCard>

      {/* API Keys */}
      <SettingsCard>
        <SectionHeader 
          title="API Keys" 
          action={
            <button 
              onClick={() => setShowGenerateApiKey(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#1e3a5f] text-white rounded-lg font-medium hover:bg-[#2d5a8c] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Generate New Key
            </button>
          }
        />
        <div className="space-y-3">
          {settings.integrations.apiKeys.map((key) => (
            <div key={key.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-[#1e3a5f]">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-slate-800">{key.name}</p>
                  <p className="text-sm text-slate-500 font-mono">{key.key.substring(0, 20)}...</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleCopyKey(key.key)}
                  className={`p-2 rounded-lg transition-colors ${copiedKey === key.key ? 'bg-green-100 text-green-600' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                  {copiedKey === key.key ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
                <button 
                  onClick={() => revokeApiKey(key.id)}
                  className="px-3 py-1.5 text-red-600 font-medium hover:bg-red-50 rounded-lg transition-colors text-sm"
                >
                  Revoke
                </button>
              </div>
            </div>
          ))}
        </div>
      </SettingsCard>

      {/* Modals */}
      <GenerateApiKeyModal
        isOpen={showGenerateApiKey}
        onClose={() => setShowGenerateApiKey(false)}
        onGenerate={handleGenerateApiKey}
      />
      <SuccessToast
        message={successMessage}
        isVisible={!!successMessage}
        onClose={() => setSuccessMessage('')}
      />
    </div>
  );
};

// Accessibility Settings Section
const AccessibilitySettings: React.FC = () => {
  const { settings, updateAccessibilitySettings } = useSettings();

  return (
    <div className="space-y-6">
      <SectionHeader 
        title="Accessibility" 
        description="Customize your experience for better accessibility"
      />

      {/* Display */}
      <SettingsCard>
        <SectionHeader title="Display" />
        <div className="space-y-4">
          <div className="p-4 bg-slate-50 rounded-xl">
            <p className="text-sm font-medium text-slate-700 mb-3">Font Size</p>
            <div className="grid grid-cols-4 gap-3">
              {[
                { id: 'small', label: 'Small' },
                { id: 'medium', label: 'Medium' },
                { id: 'large', label: 'Large' },
                { id: 'xlarge', label: 'X-Large' },
              ].map((size) => (
                <button
                  key={size.id}
                  onClick={() => updateAccessibilitySettings({ fontSize: size.id as any })}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    settings.accessibility.fontSize === size.id
                      ? 'border-[#1e3a5f] bg-[#1e3a5f]/5'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className="font-medium text-slate-700">{size.label}</span>
                </button>
              ))}
            </div>
          </div>

          <SettingRow
            icon={<Sun className="w-5 h-5" />}
            title="High Contrast"
            description="Increase contrast for better visibility"
          >
            <ToggleSwitch
              enabled={settings.accessibility.highContrast}
              onChange={(enabled) => updateAccessibilitySettings({ highContrast: enabled })}
            />
          </SettingRow>
        </div>
      </SettingsCard>

      {/* Motion */}
      <SettingsCard>
        <SectionHeader title="Motion" />
        <div className="space-y-3">
          <SettingRow
            icon={<Zap className="w-5 h-5" />}
            title="Reduced Motion"
            description="Minimize animations and transitions"
          >
            <ToggleSwitch
              enabled={settings.accessibility.reducedMotion}
              onChange={(enabled) => updateAccessibilitySettings({ reducedMotion: enabled })}
            />
          </SettingRow>
        </div>
      </SettingsCard>

      {/* Screen Reader */}
      <SettingsCard>
        <SectionHeader title="Screen Reader" />
        <div className="space-y-3">
          <SettingRow
            icon={<Volume2 className="w-5 h-5" />}
            title="Screen Reader Optimized"
            description="Optimize layout for screen readers"
          >
            <ToggleSwitch
              enabled={settings.accessibility.screenReaderOptimized}
              onChange={(enabled) => updateAccessibilitySettings({ screenReaderOptimized: enabled })}
            />
          </SettingRow>
          <SettingRow
            icon={<Settings className="w-5 h-5" />}
            title="Keyboard Navigation"
            description="Enhanced keyboard navigation support"
          >
            <ToggleSwitch
              enabled={settings.accessibility.keyboardNavigation}
              onChange={(enabled) => updateAccessibilitySettings({ keyboardNavigation: enabled })}
            />
          </SettingRow>
        </div>
      </SettingsCard>

      {/* Color Vision */}
      <SettingsCard>
        <SectionHeader title="Color Vision" />
        <div className="p-4 bg-slate-50 rounded-xl">
          <p className="text-sm font-medium text-slate-700 mb-3">Color Blind Mode</p>
          <select
            value={settings.accessibility.colorBlindMode}
            onChange={(e) => updateAccessibilitySettings({ colorBlindMode: e.target.value as any })}
            className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]"
          >
            <option value="none">None</option>
            <option value="protanopia">Protanopia (Red-Blind)</option>
            <option value="deuteranopia">Deuteranopia (Green-Blind)</option>
            <option value="tritanopia">Tritanopia (Blue-Blind)</option>
          </select>
        </div>
      </SettingsCard>
    </div>
  );
};

// Appearance Settings Section
const AppearanceSettings: React.FC = () => {
  const { settings, updateAppearanceSettings } = useSettings();

  return (
    <div className="space-y-6">
      <SectionHeader 
        title="Appearance" 
        description="Customize how the app looks and feels"
      />

      {/* Theme */}
      <SettingsCard>
        <SectionHeader title="Theme" />
        <div className="grid grid-cols-3 gap-4">
          {[
            { id: 'light', label: 'Light', icon: Sun },
            { id: 'dark', label: 'Dark', icon: Moon },
            { id: 'system', label: 'System', icon: Laptop },
          ].map((theme) => (
            <button
              key={theme.id}
              onClick={() => updateAppearanceSettings({ theme: theme.id as any })}
              className={`p-4 rounded-xl border-2 transition-all ${
                settings.appearance.theme === theme.id
                  ? 'border-[#1e3a5f] bg-[#1e3a5f]/5'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <theme.icon className={`w-8 h-8 mx-auto mb-2 ${
                settings.appearance.theme === theme.id ? 'text-[#1e3a5f]' : 'text-slate-400'
              }`} />
              <p className="font-medium text-slate-700">{theme.label}</p>
            </button>
          ))}
        </div>
      </SettingsCard>

      {/* Accent Color */}
      <SettingsCard>
        <SectionHeader title="Accent Color" />
        <div className="flex gap-3">
          {[
            '#1e3a5f', '#0ea5e9', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444'
          ].map((color) => (
            <button
              key={color}
              onClick={() => updateAppearanceSettings({ accentColor: color })}
              className={`w-10 h-10 rounded-full transition-transform ${
                settings.appearance.accentColor === color ? 'ring-2 ring-offset-2 ring-slate-400 scale-110' : ''
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </SettingsCard>

      {/* Layout */}
      <SettingsCard>
        <SectionHeader title="Layout" />
        <div className="space-y-3">
          <SettingRow
            icon={<Settings className="w-5 h-5" />}
            title="Compact Mode"
            description="Use a more compact layout"
          >
            <ToggleSwitch
              enabled={settings.appearance.compactMode}
              onChange={(enabled) => updateAppearanceSettings({ compactMode: enabled })}
            />
          </SettingRow>
          <SettingRow
            icon={<User className="w-5 h-5" />}
            title="Show Avatars"
            description="Display user avatars throughout the app"
          >
            <ToggleSwitch
              enabled={settings.appearance.showAvatars}
              onChange={(enabled) => updateAppearanceSettings({ showAvatars: enabled })}
            />
          </SettingRow>
          <SettingRow
            icon={<Zap className="w-5 h-5" />}
            title="Animations"
            description="Enable smooth animations and transitions"
          >
            <ToggleSwitch
              enabled={settings.appearance.animationsEnabled}
              onChange={(enabled) => updateAppearanceSettings({ animationsEnabled: enabled })}
            />
          </SettingRow>
        </div>
      </SettingsCard>
    </div>
  );
};

// Danger Zone Component
const DangerZone: React.FC = () => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  return (
    <SettingsCard className="border-red-200 bg-red-50/50">
      <SectionHeader 
        title="Danger Zone" 
        description="Irreversible and destructive actions"
      />
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-red-200">
          <div>
            <p className="font-medium text-red-700">Delete Account</p>
            <p className="text-sm text-slate-500">Permanently delete your account and all data</p>
          </div>
          <button 
            onClick={() => setShowDeleteConfirm(true)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            Delete Account
          </button>
        </div>

        <AnimatePresence>
          {showDeleteConfirm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 bg-white rounded-xl border border-red-200"
            >
              <div className="flex items-start gap-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0" />
                <div>
                  <p className="font-medium text-red-700">Are you absolutely sure?</p>
                  <p className="text-sm text-slate-600">
                    This action cannot be undone. This will permanently delete your account, 
                    all your data, and remove you from all teams.
                  </p>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Type "DELETE" to confirm
                </label>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="DELETE"
                />
              </div>
              <div className="flex gap-3">
                <button 
                  disabled={deleteConfirmText !== 'DELETE'}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  I understand, delete my account
                </button>
                <button 
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeleteConfirmText('');
                  }}
                  className="px-4 py-2 border border-slate-300 text-slate-600 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </SettingsCard>
  );
};

// Main Settings Section Component
const SettingsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState('account');

  const renderContent = () => {
    switch (activeTab) {
      case 'account': return <AccountSettings />;
      case 'security': return <SecuritySettings />;
      case 'notifications': return <NotificationSettings />;
      case 'privacy': return <PrivacySettings />;
      case 'billing': return <BillingSettings />;
      case 'integrations': return <IntegrationSettings />;
      case 'accessibility': return <AccessibilitySettings />;
      case 'appearance': return <AppearanceSettings />;
      default: return <AccountSettings />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1e3a5f]">Settings</h1>
        <p className="text-slate-500 mt-1">Manage your account settings and preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:w-72 flex-shrink-0">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-slate-100 sticky top-6">
            <nav className="space-y-1">
              {settingsNav.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${
                    activeTab === item.id
                      ? 'bg-[#1e3a5f] text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{item.label}</p>
                    <p className={`text-xs truncate ${
                      activeTab === item.id ? 'text-white/70' : 'text-slate-400'
                    }`}>
                      {item.description}
                    </p>
                  </div>
                  <ChevronRight className={`w-4 h-4 ${
                    activeTab === item.id ? 'text-white/70' : 'text-slate-300'
                  }`} />
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
              
              {/* Danger Zone - Show on Account tab */}
              {activeTab === 'account' && (
                <div className="mt-6">
                  <DangerZone />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default SettingsSection;
