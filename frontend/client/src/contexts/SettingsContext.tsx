/**
 * Settings Context - Comprehensive settings state management
 * Industry-standard settings like Upwork
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Types for all settings sections
export interface AccountSettings {
  email: string;
  phone: string;
  username: string;
  accountType: 'freelancer' | 'client' | 'agency';
  timezone: string;
  language: string;
  currency: string;
  dateFormat: string;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  twoFactorMethod: 'app' | 'sms' | 'email';
  loginAlerts: boolean;
  trustedDevices: TrustedDevice[];
  activeSessions: ActiveSession[];
  passwordLastChanged: string;
  securityQuestions: SecurityQuestion[];
}

export interface TrustedDevice {
  id: string;
  name: string;
  browser: string;
  os: string;
  location: string;
  lastUsed: string;
  isCurrent: boolean;
}

export interface ActiveSession {
  id: string;
  device: string;
  browser: string;
  location: string;
  ip: string;
  lastActive: string;
  isCurrent: boolean;
}

export interface SecurityQuestion {
  id: string;
  question: string;
  isSet: boolean;
}

export interface NotificationSettings {
  // Email Notifications
  emailJobMatches: boolean;
  emailApplicationUpdates: boolean;
  emailInterviewReminders: boolean;
  emailWeeklyDigest: boolean;
  emailPromotions: boolean;
  emailSecurityAlerts: boolean;
  emailPaymentNotifications: boolean;
  emailMessageNotifications: boolean;
  
  // Push Notifications
  pushEnabled: boolean;
  pushJobMatches: boolean;
  pushApplicationUpdates: boolean;
  pushInterviewReminders: boolean;
  pushMessages: boolean;
  pushPayments: boolean;
  
  // SMS Notifications
  smsEnabled: boolean;
  smsInterviewReminders: boolean;
  smsSecurityAlerts: boolean;
  smsPaymentNotifications: boolean;
  
  // Notification Schedule
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
  digestFrequency: 'daily' | 'weekly' | 'monthly' | 'never';
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'private' | 'connections';
  showInSearchResults: boolean;
  allowRecruiterContact: boolean;
  showEarnings: boolean;
  showWorkHistory: boolean;
  showLastActive: boolean;
  allowProfileIndexing: boolean;
  shareDataWithPartners: boolean;
  personalizedAds: boolean;
  activityTracking: boolean;
}

export interface PaymentSettings {
  paymentMethods: PaymentMethod[];
  defaultPaymentMethod: string;
  withdrawalMethods: WithdrawalMethod[];
  defaultWithdrawalMethod: string;
  autoWithdraw: boolean;
  autoWithdrawThreshold: number;
  billingAddress: BillingAddress;
  taxInfo: TaxInfo;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'bank';
  name: string;
  last4?: string;
  expiryDate?: string;
  isDefault: boolean;
  isVerified: boolean;
}

export interface WithdrawalMethod {
  id: string;
  type: 'bank' | 'paypal' | 'payoneer' | 'wire';
  name: string;
  accountLast4?: string;
  isDefault: boolean;
  isVerified: boolean;
}

export interface BillingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface TaxInfo {
  taxId: string;
  taxIdType: 'ssn' | 'ein' | 'itin' | 'vat';
  w9Submitted: boolean;
  taxCountry: string;
}

export interface ConnectedAccount {
  id: string;
  provider: 'google' | 'linkedin' | 'github' | 'apple' | 'facebook' | 'twitter';
  email?: string;
  username?: string;
  connectedAt: string;
  isConnected: boolean;
}

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed: string;
  permissions: string[];
}

export interface IntegrationSettings {
  connectedAccounts: ConnectedAccount[];
  apiKeys: ApiKey[];
  webhooks: Webhook[];
  calendarSync: CalendarSync;
}

export interface Webhook {
  id: string;
  url: string;
  events: string[];
  isActive: boolean;
  createdAt: string;
  lastTriggered?: string;
}

export interface CalendarSync {
  enabled: boolean;
  provider: 'google' | 'outlook' | 'apple' | null;
  syncInterviews: boolean;
  syncDeadlines: boolean;
}

export interface AccessibilitySettings {
  fontSize: 'small' | 'medium' | 'large' | 'xlarge';
  highContrast: boolean;
  reducedMotion: boolean;
  screenReaderOptimized: boolean;
  keyboardNavigation: boolean;
  colorBlindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
}

export interface AppearanceSettings {
  theme: 'light' | 'dark' | 'system';
  accentColor: string;
  compactMode: boolean;
  sidebarCollapsed: boolean;
  showAvatars: boolean;
  animationsEnabled: boolean;
}

// Full Settings State
export interface SettingsState {
  account: AccountSettings;
  security: SecuritySettings;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  payment: PaymentSettings;
  integrations: IntegrationSettings;
  accessibility: AccessibilitySettings;
  appearance: AppearanceSettings;
}

// Default settings
const defaultSettings: SettingsState = {
  account: {
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    username: 'johndoe',
    accountType: 'freelancer',
    timezone: 'America/Los_Angeles',
    language: 'en',
    currency: 'USD',
    dateFormat: 'MM/DD/YYYY',
  },
  security: {
    twoFactorEnabled: true,
    twoFactorMethod: 'app',
    loginAlerts: true,
    trustedDevices: [
      {
        id: '1',
        name: 'MacBook Pro',
        browser: 'Chrome 120',
        os: 'macOS Sonoma',
        location: 'San Francisco, CA',
        lastUsed: '2026-01-11T10:30:00Z',
        isCurrent: true,
      },
      {
        id: '2',
        name: 'iPhone 15 Pro',
        browser: 'Safari',
        os: 'iOS 17',
        location: 'San Francisco, CA',
        lastUsed: '2026-01-10T18:45:00Z',
        isCurrent: false,
      },
    ],
    activeSessions: [
      {
        id: '1',
        device: 'MacBook Pro',
        browser: 'Chrome 120',
        location: 'San Francisco, CA',
        ip: '192.168.1.xxx',
        lastActive: '2026-01-11T10:30:00Z',
        isCurrent: true,
      },
      {
        id: '2',
        device: 'iPhone 15 Pro',
        browser: 'Safari Mobile',
        location: 'San Francisco, CA',
        ip: '192.168.1.xxx',
        lastActive: '2026-01-10T18:45:00Z',
        isCurrent: false,
      },
    ],
    passwordLastChanged: '2025-12-15T00:00:00Z',
    securityQuestions: [
      { id: '1', question: 'What was the name of your first pet?', isSet: true },
      { id: '2', question: 'What city were you born in?', isSet: true },
      { id: '3', question: 'What is your mother\'s maiden name?', isSet: false },
    ],
  },
  notifications: {
    emailJobMatches: true,
    emailApplicationUpdates: true,
    emailInterviewReminders: true,
    emailWeeklyDigest: true,
    emailPromotions: false,
    emailSecurityAlerts: true,
    emailPaymentNotifications: true,
    emailMessageNotifications: true,
    pushEnabled: true,
    pushJobMatches: true,
    pushApplicationUpdates: true,
    pushInterviewReminders: true,
    pushMessages: true,
    pushPayments: true,
    smsEnabled: true,
    smsInterviewReminders: true,
    smsSecurityAlerts: true,
    smsPaymentNotifications: false,
    quietHoursEnabled: true,
    quietHoursStart: '22:00',
    quietHoursEnd: '08:00',
    digestFrequency: 'weekly',
  },
  privacy: {
    profileVisibility: 'public',
    showInSearchResults: true,
    allowRecruiterContact: true,
    showEarnings: false,
    showWorkHistory: true,
    showLastActive: true,
    allowProfileIndexing: true,
    shareDataWithPartners: false,
    personalizedAds: false,
    activityTracking: true,
  },
  payment: {
    paymentMethods: [
      {
        id: '1',
        type: 'card',
        name: 'Visa ending in 4242',
        last4: '4242',
        expiryDate: '12/27',
        isDefault: true,
        isVerified: true,
      },
      {
        id: '2',
        type: 'paypal',
        name: 'PayPal - john.doe@example.com',
        isDefault: false,
        isVerified: true,
      },
    ],
    defaultPaymentMethod: '1',
    withdrawalMethods: [
      {
        id: '1',
        type: 'bank',
        name: 'Chase Bank - Checking ****1234',
        accountLast4: '1234',
        isDefault: true,
        isVerified: true,
      },
      {
        id: '2',
        type: 'paypal',
        name: 'PayPal - john.doe@example.com',
        isDefault: false,
        isVerified: true,
      },
    ],
    defaultWithdrawalMethod: '1',
    autoWithdraw: false,
    autoWithdrawThreshold: 1000,
    billingAddress: {
      street: '123 Main Street',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102',
      country: 'United States',
    },
    taxInfo: {
      taxId: '***-**-1234',
      taxIdType: 'ssn',
      w9Submitted: true,
      taxCountry: 'United States',
    },
  },
  integrations: {
    connectedAccounts: [
      {
        id: '1',
        provider: 'google',
        email: 'john.doe@gmail.com',
        connectedAt: '2024-06-15T00:00:00Z',
        isConnected: true,
      },
      {
        id: '2',
        provider: 'linkedin',
        username: 'johndoe',
        connectedAt: '2024-06-15T00:00:00Z',
        isConnected: true,
      },
      {
        id: '3',
        provider: 'github',
        username: 'johndoe',
        connectedAt: '2024-08-20T00:00:00Z',
        isConnected: true,
      },
      {
        id: '4',
        provider: 'apple',
        connectedAt: '',
        isConnected: false,
      },
      {
        id: '5',
        provider: 'facebook',
        connectedAt: '',
        isConnected: false,
      },
      {
        id: '6',
        provider: 'twitter',
        username: '@johndoe_dev',
        connectedAt: '2024-09-10T00:00:00Z',
        isConnected: true,
      },
    ],
    apiKeys: [
      {
        id: '1',
        name: 'Production API Key',
        key: 'sk_live_xxxxxxxxxxxxx',
        createdAt: '2024-10-01T00:00:00Z',
        lastUsed: '2026-01-10T00:00:00Z',
        permissions: ['read', 'write'],
      },
    ],
    webhooks: [],
    calendarSync: {
      enabled: true,
      provider: 'google',
      syncInterviews: true,
      syncDeadlines: true,
    },
  },
  accessibility: {
    fontSize: 'medium',
    highContrast: false,
    reducedMotion: false,
    screenReaderOptimized: false,
    keyboardNavigation: true,
    colorBlindMode: 'none',
  },
  appearance: {
    theme: 'light',
    accentColor: '#1e3a5f',
    compactMode: false,
    sidebarCollapsed: false,
    showAvatars: true,
    animationsEnabled: true,
  },
};

// Context type
interface SettingsContextType {
  settings: SettingsState;
  updateAccountSettings: (updates: Partial<AccountSettings>) => void;
  updateSecuritySettings: (updates: Partial<SecuritySettings>) => void;
  updateNotificationSettings: (updates: Partial<NotificationSettings>) => void;
  updatePrivacySettings: (updates: Partial<PrivacySettings>) => void;
  updatePaymentSettings: (updates: Partial<PaymentSettings>) => void;
  updateIntegrationSettings: (updates: Partial<IntegrationSettings>) => void;
  updateAccessibilitySettings: (updates: Partial<AccessibilitySettings>) => void;
  updateAppearanceSettings: (updates: Partial<AppearanceSettings>) => void;
  addPaymentMethod: (method: PaymentMethod) => void;
  removePaymentMethod: (id: string) => void;
  addWithdrawalMethod: (method: WithdrawalMethod) => void;
  removeWithdrawalMethod: (id: string) => void;
  revokeSession: (id: string) => void;
  removeTrustedDevice: (id: string) => void;
  connectAccount: (provider: ConnectedAccount['provider']) => void;
  disconnectAccount: (provider: ConnectedAccount['provider']) => void;
  generateApiKey: (name: string, permissions: string[]) => void;
  revokeApiKey: (id: string) => void;
  resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SettingsState>(defaultSettings);

  const updateAccountSettings = (updates: Partial<AccountSettings>) => {
    setSettings(prev => ({
      ...prev,
      account: { ...prev.account, ...updates },
    }));
  };

  const updateSecuritySettings = (updates: Partial<SecuritySettings>) => {
    setSettings(prev => ({
      ...prev,
      security: { ...prev.security, ...updates },
    }));
  };

  const updateNotificationSettings = (updates: Partial<NotificationSettings>) => {
    setSettings(prev => ({
      ...prev,
      notifications: { ...prev.notifications, ...updates },
    }));
  };

  const updatePrivacySettings = (updates: Partial<PrivacySettings>) => {
    setSettings(prev => ({
      ...prev,
      privacy: { ...prev.privacy, ...updates },
    }));
  };

  const updatePaymentSettings = (updates: Partial<PaymentSettings>) => {
    setSettings(prev => ({
      ...prev,
      payment: { ...prev.payment, ...updates },
    }));
  };

  const updateIntegrationSettings = (updates: Partial<IntegrationSettings>) => {
    setSettings(prev => ({
      ...prev,
      integrations: { ...prev.integrations, ...updates },
    }));
  };

  const updateAccessibilitySettings = (updates: Partial<AccessibilitySettings>) => {
    setSettings(prev => ({
      ...prev,
      accessibility: { ...prev.accessibility, ...updates },
    }));
  };

  const updateAppearanceSettings = (updates: Partial<AppearanceSettings>) => {
    setSettings(prev => ({
      ...prev,
      appearance: { ...prev.appearance, ...updates },
    }));
  };

  const addPaymentMethod = (method: PaymentMethod) => {
    setSettings(prev => ({
      ...prev,
      payment: {
        ...prev.payment,
        paymentMethods: [...prev.payment.paymentMethods, method],
      },
    }));
  };

  const removePaymentMethod = (id: string) => {
    setSettings(prev => ({
      ...prev,
      payment: {
        ...prev.payment,
        paymentMethods: prev.payment.paymentMethods.filter(m => m.id !== id),
      },
    }));
  };

  const addWithdrawalMethod = (method: WithdrawalMethod) => {
    setSettings(prev => ({
      ...prev,
      payment: {
        ...prev.payment,
        withdrawalMethods: [...prev.payment.withdrawalMethods, method],
      },
    }));
  };

  const removeWithdrawalMethod = (id: string) => {
    setSettings(prev => ({
      ...prev,
      payment: {
        ...prev.payment,
        withdrawalMethods: prev.payment.withdrawalMethods.filter(m => m.id !== id),
      },
    }));
  };

  const revokeSession = (id: string) => {
    setSettings(prev => ({
      ...prev,
      security: {
        ...prev.security,
        activeSessions: prev.security.activeSessions.filter(s => s.id !== id),
      },
    }));
  };

  const removeTrustedDevice = (id: string) => {
    setSettings(prev => ({
      ...prev,
      security: {
        ...prev.security,
        trustedDevices: prev.security.trustedDevices.filter(d => d.id !== id),
      },
    }));
  };

  const connectAccount = (provider: ConnectedAccount['provider']) => {
    setSettings(prev => ({
      ...prev,
      integrations: {
        ...prev.integrations,
        connectedAccounts: prev.integrations.connectedAccounts.map(acc =>
          acc.provider === provider
            ? { ...acc, isConnected: true, connectedAt: new Date().toISOString() }
            : acc
        ),
      },
    }));
  };

  const disconnectAccount = (provider: ConnectedAccount['provider']) => {
    setSettings(prev => ({
      ...prev,
      integrations: {
        ...prev.integrations,
        connectedAccounts: prev.integrations.connectedAccounts.map(acc =>
          acc.provider === provider
            ? { ...acc, isConnected: false, connectedAt: '' }
            : acc
        ),
      },
    }));
  };

  const generateApiKey = (name: string, permissions: string[]) => {
    const newKey: ApiKey = {
      id: Date.now().toString(),
      name,
      key: `sk_live_${Math.random().toString(36).substring(2, 15)}`,
      createdAt: new Date().toISOString(),
      lastUsed: '',
      permissions,
    };
    setSettings(prev => ({
      ...prev,
      integrations: {
        ...prev.integrations,
        apiKeys: [...prev.integrations.apiKeys, newKey],
      },
    }));
  };

  const revokeApiKey = (id: string) => {
    setSettings(prev => ({
      ...prev,
      integrations: {
        ...prev.integrations,
        apiKeys: prev.integrations.apiKeys.filter(k => k.id !== id),
      },
    }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateAccountSettings,
        updateSecuritySettings,
        updateNotificationSettings,
        updatePrivacySettings,
        updatePaymentSettings,
        updateIntegrationSettings,
        updateAccessibilitySettings,
        updateAppearanceSettings,
        addPaymentMethod,
        removePaymentMethod,
        addWithdrawalMethod,
        removeWithdrawalMethod,
        revokeSession,
        removeTrustedDevice,
        connectAccount,
        disconnectAccount,
        generateApiKey,
        revokeApiKey,
        resetSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
